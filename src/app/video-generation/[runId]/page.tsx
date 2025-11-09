"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function VideoGenerationResultPage() {
  const params = useParams();
  const runId = params.runId as string;

  const [status, setStatus] = useState<"loading" | "completed" | "error">("loading");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateVideo = async () => {
      try {
        // Check if we already have a cached result
        const cachedResult = localStorage.getItem(`${runId}_result`);
        if (cachedResult) {
          setVideoUrl(cachedResult);
          setStatus("completed");
          return;
        }

        // Get input text from localStorage
        const text = localStorage.getItem(runId);
        if (!text) {
          setError("No text found for this run ID");
          setStatus("error");
          return;
        }

        // Call API to generate video
        const response = await fetch("/api/video-generation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ runId, text }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Store result in localStorage
        localStorage.setItem(`${runId}_result`, data.videoUrl);

        setVideoUrl(data.videoUrl);
        setStatus("completed");
      } catch (err) {
        console.error("Video generation error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setStatus("error");
      }
    };

    generateVideo();
  }, [runId]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-6">
        <h1 className="text-2xl font-bold mb-6">Video Generation</h1>

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating your video...</p>
            <p className="text-sm text-muted-foreground">This may take a few moments</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-12">
            <p className="text-destructive font-semibold mb-2">Error</p>
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {status === "completed" && videoUrl && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Run ID: {runId}</p>
            <div className="aspect-[9/16] max-w-md mx-auto bg-black rounded-lg overflow-hidden">
              <video
                src={videoUrl}
                controls
                className="w-full h-full"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
