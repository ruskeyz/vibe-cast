import { NextResponse } from "next/server";

import { fal } from "@fal-ai/client";

type PodcastRequestPayload = {
  topic: string;
  tone: string;
  hostStyle: string;
  audience?: string;
  duration: number;
  talkingPoints?: string;
  callToAction?: string;
};

type FalSubscribeResult = {
  data?: Record<string, unknown>;
  output?: unknown;
  audio?: { url?: string | null };
  audioUrl?: string | null;
  segments?: unknown;
  script?: unknown;
  callToAction?: unknown;
  note?: unknown;
};

type PodcastSegment = {
  title: string;
  summary: string;
};

const fallbackSegments: PodcastSegment[] = [
  {
    title: "Hook your listeners",
    summary:
      "Lead with a tension-building cold open that previews the transformation listeners will experience.",
  },
  {
    title: "Develop the narrative",
    summary:
      "Layer research, guest voices, and host commentary while pacing out big reveals every few minutes.",
  },
  {
    title: "Close with momentum",
    summary:
      "Summarize the emotional core, restate the key insight, and guide listeners to the next step.",
  },
];

const buildPrompt = (input: PodcastRequestPayload) => {
  return [
    "You are VibeCast, an award-winning podcast showrunner.",
    "Craft a complete episode treatment with a concise cold open, three to five clearly titled segments, and a scripted outro.",
    `Topic: ${input.topic}`,
    `Tone: ${input.tone}`,
    `Host style: ${input.hostStyle}`,
    input.audience ? `Audience: ${input.audience}` : null,
    input.talkingPoints
      ? `Talking points to incorporate: ${input.talkingPoints}`
      : null,
    `Keep the total runtime near ${input.duration} minutes.`,
    input.callToAction
      ? `End with this call to action: ${input.callToAction}`
      : "End with a compelling invitation that keeps listeners engaged.",
    "Return JSON with fields: script (markdown), segments (array of {title, summary}), and audioUrl (optional).",
  ]
    .filter(Boolean)
    .join("\n");
};

const getFalCredentials = () => {
  if (process.env.FAL_KEY) {
    return process.env.FAL_KEY;
  }

  if (process.env.FAL_KEY_ID && process.env.FAL_KEY_SECRET) {
    return `${process.env.FAL_KEY_ID}:${process.env.FAL_KEY_SECRET}`;
  }

  return null;
};

const hasConfiguredFal = Boolean(getFalCredentials());
const modelId = process.env.FAL_PODCAST_MODEL;

if (hasConfiguredFal) {
  fal.config({
    credentials: getFalCredentials() ?? undefined,
  });
}

const normalizeFalResult = (
  rawResult: FalSubscribeResult,
  input: PodcastRequestPayload
) => {
  const source =
    rawResult?.data && typeof rawResult.data === "object"
      ? rawResult.data
      : rawResult;

  const script =
    typeof source?.script === "string"
      ? (source.script as string)
      : typeof source?.output === "string"
        ? (source.output as string)
        : typeof rawResult?.output === "string"
          ? (rawResult.output as string)
          : buildPrompt(input);

  const segments = Array.isArray(source?.segments)
    ? (source?.segments as unknown[])
        .filter(
          (segment): segment is PodcastSegment =>
            !!segment &&
            typeof segment === "object" &&
            typeof (segment as PodcastSegment).title === "string" &&
            typeof (segment as PodcastSegment).summary === "string"
        )
        .map((segment) => ({
          title: (segment as PodcastSegment).title.trim(),
          summary: (segment as PodcastSegment).summary.trim(),
        }))
    : fallbackSegments;

  const audioUrl =
    typeof source?.audioUrl === "string"
      ? (source.audioUrl as string)
      : source?.audio &&
          typeof (source.audio as { url?: unknown }).url === "string"
        ? ((source.audio as { url?: string }).url as string)
        : rawResult?.audio &&
            typeof rawResult.audio.url === "string"
          ? rawResult.audio.url
          : null;

  const callToAction =
    typeof source?.callToAction === "string"
      ? (source.callToAction as string)
      : input.callToAction ?? null;

  const note =
    typeof source?.note === "string"
      ? (source.note as string)
      : typeof rawResult?.note === "string"
        ? (rawResult.note as string)
        : null;

  return {
    script,
    segments,
    audioUrl,
    callToAction,
    modelId: modelId ?? null,
    note,
  };
};

const buildMockDraft = (input: PodcastRequestPayload) => {
  const script = [
    `# Cold open\nWelcome to VibeCast — today we're diving into ${input.topic.toLowerCase()}.`,
    "# Main act\nFrame the episode with three fast-moving segments, each ending on a forward-looking question.",
    "# Outro\nRecap the change listeners will feel and point them to the next touchpoint.",
  ].join("\n\n");

  return {
    script,
    segments: fallbackSegments,
    audioUrl: null,
    callToAction: input.callToAction ?? null,
    modelId: null,
    note:
      "FAL credentials are not configured. Returning a mock draft so you can continue building the experience.",
  };
};

export async function POST(request: Request) {
  let payload: Partial<PodcastRequestPayload>;

  try {
    payload = (await request.json()) as Partial<PodcastRequestPayload>;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  if (!payload?.topic || typeof payload.topic !== "string") {
    return NextResponse.json(
      { error: "A topic is required to generate an episode." },
      { status: 400 }
    );
  }

  if (!payload.duration || Number.isNaN(Number(payload.duration))) {
    return NextResponse.json(
      { error: "Please provide a numeric duration (minutes)." },
      { status: 400 }
    );
  }

  const normalizedPayload: PodcastRequestPayload = {
    topic: payload.topic.trim(),
    tone: (payload.tone ?? "inspiring").toString(),
    hostStyle: (payload.hostStyle ?? "storyteller").toString(),
    audience: payload.audience?.toString().trim(),
    duration: Math.max(3, Number(payload.duration)),
    talkingPoints: payload.talkingPoints?.toString(),
    callToAction: payload.callToAction?.toString(),
  };

  if (!hasConfiguredFal || !modelId) {
    return NextResponse.json(buildMockDraft(normalizedPayload));
  }

  try {
    const result = await fal.subscribe(modelId, {
      input: {
        topic: normalizedPayload.topic,
        tone: normalizedPayload.tone,
        host_style: normalizedPayload.hostStyle,
        audience: normalizedPayload.audience,
        duration_minutes: normalizedPayload.duration,
        talking_points: normalizedPayload.talkingPoints,
        call_to_action: normalizedPayload.callToAction,
        instructions: buildPrompt(normalizedPayload),
      },
      logs: true,
    });

    const normalizedResult = normalizeFalResult(
      (result ?? {}) as FalSubscribeResult,
      normalizedPayload
    );

    return NextResponse.json(normalizedResult);
  } catch (error) {
    const message =
      error instanceof Error && error.message.length
        ? error.message
        : "Fal generation failed. Check your function slug and credentials.";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}

