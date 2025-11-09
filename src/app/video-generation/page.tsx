"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export default function VideoGenerationPage() {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleGenerate = () => {
    if (!text.trim()) return;

    const runId = crypto.randomUUID();
    localStorage.setItem(runId, text);
    router.push(`/video-generation/${runId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Video Generation</h1>

        <div className="space-y-4">
          <Textarea
            placeholder="Enter your corporate announcement..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px]"
          />

          <Button
            onClick={handleGenerate}
            disabled={!text.trim()}
            className="w-full"
            size="lg"
          >
            Brainrot my corporate announceme
          </Button>
        </div>
      </Card>
    </div>
  );
}
