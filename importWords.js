import mongoose from "mongoose";
import fetch from "node-fetch";
import Word from "../models/Word.js";

mongoose.connect("mongodb://localhost:27017/word_antakshari", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function importWords() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt"
    );
    const text = await response.text();
    const words = text
      .split("\n")
      .map((w) => w.trim())
      .filter(Boolean);

    await Word.insertMany(
      words.map((w) => ({ word: w })),
      { ordered: false }
    );
    console.log("Words imported successfully.");
  } catch (error) {
    console.error("Error importing words:", error);
  } finally {
    mongoose.disconnect();
  }
}

importWords();
