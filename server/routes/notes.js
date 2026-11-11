const express = require("express");
const mongoose = require("mongoose");
const Note = require("../models/Note");
const protect = require("../middleware/auth");

const router = express.Router();

// All note routes require authentication
router.use(protect);

// CREATE a note
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const note = await Note.create({
      title,
      content,
      user: req.userId,
    });

    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("Create note error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// GET all notes belonging to logged-in user
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json({
      notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// GET one note belonging to logged-in user
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid note ID",
      });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json({
      note,
    });
  } catch (error) {
    console.error("Get note error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// UPDATE a note belonging to logged-in user
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid note ID",
      });
    }

    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      {
        title,
        content,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json({
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    console.error("Update note error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// DELETE a note belonging to logged-in user
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid note ID",
      });
    }

    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;