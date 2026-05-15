import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    const users = await User.find({})
      .sort({ xp: -1 })
      .limit(50)
      .select("name image xp streak level")
      .lean();

    const entries = users.map((u, i) => ({
      rank: i + 1,
      userId: String(u._id),
      name: u.name,
      image: u.image,
      xp: u.xp,
      streak: u.streak,
      level: u.level,
      isCurrentUser: String(u._id) === session.user.id,
    }));

    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ success: false, error: "Failed to load leaderboard" }, { status: 500 });
  }
}
