const express = require("express");
const router = express.Router();


const {Posts, Likes} = require("../models");
const {validateToken} = require("../middlewares/AuthMiddleware");
const {where} = require("sequelize");


router.get("/", validateToken, async (req, res) => {
    const list = await Posts.findAll({include:[Likes]});

    const likedPosts = await Posts.findAll({where:{UserId: req.user.id}});
    res.json({list:list, likedPosts:likedPosts});
})

router.get("/byId/:id", async (req, res) => {
    const id = req.params.id;
    const post = await Posts.findByPk(id);
    res.json(post);

})

router.get("/byUserId/:id", async (req, res) => {
    const id = req.params.id;
    const posts = await Posts.findAll({
        where: { UserId: id },
        include: [Likes]
    });
    // const posts = await Posts.findAll({where:{UserId: id}},{includes:[Likes]});
    res.json(posts);

})

router.post("/", validateToken, async (req, res) => {
    const post = req.body;
    post.username = req.user.username;
    post.UserId = req.user.id;
    await Posts.create(post);
    res.json(post);
})

router.put("/title", validateToken, async (req, res) => {
    const {newTitle,id} = req.body;
    await Posts.update({title:newTitle},{where:{id: id}});
    res.json(newTitle);
})
router.put("/postText", validateToken, async (req, res) => {
    const {newText,id} = req.body;
    await Posts.update({postText:newText},{where:{id: id}});
    res.json(newText);
})

router.delete("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId;

    await Posts.destroy({
        where: {
            id: postId,
        }
    });
    const posts =  await Posts.findAll({include:[Likes]});
    res.json(posts);
})
module.exports = router;