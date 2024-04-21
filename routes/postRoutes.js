import express from "express";
import authenticate from "../middleware/auth.js";
import Posts from "../models/postModel.js";
import postComments from "../models/postCommentsModel.js";
import Notifications from "../models/NotificationModel.js";

const router = express.Router();


//get all posts by of an user
router.get("/getuserposts/:id", authenticate, async (req, res) => {
    const userId = req.params.id;
    try {
        const posts = await Posts.find({
            createdBy: userId,
        });
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get("/getpost/:id", authenticate, async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Posts.findOne({
            _id: postId,
        });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post("/create", authenticate, async (req, res) => {
    try {
        const { textContent, images } = req.body;

        // Create new post instance
        const newPost = new Posts({
            title: textContent,
            images,
            createdBy: req.user._id
        });

        // Save post to MongoDB
        await newPost.save();
        res.status(201).json({ message: 'Post saved successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.get("/getallposts", authenticate, async (req, res) => {
    try {
        const posts = await Posts.find();
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

/// like/dislike the post with postId
router.get("/like/:id", authenticate, async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Posts.findOne({
            _id: postId,
        });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // Check if the user has already liked the post
        const isLiked = post.likes.includes(req.user._id);
        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            post.likes.push(req.user._id);
            const newNotification = new Notifications({
                sender: req.user._id,
                receiver: post.createdBy,
                message: "has liked your post",
                link: `/post/${postId}`,
                type: 'like',
            });
            if(postId !== req.user._id.toString()){
                await newNotification.save();
            }
        }
        await post.save();
      
        res.status(200).json({ message: "SUCCESS" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

/// comment on the post with postId and save it to the postComments collection
router.post("/comment/:id", authenticate, async (req, res) => {
    const postId = req.params.id;
    const { comment } = req.body;
    try {
        const post = await Posts.findOne({
            _id: postId,
        });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // Create new post comment instance
        const newComment = new postComments({
            commentContent: comment,
            postId: postId,
            commentedBy: req.user._id
        });
        await newComment.save();
        post.comments.push(newComment._id);
        await post.save();
        const newNotification = new Notifications({
            sender: req.user._id,
            receiver: post.createdBy,
            message: "has commented on your post",
            link: `/post/${postId}`,
            type: 'comment',
        });
        if(post.createdBy.toString() !== req.user._id.toString()){
            await newNotification.save();
        }
        res.status(200).json({ message: "SUCCESS" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete the comments of the post with postId and commentId
router.delete("/deletecomment/:postId/:commentId", authenticate, async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    try {
        const post = await Posts.findOne({
            _id: postId,
        });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comment = await postComments.findOne({
            _id: commentId,
        });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (comment.commentedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        await comment.delete();
        post.comments = post.comments.filter(id => id.toString() !== commentId.toString());
        await post.save();
        res.status(200).json({ message: "SUCCESS" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//get all comments of the post with postId
router.get("/getcomments/:id", authenticate, async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Posts.findOne({
            _id: postId,
        });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comments = await postComments.find({
            postId: postId,
        });
        res.status(200).json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// like an post comment with postId and commentId
router.get("/likepostcomment/:postId/:commentId", authenticate, async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    try {
        const post = await Posts.findOne({
            _id: postId,
        });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comment = await postComments.findOne({
            _id: commentId,
        });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        // Check if the user has already liked the comment
        const isLiked = comment.likes.includes(req.user._id);
        if (isLiked) {
            comment.likes = comment.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            comment.likes.push(req.user._id);
        }
        await comment.save();
        // crete notification for the user who commented on the post someone has liked his comment
        const newNotification = new Notifications({
            sender: req.user._id,
            receiver: comment.commentedBy,
            message: "has liked your comment",
            link: `/post/${postId}`,
            type: 'like',
        });
        if(comment.commentedBy.toString() !== req.user._id.toString()){
            await newNotification.save();
        }
        res.status(200).json({ message: "SUCCESS" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

router.post("/addsubcomment/:id", authenticate, async (req, res) => {
    const commentId = req.params.id;
    const { subComment } = req.body;
    try {
        const comment = await postComments.findOne({
            _id: commentId,
        });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        comment.subComments.push({
            content: subComment,
            commentedBy: req.user._id
        });
        await comment.save();
        const newNotification = new Notifications({
            sender: req.user._id,
            receiver: comment.commentedBy,
            message: "has replied to your comment",
            link: `/post/${comment.postId}`,
            type: 'comment',
        });
        if(comment.commentedBy.toString() !== req.user._id.toString()){
            await newNotification.save();
        }
        res.status(200).json({ message: "SUCCESS" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// delete subcomments from an comment using commentid and subcommentindex
router.delete("/deletesubcomment/:commentId/:subCommentIndex", authenticate, async (req, res) => {
    const commentId = req.params.commentId;
    const subCommentIndex = req.params.subCommentIndex;
    try {
        const comment = await postComments.findOne({
            _id: commentId,
        });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (comment.subComments[subCommentIndex].commentedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        comment.subComments.splice(subCommentIndex, 1);
        await comment.save();
        res.status(200).json({ message: "SUCCESS" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// delete user comment using commentId and also remove from comment id from post data object if it exists
router.delete("/deleteusercomment/:postId/:commentId", authenticate, async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    try {
        const post = await Posts.findOne({
            _id: postId,
        });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comment = await postComments.findOne({
            _id: commentId,
        });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (comment.commentedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        await postComments.deleteOne({ _id: commentId });
        post.comments = post.comments.filter(id => id.toString() !== commentId.toString());
        await post.save();
        res.status(200).json({ message: "SUCCESS" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;