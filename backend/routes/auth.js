const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Tusharisagoodb$oy";

// const { error } = require('console');


// Create a user using : POST "/api/auth" . no login required
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
        const secPass = await bcrypt.hash(req.body.password,salt)

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
            user:{
                id:user.id
            }
        }

        const authtoken = jwt.sign(data,JWT_SECRET);
        res.json({authtoken})
        
        // res.send(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred")
    }
})

module.exports = router