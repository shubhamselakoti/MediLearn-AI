/**
 * Video Quiz Cleanup Script
 * Run from your project root: node scripts/cleanup-video-quiz.js
 * 
 * This script removes duplicate video quiz records from MongoDB
 * keeping only the most recent attempt per user per video
 */

const mongoose = require("mongoose");
require("dotenv").config();

// Import your models
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

const cleanupDuplicates = async () => {
  try {
    const VideoQuizScore = mongoose.model("VideoQuizScore");
    
    // Get all records sorted by creation date (newest first)
    const records = await VideoQuizScore.find({}).sort({ createdAt: -1 });
    console.log(`📊 Total records: ${records.length}`);

    // Group by userId and videoUrl
    const grouped = {};
    records.forEach((record) => {
      const key = `${record.userId}|${record.videoUrl}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(record);
    });

    // Find and delete duplicates
    let deletedCount = 0;
    const idsToDelete = [];

    Object.entries(grouped).forEach(([key, videoRecords]) => {
      if (videoRecords.length > 1) {
        console.log(
          `🗑️  Found ${videoRecords.length} duplicates for ${key}`
        );
        // Keep the first (most recent), delete the rest
        videoRecords.slice(1).forEach((record) => {
          idsToDelete.push(record._id);
          deletedCount++;
        });
      }
    });

    if (idsToDelete.length > 0) {
      await VideoQuizScore.deleteMany({ _id: { $in: idsToDelete } });
      console.log(`✅ Deleted ${deletedCount} duplicate records`);
    } else {
      console.log("✅ No duplicates found!");
    }

    // Show remaining records per user
    const remaining = await VideoQuizScore.countDocuments();
    console.log(`📈 Final record count: ${remaining}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Cleanup error:", error);
    process.exit(1);
  }
};

connectDB().then(cleanupDuplicates);
