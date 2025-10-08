const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/LMS";

async function fixIndexes() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Get all indexes
    console.log("\nCurrent indexes on users collection:");
    const indexes = await usersCollection.indexes();
    console.log(JSON.stringify(indexes, null, 2));

    // Drop the problematic index if it exists
    try {
      console.log("\nAttempting to drop personal.email_1 index...");
      await usersCollection.dropIndex("personal.email_1");
      console.log("✅ Successfully dropped personal.email_1 index");
    } catch (error) {
      if (error.code === 27) {
        console.log(
          "ℹ️  Index personal.email_1 does not exist (already removed)"
        );
      } else {
        console.log("⚠️  Error dropping index:", error.message);
      }
    }

    // Show indexes after cleanup
    console.log("\nIndexes after cleanup:");
    const indexesAfter = await usersCollection.indexes();
    console.log(JSON.stringify(indexesAfter, null, 2));

    console.log("\n✅ Database indexes fixed successfully!");
    console.log("You can now restart your server and try registration again.");
  } catch (error) {
    console.error("❌ Error fixing indexes:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\nMongoDB connection closed");
    process.exit(0);
  }
}

fixIndexes();
