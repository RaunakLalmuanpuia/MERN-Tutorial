const express = require("express");
const router = express.Router();

const {Users, Posts, Likes} = require("../models");

const bcrypt = require("bcrypt");

const {sign} = require('jsonwebtoken');

const jwt = require("jsonwebtoken");
const {validateToken} = require("../middlewares/AuthMiddleware");
const {} = require("bcrypt");

router.post("/", async (req, res) => {
    const {username, password} = req.body;
    bcrypt.hash(password, 10).then(hash => {
        Users.create({
            username : username,
            password: hash,

        })
        res.json({success: true});
    });
})

router.post("/login", async (req, res) => {

    const {username, password} = req.body;
    const user = await Users.findOne({where: {username : username}});

    if (!user) {
        res.json({error: "Username Doesn't Exist"});
    }

    bcrypt.compare(password, user.password).then((match)=>{
        if(!match) {
            res.json({error: "Passwords do not match"});
        }

        const accessToken = sign({username: user.username, id: user.id},"Secret");
        res.json({token: accessToken, username: username, id: user.id});


    });
})

router.get("/auth", validateToken, async (req, res) => {
    res.json(req.user);
});

router.get("/basicInfo/:id", async (req, res) => {
    const id = req.params.id;
    const basicInfo = await Users.findByPk(id,
        {attributes:{exclude:['password']}
        });

    res.json(basicInfo);
})
module.exports = router;