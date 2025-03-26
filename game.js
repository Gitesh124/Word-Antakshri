import express from "express";
import Word from "../models/Word.js";
const router = express.Router();

router.get("/start", async (req, res) => {
  try {
    const count = await Word.countDocuments();
    console.log("Word count:", count);

    if (count === 0) {
      return res.status(500).json({
        message: "No words in the database. Please run the import script.",
      });
    }

    const randomIndex = Math.floor(Math.random() * count);
    const randomWord = await Word.findOne().skip(randomIndex);
    console.log("Random word:", randomWord);

    res.json({ word: randomWord.word });
  } catch (error) {
    console.error("Error in /start route:", error);
    res.status(500).json({ message: "Error starting game." });
  }
});

router.post("/play", async (req, res) => {
  const { previousWord, userWord } = req.body;

  if (!previousWord || !userWord) {
    return res.status(400).json({ success: false, message: "Invalid input." });
  }

  if (userWord[0].toLowerCase() !== previousWord.slice(-1).toLowerCase()) {
    return res.json({
      success: false,
      message: "Word does not start with the required letter.",
    });
  }

  try {
    const valid = await Word.findOne({ word: userWord.toLowerCase() });
    if (!valid) {
      return res.json({ success: false, message: "Invalid word!" });
    }

    const wordScore = userWord.length;
    const count = await Word.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const newWord = await Word.findOne().skip(randomIndex);

    res.json({ success: true, newWord: newWord.word, score: wordScore });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

export default router;
