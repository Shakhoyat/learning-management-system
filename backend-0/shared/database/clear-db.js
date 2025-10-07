require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const connectDB = require("./connection");

const clearDatabase = async () => {
  await connectDB();

  try {
    await mongoose.connection.dropDatabase();
    console.log("Database cleared successfully.");
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await mongoose.connection.close();
  }
};

clearDatabase();
