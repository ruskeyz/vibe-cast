"use client";

import { ArrowRight, Play, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const socialProof = [
  "Slack ready",
  "Powered by OpenAI & FAL",
  "Loved by async teams",
];

const valueProps = [
  {
    title: "Stay in sync without the meeting drag.",
    description:
      "Convert raw transcripts into summaries that highlight decisions, blockers, and wins.",
  },
  {
    title: "Tone presets that match your culture.",
    description:
      "Choose from executive polish, product hype, or meme chaos—each keeps language on-brand.",
  },
  {
    title: "Instant distribution across every channel.",
    description:
      "Auto-publish to Slack, Teams, or Notion with captions, thumbnails, and CTA overlays baked in.",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-60 top-[-10%] h-[36rem] w-[36rem] rounded-full bg-indigo-500/40 blur-[160px]" />
        <div className="absolute right-[-20%] top-[20%] h-[40rem] w-[40rem] rounded-full bg-sky-400/30 blur-[160px]" />
        <div className="absolute bottom-[-20%] left-[30%] h-[38rem] w-[38rem] rounded-full bg-fuchsia-400/20 blur-[160px]" />
      </div>

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-10 pt-8 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background">
            SR
          </span>
          SeeReal
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          <Button className="text-sm">Generate a recap</Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Toggle navigation"
        >
          <Workflow className="size-5" />
        </Button>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-32 lg:px-8">
        <section
          id="hero"
          className="relative rounded-3xl border border-white/10 bg-white/10 p-10 shadow-[0_25px_60px_-30px_rgba(47,60,102,0.55)] backdrop-blur-xl lg:p-16"
        >
          <div className="absolute inset-x-10 top-4 mx-auto h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[2fr_1fr] lg:items-center">
            <div className="flex flex-col gap-8">
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                {socialProof.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/25 bg-white/5 px-3 py-1 text-white/80 backdrop-blur"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Gamified company and corporate announcements - scientifically
                proven way to recall information.
              </h1>
              <p className="text-pretty text-base text-white/80 sm:text-lg">
                Feed VibeCast a transcript, pick the vibe, and deliver cinematic
                updates that employees actually watch.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/video-generation"
                  className="gradient-stripe-button"
                >
                  Generate a recap
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link
                  href="/video-demo"
                  className="border border-white rounded-xl flex items-center py-4 px-4"
                >
                  <Play className="size-4 mr-1" />
                  See it in action
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-white/60 via-white/10 to-transparent blur-xl" />
              <video
                className="h-full w-full rounded-[1.5rem] object-cover"
                controls
                playsInline
                preload="metadata"
                poster="/video-poster.jpg"
              >
                <source
                  src="https://see-real-granola-hacl.s3.eu-west-2.amazonaws.com/31533847-6848-45df-9393-c73193bad0fc.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              {/* <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-br from-white/15 via-white/5 to-white/10 p-8 shadow-2xl"> */}
              {/* <div className="space-y-4"> */}
              {/*     <div className="rounded-2xl border border-white/20 bg-white/5 p-4 text-sm text-white/80"> */}
              {/*       <div className="flex items-center justify-between"> */}
              {/*         <span className="font-medium"> */}
              {/*           Executive polish template */}
              {/*         </span> */}
              {/*         <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs"> */}
              {/*           Active */}
              {/*         </span> */}
              {/*       </div> */}
              {/*       <p className="mt-3 text-white/70"> */}
              {/*         “Leadership decisions in under 60 seconds. Today we */}
              {/*         doubled revenue streams and launched the on-demand */}
              {/*         concierge.” */}
              {/*       </p> */}
              {/*     </div> */}
              {/*     <div className="rounded-2xl border border-white/20 bg-white/5 p-4 text-sm text-white/80"> */}
              {/*       <div className="flex items-center justify-between"> */}
              {/*         <span className="font-medium">Slack auto-post</span> */}
              {/*         <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs"> */}
              {/*           Queued */}
              {/*         </span> */}
              {/*       </div> */}
              {/*       <p className="mt-3 text-white/70"> */}
              {/*         Recap drops in #all-hands with thumbnails, captions, and */}
              {/*         CTA overlay baked in. */}
              {/*       </p> */}
              {/*     </div> */}
              {/*     <div className="rounded-2xl border border-white/20 bg-white/5 p-4 text-sm text-white/70"> */}
              {/*       <div className="flex items-center justify-between"> */}
              {/*         <span className="font-medium text-white/80"> */}
              {/*           Engagement snapshot */}
              {/*         </span> */}
              {/*         <ArrowRight className="size-4 text-white/60" /> */}
              {/*       </div> */}
              {/*       <div className="mt-4 grid grid-cols-2 gap-3 text-xs"> */}
              {/*         <div className="rounded-xl border border-white/15 bg-white/5 p-3"> */}
              {/*           <p className="text-white/60">Watch-through</p> */}
              {/*           <p className="mt-2 text-lg font-semibold text-white"> */}
              {/*             86% */}
              {/*           </p> */}
              {/*         </div> */}
              {/*         <div className="rounded-xl border border-white/15 bg-white/5 p-3"> */}
              {/*           <p className="text-white/60">CTA clicks</p> */}
              {/*           <p className="mt-2 text-lg font-semibold text-white"> */}
              {/*             3.1× */}
              {/*           </p> */}
              {/*         </div> */}
              {/*       </div> */}
              {/*     </div> */}
              {/*   </div> */}
              {/* </div> */}
            </div>
          </div>
        </section>

        <section id="product" className="space-y-12">
          <div className="flex flex-col gap-6 text-center">
            <div className="mx-auto rounded-full border border-border/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Why VibeCast
            </div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Updates that feel handcrafted—without the production grind.
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              The copy and structure across VibeCast’s landing page is sourced
              from our central asset bank, keeping marketing and product teams
              aligned on message.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {valueProps.map((item) => (
              <Card
                key={item.title}
                className="border-muted/50 bg-gradient-to-br from-background via-background to-primary/5 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.65)]"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-background/80 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-2 text-foreground">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-foreground/90 text-background">
              SeeReal
            </span>
            <span className="font-medium">SeeReal</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SeeReal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
