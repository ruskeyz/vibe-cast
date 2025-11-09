"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ListMusic,
  Loader2,
  Mic2,
  Sparkles,
  Wand2,
  Waves,
} from "lucide-react";

type PodcastSegment = {
  title: string;
  summary: string;
};

type PodcastDraft = {
  script: string;
  segments: PodcastSegment[];
  audioUrl?: string | null;
  callToAction?: string | null;
  modelId?: string | null;
  note?: string | null;
};

type DraftPayload = Record<string, unknown> & {
  script?: unknown;
  segments?: unknown;
  audioUrl?: unknown;
  audio?: { url?: string | null };
  callToAction?: unknown;
  modelId?: unknown;
  note?: unknown;
};

type FormState = {
  topic: string;
  tone: string;
  hostStyle: string;
  audience: string;
  duration: string;
  talkingPoints: string;
  callToAction: string;
};

const toneOptions = [
  { label: "Inspiring", value: "inspiring" },
  { label: "Informative", value: "informative" },
  { label: "Casual", value: "casual" },
  { label: "Humorous", value: "humorous" },
  { label: "Analytical", value: "analytical" },
];

const hostStyles = [
  { label: "Storyteller", value: "storyteller" },
  { label: "Journalist", value: "journalist" },
  { label: "Coach", value: "coach" },
  { label: "Panel Discussion", value: "panel" },
  { label: "Solo Narrator", value: "solo" },
];

const durationOptions = ["5", "10", "15", "20", "30"];

const starterKits: Array<Partial<FormState> & { label: string }> = [
  {
    label: "Creator Economy Deep Dive",
    topic: "The rise of AI-first creator businesses",
    tone: "analytical",
    hostStyle: "panel",
    audience: "Indie creators exploring new monetization paths",
    talkingPoints:
      "Break down 3 successful AI creator case studies. Discuss tool stacks and monetization experiments. End with actionable steps for listeners.",
  },
  {
    label: "Morning Motivation",
    topic: "Reframing setbacks as fuel for momentum",
    tone: "inspiring",
    hostStyle: "coach",
    audience: "Early-stage founders starting their day",
    talkingPoints:
      "Open with a relatable short story. Provide a 3-step reframing exercise. Wrap with a reflective question for the day.",
  },
  {
    label: "Tech News Byte",
    topic: "What the latest multi-modal models mean for indie devs",
    tone: "informative",
    hostStyle: "storyteller",
    audience: "Product-minded developers following AI releases",
    talkingPoints:
      "Short intro hook. Cover two current releases. Add a quick experiment listeners can ship this week.",
  },
];

const initialFormState: FormState = {
  topic: "",
  tone: "inspiring",
  hostStyle: "storyteller",
  audience: "",
  duration: "15",
  talkingPoints: "",
  callToAction: "",
};

const fallbackDraft: PodcastDraft = {
  script:
    "# Scene 1: Hook\nWelcome back to *VibeCast*, the show where we shape big ideas into binge-worthy audio. Today we unpack your topic with a host voice that feels handcrafted for your listeners.\n\n# Scene 2: Deep dive\nSegment your episode into three acts. Keep the pacing tight, tease what's next, and drop texture that pulls your audience in.\n\n# Scene 3: Wrap\nLand the episode with a vivid takeaway and a call to action that feels like the next natural step.",
  segments: [
    {
      title: "Hook your listeners",
      summary:
        "Lead with a memorable opening line, a surprising stat, or a tight anecdote that matches the tone you selected.",
    },
    {
      title: "Develop the narrative",
      summary:
        "Blend storytelling with useful insight. Alternate between the host perspective and curated expert voices.",
    },
    {
      title: "Close with momentum",
      summary:
        "Summarize the emotional core, reinforce the transformation, and invite listeners toward your call to action.",
    },
  ],
  audioUrl: null,
  callToAction: null,
};

const defaultErrorMessage =
  "We couldn’t generate a podcast draft. Double-check your Fal credentials and try again.";

const normalizeDraft = (
  payload: DraftPayload | null,
  fallbackCallToAction: string
): PodcastDraft => {
  if (!payload || typeof payload !== "object") {
    return { ...fallbackDraft, callToAction: fallbackCallToAction || null };
  }

  const source: DraftPayload =
    "draft" in payload && payload.draft && typeof payload.draft === "object"
      ? (payload.draft as DraftPayload)
      : payload;

  const script =
    typeof source.script === "string"
      ? source.script
      : typeof (source as Record<string, unknown>).output === "string"
        ? ((source as Record<string, unknown>).output as string)
        : fallbackDraft.script;

  const segments = Array.isArray(source.segments)
    ? source.segments
        .filter(
          (segment): segment is PodcastSegment =>
            !!segment &&
            typeof segment === "object" &&
            typeof (segment as PodcastSegment).title === "string" &&
            typeof (segment as PodcastSegment).summary === "string"
        )
        .map((segment) => ({
          title: segment.title.trim(),
          summary: segment.summary.trim(),
        }))
    : fallbackDraft.segments;

  const audioUrl =
    typeof source.audioUrl === "string"
      ? source.audioUrl
      : source.audio && typeof source.audio.url === "string"
        ? source.audio.url
        : null;

  const callToAction =
    typeof source.callToAction === "string" && source.callToAction.trim().length
      ? source.callToAction
      : fallbackCallToAction || fallbackDraft.callToAction;

  const modelId =
    typeof source.modelId === "string"
      ? source.modelId
      : typeof payload.modelId === "string"
        ? payload.modelId
        : null;

  const note =
    typeof payload.note === "string"
      ? payload.note
      : typeof source.note === "string"
        ? source.note
        : null;

  return { script, segments, audioUrl, callToAction: callToAction ?? null, modelId, note };
};

export default function Home() {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [draft, setDraft] = useState<PodcastDraft | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (!isGenerating) {
      return;
    }

    const id = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return prev;
        }
        return prev + 5;
      });
    }, 750);

    return () => window.clearInterval(id);
  }, [isGenerating]);

  const hasResult = useMemo(() => {
    if (!draft) {
      return false;
    }
    return Boolean(
      (draft.script && draft.script.trim().length > 0) ||
        draft.segments?.length ||
        draft.audioUrl
    );
  }, [draft]);

  const handleFieldChange = <Key extends keyof FormState>(
    key: Key,
    value: FormState[Key]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleStarterKit = (config: Partial<FormState>) => {
    setFormState((prev) => ({
      ...prev,
      ...config,
    }));
    toast.info("Preset loaded. Adjust anything you like!");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.topic.trim()) {
      toast.error("Add a podcast topic before generating.");
      return;
    }

    setIsGenerating(true);
    setProgress(12);
    setNote(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          duration: Number(formState.duration),
        }),
      });

      const payload = (await response.json().catch(() => null)) as DraftPayload | null;

      if (!response.ok) {
        const message =
          (payload && typeof payload.error === "string" && payload.error) ||
          defaultErrorMessage;
        throw new Error(message);
      }

      const normalizedDraft = normalizeDraft(payload, formState.callToAction);
      setDraft(normalizedDraft);
      setNote(normalizedDraft.note ?? null);

      toast.success("Your podcast draft is ready to fine-tune.");
    } catch (error) {
      const message =
        error instanceof Error && error.message.trim().length
          ? error.message
          : defaultErrorMessage;
      toast.error(message);
    } finally {
      setProgress(100);
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 600);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.14),_transparent_55%)] pb-16 pt-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(239,68,68,0.12),_transparent_45%)]" />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 xl:px-0">
        <header className="flex flex-col gap-6 pt-8 text-center sm:text-left">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-1 text-xs font-medium tracking-wide text-muted-foreground shadow-sm sm:mx-0">
            <Sparkles className="size-3.5 text-amber-500" />
            AI Podcast Studio
          </span>
          <div className="grid gap-4 sm:grid-cols-[1.6fr_minmax(0,1fr)] sm:items-end">
            <div className="space-y-3">
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                Produce binge-worthy podcast episodes from a single brief.
              </h1>
              <p className="text-pretty text-base text-muted-foreground md:text-lg">
                Describe your topic, choose a hosting vibe, and let VibeCast craft a script,
                episode beats, and an optional synthetic audio draft using fal.ai.
              </p>
            </div>
            <div className="hidden justify-end gap-2 sm:flex">
              {starterKits.map((kit) => (
                <button
                  key={kit.label}
                  type="button"
                  onClick={() => handleStarterKit(kit)}
                  className="rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  {kit.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="grid flex-1 gap-8 lg:grid-cols-[1.15fr_minmax(0,0.85fr)]">
          <Card className="border-border/60 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wand2 className="size-5 text-emerald-500" />
                Episode brief
              </CardTitle>
              <CardDescription>
                The clearer the brief, the stronger the episode. We’ll feed this directly into your fal.ai workflow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="topic">Podcast topic *</Label>
                  <Input
                    id="topic"
                    placeholder="e.g. Building a community around climate tech hardware"
                    value={formState.topic}
                    onChange={(event) => handleFieldChange("topic", event.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select
                      value={formState.tone}
                      onValueChange={(value) => handleFieldChange("tone", value as FormState["tone"])}
                    >
                      <SelectTrigger id="tone">
                        <SelectValue placeholder="Select a tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {toneOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="hostStyle">Host persona</Label>
                    <Select
                      value={formState.hostStyle}
                      onValueChange={(value) =>
                        handleFieldChange("hostStyle", value as FormState["hostStyle"])
                      }
                    >
                      <SelectTrigger id="hostStyle">
                        <SelectValue placeholder="Select host style" />
                      </SelectTrigger>
                      <SelectContent>
                        {hostStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="audience">Ideal listener</Label>
                  <Input
                    id="audience"
                    placeholder="Who are you speaking to?"
                    value={formState.audience}
                    onChange={(event) => handleFieldChange("audience", event.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="talkingPoints">Key talking points</Label>
                  <Textarea
                    id="talkingPoints"
                    placeholder="Bullet the angles, research, or guests you want woven into the episode."
                    value={formState.talkingPoints}
                    onChange={(event) => handleFieldChange("talkingPoints", event.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Target run time (minutes)</Label>
                    <Select
                      value={formState.duration}
                      onValueChange={(value) => handleFieldChange("duration", value as FormState["duration"])}
                    >
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((duration) => (
                          <SelectItem key={duration} value={duration}>
                            {duration} minutes
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="callToAction">Call to action</Label>
                    <Input
                      id="callToAction"
                      placeholder="e.g. Invite listeners into your Discord or course"
                      value={formState.callToAction}
                      onChange={(event) => handleFieldChange("callToAction", event.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mic2 className="size-4 text-primary" />
                    We’ll stream progress once the fal queue picks up your job.
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="inline-flex min-w-[200px] items-center justify-center gap-2"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Drafting your episode…
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        Generate with fal.ai
                      </>
                    )}
                  </Button>
                </div>

                <Progress
                  value={isGenerating ? progress : 0}
                  className={cn(
                    "h-2 overflow-hidden rounded-full bg-muted/60",
                    isGenerating ? "opacity-100" : "opacity-0"
                  )}
                />
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="border-border/60 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ListMusic className="size-5 text-primary" />
                    Episode outline
                  </CardTitle>
                  <CardDescription>
                    We’ll keep your structure tight and tailor pacing to the duration you choose.
                  </CardDescription>
                </div>
                {draft?.modelId && (
                  <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {draft.modelId}
                  </span>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {hasResult ? (
                  <>
                    <div className="space-y-4">
                      {draft?.segments?.length ? (
                        draft.segments.map((segment, index) => (
                          <div key={index} className="rounded-xl border border-border/70 bg-card px-4 py-3 shadow-sm">
                            <p className="text-sm font-medium text-foreground">{segment.title}</p>
                            <p className="text-sm text-muted-foreground">{segment.summary}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Segments will appear here once the generation completes.
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 rounded-xl border border-border/70 bg-muted/30 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                        Script draft
                      </p>
                      <div className="space-y-3 text-sm leading-6 text-foreground/90">
                        {draft?.script
                          ?.split(/\n{2,}/)
                          .filter(Boolean)
                          .map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                      </div>
                    </div>
                    {draft?.callToAction && (
                      <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm text-primary">
                        <span className="font-semibold">CTA:</span> {draft.callToAction}
                      </div>
                    )}
                    {draft?.audioUrl && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Audio preview</Label>
                        <audio
                          controls
                          className="w-full rounded-lg border border-border/70"
                          src={draft.audioUrl ?? undefined}
                        />
                      </div>
                    )}
                    {note && (
                      <p className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-3 text-xs text-muted-foreground">
                        {note}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border/70 bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground">
                    <Waves className="size-10 text-primary/70" />
                    <p>
                      Your outline, script, and optional audio preview will land here once you generate an episode.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleStarterKit(starterKits[0])}
                    >
                      <Wand2 className="size-4" />
                      Try a preset brief
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="size-4 text-amber-500" />
                  How fal.ai fits in
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-muted-foreground">
                <p>
                  Add a <code>FAL_KEY</code> (or key id &amp; secret pair) plus your preferred{" "}
                  <code>FAL_PODCAST_MODEL</code> model slug to power end-to-end generation. We’ll default to a mock draft
                  whenever credentials are missing so you can iterate on the UI locally.
                </p>
                <p>
                  Looking to blend multiple fal workflows? Fork the API route at <code>src/app/api/generate/route.ts</code>{" "}
                  to orchestrate script writing, voice cloning, music beds, and mastering in a single request.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

