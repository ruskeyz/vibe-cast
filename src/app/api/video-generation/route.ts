import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

// Configure fal client
fal.config({ credentials: process.env.FAL_KEY });

// Types
type VideoGenerationRequest = {
  runId: string;
  text: string;
};

type ProcessTextOutput = {
  narration: string;
};

type GenerateNarrationOutput = {
  audioUrl: string;
};

type VideoGenerationResponse = {
  runId: string;
  videoUrl: string;
  status: "completed";
};

// Step 1: Process transcript using fal.ai to generate narration
async function runProcessTranscript(text: string): Promise<ProcessTextOutput> {
  console.log("[Step 1] Processing transcript:", text.substring(0, 50));

  const prompt = `This is a longform text from my corporate online meeting. Analyze it, find key points, come up with the questions that may come up based on this text.
Then generate a brief recap that will be narrated outloud, make it 1-1.5 min for reading.
Return only a string of text that would be read outloud and nothing else.
Optimize the text to be entartaining and interesting.
${text}.`;

  const result = await fal.subscribe("fal-ai/any-llm/enterprise", {
    input: {
      prompt,
      priority: "latency",
      model: "google/gemini-2.5-flash"
    },
  });

  // Extract narration text from result
  console.log("[Step 1] Result:", JSON.stringify(result, null, 2));
  const narration = result.data.output as string;

  return { narration };
}

// Step 2: Generate audio narration from text using fal.ai
async function runGenerateNarration(
  processedText: ProcessTextOutput
): Promise<GenerateNarrationOutput> {
  console.log("[Step 2] Generating narration audio:", processedText.narration.substring(0, 50));

  const result = await fal.subscribe("fal-ai/elevenlabs/tts/eleven-v3", {
    input: {
      text: processedText.narration,
      voice: "George",
      stability: 0.5,
      similarity_boost: 0.75,
      speed: 1
    },
    logs: true,
  });

  console.log("[Step 2] Result:", JSON.stringify(result, null, 2));
  const audioUrl = result.data.audio.url as string;

  return { audioUrl };
}

// Step 3: Generate 9:16 video with audio using fal.ai
async function runGenerateVideo(audioUrl: string): Promise<string> {
  console.log("[Step 3] Generating video with audio:", audioUrl);

  const result = await fal.subscribe("veed/fabric-1.0/fast", {
    input: {
      image_url: "blob:https://fal.ai/4a6fe902-7156-4c01-87e7-6e92a8b8cb62",
      audio_url: audioUrl,
      resolution: "480p"
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        update.logs.map((log) => log.message).forEach(console.log);
      }
    },
  });

  console.log("[Step 3] Result:", JSON.stringify(result, null, 2));
  const videoUrl = result.data.video.url as string;

  return videoUrl;
}
-
// Step 4: Compose videos using Creatomate
async function composeVideos(generatedVideoUrl: string): Promise<string> {
  console.log("[Step 4] Composing video:", generatedVideoUrl);

  const TEMPLATE_ID = "9aba85de-a247-41a2-b976-531627d6f3a7";
  const apiKey = process.env.CREATOMATE_API_KEY;

  const response = await fetch("https://api.creatomate.com/v2/renders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      template_id: TEMPLATE_ID,
      modifications: {
        "video_talking_head": generatedVideoUrl,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Creatomate API error: ${response.status}`);
  }

  const data = await response.json();
  console.log("[Step 4] Result:", JSON.stringify(data, null, 2));

  // Extract video URL from response (structure TBD based on actual response)
  const composedVideoUrl = data.url || data.video_url || data[0]?.url;

  return composedVideoUrl;
}

export async function POST(request: Request) {
  let payload: Partial<VideoGenerationRequest>;

  // Parse request body
  try {
    payload = (await request.json()) as Partial<VideoGenerationRequest>;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  // Validate required fields
  if (!payload?.runId || typeof payload.runId !== "string") {
    return NextResponse.json(
      { error: "runId is required" },
      { status: 400 }
    );
  }

  if (!payload?.text || typeof payload.text !== "string") {
    return NextResponse.json(
      { error: "text is required" },
      { status: 400 }
    );
  }

  const { runId, text } = payload;

  try {
    console.log(`[Video Generation] Starting workflow for runId: ${runId}`);

    // Run 3-step pipeline synchronously
    const processedText = await runProcessTranscript(text);
    const narrationAudio = await runGenerateNarration(processedText);
    const videoUrl = await runGenerateVideo(narrationAudio.audioUrl);
    // TODO: Add video composition step
    // const composedVideoUrl = await composeVideos(videoUrl);

    console.log(`[Video Generation] Completed for runId: ${runId}`);

    const response: VideoGenerationResponse = {
      runId,
      videoUrl,
      status: "completed",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[Video Generation] Error:", error);

    const message =
      error instanceof Error && error.message
        ? error.message
        : "Video generation failed";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
