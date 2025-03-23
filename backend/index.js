import pool from './db/dbConfig.js'
import config from './config/index.js';
import express from 'express'
import cors from 'cors'

const app = express();
const port = config.serverPort;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// all todos
app.get("/todos", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM todo ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching todos:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// new todo
app.post("/todos", async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }
        const result = await pool.query(
            "INSERT INTO todo (task) VALUES ($1) RETURNING *",
            [title]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error inserting todo:", err.message);
        res.status(500).json({ error: err.message });
    }
});

//delete
app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM todo WHERE id = $1", [id]);
        res.json({ message: "Todo deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
export { app, server };