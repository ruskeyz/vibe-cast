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
Then generate a brief recap that will be narrated outloud, make it 30 seconds for reading.
Return only a string of text that would be read outloud and nothing else.
Optimize the text to be entartaining and interesting.
${text}.`;

  // const result = await fal.subscribe("fal-ai/any-llm/enterprise", {
  //   input: {
  //     prompt,
  //     priority: "latency",
  //     model: "google/gemini-2.5-flash"
  //   },
  // });
  const result = {
    "data": {
      "output": "\"Exciting news! We're celebrating a year of steady progress, hitting consistent revenue growth and strong client retention. Product enhancements and operational wins underscore our commitment to excellence. Plus, buckle up for updated equity vesting schedules designed to align your success with ours. Get ready for our 'Optimization and Focus Year' – doubling down on efficiency and growth. BasicCorporate is thriving, thanks to you!\"",
      "reasoning": null,
      "partial": false,
      "error": null
    },
    "requestId": "37917cef-a10c-4412-9079-cbb657dcf1c7"
  }

  // Extract narration text from result
  console.log("[Step 1] Result:", JSON.stringify(result, null, 2));
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const narration = result.data.output as string;

  return { narration };
}

// Step 2: Generate audio narration from text using fal.ai
async function runGenerateNarration(
  processedText: ProcessTextOutput
): Promise<GenerateNarrationOutput> {
  console.log("[Step 2] Generating narration audio:", processedText.narration.substring(0, 50));

  // const result = await fal.subscribe("fal-ai/elevenlabs/tts/eleven-v3", {
  //   input: {
  //     text: processedText.narration,
  //     voice: "George",
  //     stability: 0.5,
  //     similarity_boost: 0.75,
  //     speed: 1
  //   },
  //   logs: true,
  // });
  const result = {
    "data": {
      "audio": {
        "url": "https://v3b.fal.media/files/b/rabbit/PTmgoZ436rQtYivmNmGr7_output.mp3",
        "content_type": "audio/mpeg",
        "file_name": "output.mp3",
        "file_size": 2015444
      },
      "timestamps": null
    },
    "requestId": "68d6747d-b69f-4d08-8ba2-45bf978762f5"
  }

  console.log("[Step 2] Result:", JSON.stringify(result, null, 2));
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const audioUrl = result.data.audio.url as string;

  return { audioUrl };
}

// Step 3: Generate 9:16 video with audio using fal.ai
async function runGenerateVideo(audioUrl: string): Promise<string> {
  console.log("[Step 3] Generating video with audio:", audioUrl);

  const imageUrl = "https://see-real-granola-hacl.s3.eu-west-2.amazonaws.com/photo_2025-11-09+14.25.47.jpeg"

  // const result = await fal.subscribe("veed/fabric-1.0/fast", {
  //   input: {
  //     image_url: imageUrl,
  //     audio_url: audioUrl,
  //     resolution: "480p"
  //   },
  //   logs: true,
  //   onQueueUpdate: (update) => {
  //     if (update.status === "IN_PROGRESS") {
  //       update.logs.map((log) => log.message).forEach(console.log);
  //     }
  //   },
  // });
  const result = {
    "data": {
      "video": {
        "url": "https://v3b.fal.media/files/b/penguin/Ju4oTpN3bx4NiIaAFFsyM_tmpda3sacqs.mp4",
        "content_type": "video/mp4",
        "file_name": null,
        "file_size": null
      }
    },
    "requestId": "e515605b-b9ec-49f7-9be3-b104bbb7fba9"
  }

  console.log("[Step 3] Result:", JSON.stringify(result, null, 2));
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const videoUrl = result.data.video.url as string;

  return videoUrl;
}

// Step 4: Compose videos using Creatomate
async function composeVideos(generatedVideoUrl: string): Promise<string> {
  console.log("[Step 4] Composing video:", generatedVideoUrl);

  const TEMPLATE_ID = "a9910222-43c2-4d3e-b9aa-dc21c16608c4";
  const apiKey = process.env.CREATOMATE_API_KEY;

  // // Create render
  // const createResponse = await fetch("https://api.creatomate.com/v2/renders", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${apiKey}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     template_id: TEMPLATE_ID,
  //     modifications: {
  //       "video_talking_head": generatedVideoUrl,
  //     },
  //   }),
  // });

  // if (!createResponse.ok) {
  //   throw new Error(`Creatomate API error: ${createResponse.status}`);
  // }

  // const createData = await createResponse.json();
  // console.log("[Step 4] Render created:", JSON.stringify(createData, null, 2));

  // const renderId = createData.id;
  // if (!renderId) {
  //   throw new Error("No render ID returned from Creatomate");
  // }

  // // Poll for completion (max 5 minutes)
  // const maxWaitTime = 5 * 60 * 1000; // 5 minutes
  // const pollInterval = 5000; // 5 seconds
  // const startTime = Date.now();

  // while (Date.now() - startTime < maxWaitTime) {
  //   const statusResponse = await fetch(
  //     `https://api.creatomate.com/v2/renders/${renderId}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${apiKey}`,
  //       },
  //     }
  //   );

  //   if (!statusResponse.ok) {
  //     throw new Error(`Creatomate status check failed: ${statusResponse.status}`);
  //   }

  //   const statusData = await statusResponse.json();
  //   console.log("[Step 4] Render status:", statusData.status);

  //   if (statusData.status === "succeeded") {
  //     const videoUrl = statusData.url;
  //     console.log("[Step 4] Render completed:", videoUrl);
  //     return videoUrl;
  //   }

  //   if (statusData.status === "failed") {
  //     throw new Error(`Creatomate render failed: ${statusData.error_message || "Unknown error"}`);
  //   }

  //   // Wait 5 seconds before next poll
  //   await new Promise((resolve) => setTimeout(resolve, pollInterval));
  // }

  // throw new Error("Creatomate render timeout after 5 minutes");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return "https://f002.backblazeb2.com/file/creatomate-c8xg3hsxdu/31533847-6848-45df-9393-c73193bad0fc.mp4"
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

    // Run 4-step pipeline synchronously
    const processedText = await runProcessTranscript(text);
    const narrationAudio = await runGenerateNarration(processedText);
    const generatedVideoUrl = await runGenerateVideo(narrationAudio.audioUrl);
    const composedVideoUrl = await composeVideos(generatedVideoUrl);

    console.log(`[Video Generation] Completed for runId: ${runId}`);

    const response: VideoGenerationResponse = {
      runId,
      videoUrl: composedVideoUrl,
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
