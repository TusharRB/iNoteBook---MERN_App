const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// Route 1 : Get all the notes using : GET "/api/auth/login" . login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {

        const notes = await Note.find({ user: req.user.id });
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred")
    }
})

// Route 2 : add a new notes using : POST "/api/auth/addnote" . login required
router.post('/addnote', fetchuser, [
    body('title', 'Title length should be minimum 3 ').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 character').isLength({ min: 5 })

], async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        // if there are errors , return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })

        const savedNote = await note.save();

        res.json(savedNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred")
    }

})


module.exports = router