import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import VideoQuizScore from "@/models/VideoQuizScore";

/**
 * Cleanup endpoint to remove duplicate video quiz records
 * Keeps only the latest record per user per video
 * ADMIN ONLY
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Optional: Add admin check if you have an admin field
    // if (session.user.role !== "admin") {
    //   return NextResponse.json({ success: false, error: "Admin only" }, { status: 403 });
    // }

    await connectDB();

    // Get all records grouped by userId and videoUrl
    const records = await VideoQuizScore.find({}).sort({ createdAt: -1 });

    const grouped: Record<string, Record<string, any[]>> = {};
    records.forEach((record) => {
      const userId = record.userId;
      const videoUrl = record.videoUrl;
      if (!grouped[userId]) grouped[userId] = {};
      if (!grouped[videoUrl]) grouped[userId][videoUrl] = [];
      grouped[userId][videoUrl].push(record);
    });

    // Find duplicates (keep latest, delete rest)
    let deletedCount = 0;
    const idsToDelete: string[] = [];

    Object.values(grouped).forEach((userRecords) => {
      Object.values(userRecords).forEach((videoRecords) => {
        if (videoRecords.length > 1) {
          // Keep the first (most recent due to sort), delete the rest
          videoRecords.slice(1).forEach((record) => {
            idsToDelete.push(record._id);
            deletedCount++;
          });
        }
      });
    });

    if (idsToDelete.length > 0) {
      await VideoQuizScore.deleteMany({ _id: { $in: idsToDelete } });
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${deletedCount} duplicate records`,
      deletedCount,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { success: false, error: "Cleanup failed" },
      { status: 500 }
    );
  }
}
