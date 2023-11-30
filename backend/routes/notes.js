const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{

    let obj = {
        name:"Tu",
        ph:5655
    }
    res.json(obj);
})

module.exports = router