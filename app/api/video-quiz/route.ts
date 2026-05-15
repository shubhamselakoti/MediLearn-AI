import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateVideoQuiz } from "@/lib/groq";
import { connectDB } from "@/lib/db";
import VideoQuizScore from "@/models/VideoQuizScore";
import { validateYouTubeUrl } from "@/lib/utils";

async function fetchTranscript(videoId: string): Promise<string> {
  const url = `https://transcriptapi.com/api/v2/youtube/transcript?video_url=${videoId}&format=json`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.YOUTUBE_TRANSCRIPT_API}` },
  });
  if (!res.ok) throw new Error("Transcript fetch failed");
  const data = await res.json();
  // Flatten transcript segments to plain text
  if (Array.isArray(data)) {
    return data.map((s: { text: string }) => s.text).join(" ");
  }
  if (data.transcript) return data.transcript;
  throw new Error("Invalid transcript format");
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { videoUrl } = await req.json();

    if (!videoUrl) {
      return NextResponse.json({ success: false, error: "Video URL is required" }, { status: 400 });
    }

    const videoId = validateYouTubeUrl(videoUrl);
    if (!videoId) {
      return NextResponse.json(
        { success: false, error: "Invalid YouTube URL. Please enter a valid YouTube link." },
        { status: 400 }
      );
    }

    // Fetch transcript
    let transcript: string;
    try {
      transcript = await fetchTranscript(videoId);
    } catch {
      return NextResponse.json(
        { success: false, error: "Could not fetch video transcript. Ensure the video has captions enabled." },
        { status: 422 }
      );
    }

    // Generate quiz with AI
    let quizData;
    try {
      quizData = await generateVideoQuiz(transcript);
    } catch {
      return NextResponse.json(
        { success: false, error: "AI quiz generation failed. Please try another video." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        questions: quizData.questions,
        title: quizData.title,
        summary: quizData.summary,
        videoId,
        videoUrl,
      },
    });
  } catch (error) {
    console.error("Video quiz error:", error);
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await req.json();
    const record = await VideoQuizScore.create({
      userId: session.user.id,
      ...body,
      attemptedAt: new Date(),
    });
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("Save video quiz error:", error);
    return NextResponse.json({ success: false, error: "Failed to save result" }, { status: 500 });
  }
}
