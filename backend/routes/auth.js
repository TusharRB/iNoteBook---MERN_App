/* eslint-disable no-undef */
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = "Tusharisagoodb$oy";

// const { error } = require('console');


// Route 1 : Create a user using : POST "/api/auth/createuser" . no login required
router.post('/createuser', [
    body('name', 'Name length should be minimum 3 ').isLength({ min: 3 }),
    body('email', 'Email is not valid').isEmail(),
    body('password', 'Password must be at least 5 character').isLength({ min: 5 })

], async (req, res) => {                 // ('/' (string) , (callBack fn))

    // if there are errors , return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // check whether the user with this email exists already

        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ errors: "Sorry a user with this email is already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,

        })

        // .then(user => res.json(user))
        // .catch(err => {
        //     res.json({ error: 'please enter unique value for email', message: err.message })
        // })

        // res.send(req.body)

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken })

        // res.send(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred")
    }
})


// Route 2 : Authenticate a user using : POST "/api/auth/login" . no login required
router.post('/login', [
    body('email', 'Email is not valid').isEmail(),
    body('password', 'Password can not be blank').exists()

], async (req, res) => {

    let success = false;
    // if there are errors , return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success , authtoken })


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// Route 3 : Get logged in user details : POST "/api/auth/getuser" . Login required

router.post('/getuser', fetchuser, async (req, res) => {

    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router