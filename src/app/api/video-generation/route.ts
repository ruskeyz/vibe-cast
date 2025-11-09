import { NextResponse } from "next/server";
// import { fal } from "@fal-ai/client"; // TODO: Use when implementing real fal.ai calls

// Types
type VideoGenerationRequest = {
  runId: string;
  text: string;
};

type NarrationJSON = {
  narration: string;
  segments: Array<{ text: string; duration: number }>;
};

type VideoGenerationResponse = {
  runId: string;
  videoUrl: string;
  status: "completed";
};

// Step 1: Process transcript using fal.ai to generate narration
async function runProcessTranscript(text: string): Promise<NarrationJSON> {
  // TODO: Implement fal.ai text processing
  // For now, return mock data
  console.log("[Step 1] Processing transcript:", text.substring(0, 50));

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    narration: `This is a brainrot version of: ${text}`,
    segments: [
      { text: "Segment 1 narration text", duration: 3 },
      { text: "Segment 2 narration text", duration: 4 },
    ],
  };
}

// Step 2: Generate audio narration from text using fal.ai
async function runGenerateNarration(
  narration: NarrationJSON
): Promise<string> {
  // TODO: Implement fal.ai audio generation
  console.log("[Step 2] Generating narration audio for", narration.segments.length, "segments");

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return mock mp3 URL
  return "https://example.com/mock-audio.mp3";
}

// Step 3: Generate 9:16 video with audio using fal.ai
async function runGenerateVideo(mp3Url: string): Promise<string> {
  // TODO: Implement fal.ai video generation
  console.log("[Step 3] Generating video with audio:", mp3Url);

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return mock video URL (9:16 aspect ratio)
  return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
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
    const narration = await runProcessTranscript(text);
    const mp3Url = await runGenerateNarration(narration);
    const videoUrl = await runGenerateVideo(mp3Url);

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
