"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Wand2,
  Palette,
  Clapperboard,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type TonePreset = {
  value: string;
  label: string;
  description: string;
  accent: string;
};

const tonePresets: TonePreset[] = [
  // {
  //   value: "executive",
  //   label: "Executive polish",
  //   description: "Concise, board-ready language with confident pacing and premium lower-thirds.",
  //   accent: "from-sky-500/20 via-slate-100/5 to-slate-900/10",
  // },
  // {
  //   value: "product",
  //   label: "Product hype",
  //   description: "Launch-day energy with upbeat motion cues and bold typography hits.",
  //   accent: "from-purple-500/20 via-slate-100/5 to-slate-900/10",
  // },
  {
    value: "meme",
    label: "Meme chaos",
    description:
      "Playful edits, punchy captions, and trend-driven transitions designed to go viral internally.",
    accent: "from-amber-500/25 via-slate-100/5 to-slate-900/10",
  },
];

const pipeline = [
  {
    title: "Script remix",
    description:
      "Distills the transcript into a tight, 60-second narrative that keeps decisions front and center.",
    icon: Wand2,
  },
  {
    title: "Tone styling",
    description:
      "Applies your selected vibe to avatars, captions, and motion cues automatically.",
    icon: Palette,
  },
  {
    title: "Vertical render",
    description:
      "Outputs a 9:16-ready MP4 primed for Slack, Teams, or your internal wiki.",
    icon: Clapperboard,
  },
];

export default function VideoGenerationPage() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState<TonePreset["value"]>("executive");
  const router = useRouter();

  const selectedTone = useMemo(
    () => tonePresets.find((preset) => preset.value === tone) ?? tonePresets[0],
    [tone],
  );

  const characterCount = text.length;

  const handleGenerate = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const runId = crypto.randomUUID();
    localStorage.setItem(runId, JSON.stringify({ text: trimmed, tone }));
    router.push(`/video-generation/${runId}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-[-10%] h-[32rem] w-[32rem] rounded-full bg-sky-500/30 blur-[140px]" />
        <div className="absolute right-[-15%] top-[25%] h-[40rem] w-[40rem] rounded-full bg-fuchsia-500/25 blur-[180px]" />
        <div className="absolute bottom-[-25%] left-[25%] h-[36rem] w-[36rem] rounded-full bg-blue-400/20 blur-[200px]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-900 via-slate-900/60 to-transparent" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 lg:px-8 lg:py-24">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              SeeReal Studio
            </span>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Spin transcripts into premium recap videos.
            </h1>
            <p className="max-w-2xl text-pretty text-base text-white/70 sm:text-lg">
              Drop in your company announcement notes, pick the vibe, and let
              VibeCast orchestrate script, avatars, and motion in a single
              pass—no editing deck required.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 backdrop-blur">
            <p className="font-medium text-white">Avg delivery</p>
            <p className="text-2xl font-semibold text-white">{"<"}1 mins</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">
              transcript ➝ shareable video
            </p>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
          <Card className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.08] p-6 shadow-[0_35px_80px_-40px_rgba(56,72,120,0.55)] backdrop-blur-xl lg:p-10">
            <div className="absolute inset-px rounded-[1.85rem] border border-white/5" />
            <div className="absolute inset-x-6 top-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="relative space-y-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>Transcript</span>
                  <span>{characterCount.toLocaleString()} chars</span>
                </div>
                <Textarea
                  placeholder="“Team, we just closed our biggest enterprise deal yet...“"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  className="min-h-[220px] resize-y rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-base text-white placeholder:text-white/40 focus-visible:ring-offset-0"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                  Tone preset
                </Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="h-12 w-full justify-between rounded-xl border border-white/10 bg-white/10 text-white backdrop-blur">
                    <SelectValue placeholder="Choose tone preset" />
                  </SelectTrigger>
                  <SelectContent className="min-w-[18rem] rounded-xl border border-white/10 bg-slate-900/90 text-white backdrop-blur-xl">
                    {tonePresets.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white">
                            {preset.label}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div
                  className={`rounded-xl border border-white/10 bg-gradient-to-r ${selectedTone.accent} px-4 py-3 text-sm text-white/80`}
                >
                  {selectedTone.description}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  onClick={handleGenerate}
                  disabled={!text.trim()}
                  size="lg"
                  className="h-12 flex-1 rounded-xl text-base"
                >
                  Generate AI video
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
              <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-white/60">
                <Sparkles className="h-4 w-4" />
                What you get
              </div>
              <div className="mt-6 space-y-6">
                {pipeline.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80"
                    >
                      <div className="flex items-center gap-3 text-white">
                        <span className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur">
                          <Icon className="h-4 w-4" />
                        </span>
                        <p className="text-base font-semibold">{item.title}</p>
                      </div>
                      <p className="mt-3 leading-relaxed text-white/70">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
