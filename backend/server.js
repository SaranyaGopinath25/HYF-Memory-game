import express from "express";
import knex from "knex";
import cors from "cors";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.static("backend")); // Serve static files from the images folder

// This connects to the database stored in the file mentioned below
const knexInstance = knex({
  client: "sqlite3",
  connection: {
    filename: "./backend/memory_game.sqlite3",
  },
  useNullAsDefault: true,  // Omit warning in console
});

app.get("/cards", async (req, res) => {
  try {
    const { difficulty } = req.query;

    const limits = {
      easy: 6,
      medium: 8,
      hard: 10,
    };

    const limit = limits[difficulty];

    if (!limit) {
      return res.status(400).json({
        error: "Difficulty must be easy, medium, or hard",
      });
    }

    const cards = await knexInstance("card")
      .select("id", "name", "image")
      .orderByRaw("RANDOM()")
      .limit(limit);

    res.json(cards);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});