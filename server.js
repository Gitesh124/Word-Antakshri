import express from "express";
import mongoose from "mongoose";
import gameRoutes from "./routes/game.js";

const app = express();

mongoose.connect("mongodb://localhost:27017/word_antakshari", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.static("public"));
app.use("/", gameRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
