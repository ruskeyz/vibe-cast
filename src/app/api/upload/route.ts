// app/api/upload/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const bucketName = "see-real-granola-hacl";
  const fileName = "todo.md";
  const fileContent = "test text";

  const s3Url = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

  try {
    const uploadResponse = await fetch(s3Url, {
      method: "PUT",
      body: fileContent,
      headers: {
        "Content-Type": "text/markdown",
      },
    });

    if (!uploadResponse.ok) {
      return NextResponse.json(
        { message: "Upload failed", status: uploadResponse.statusText },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "File uploaded successfully",
      url: s3Url,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error during upload", error: error.message },
      { status: 500 },
    );
  }
}
