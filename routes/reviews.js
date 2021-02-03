const express = require('express');
const mongoose = require('mongoose')
const { v4: uuidV4 } = require('uuid');
const sanitize = require('mongo-sanitize');
const requireLogin = require('../util/requireLogin')


const User = mongoose.model("User")
const Reviews =  mongoose.model("Reviews")
const Movies_data =  mongoose.model("Movies_data")

const router = express.Router()

// @route   Get api/reviews
// @desc    Get list of all reviews
// @access  Public
router.get('/',async (req,res)=>{
    try{
        const reviews =await Reviews.find();
        res.json(reviews);
    }catch(err){
        console.log(err);
        res.status(500).send("Server Error");
    }

})

// @route   Post api/reviews
// @desc    Add new review
// @access  Private: Only authorized user can access
router.post('/',requireLogin,async(req,res)=>{
    const {movieId,userId,rating,comment,refMovieId}=req.body
    const review = new Reviews({
        movieId,
        userId,
        rating,
        comment,
        refMovieId
    })
    review.rid = uuidV4()
    try{

        const new_review=await review.save();
        const update_user=await User.findByIdAndUpdate(userId,{
            $push:{reviews:review._id}
        },{new:true});
        res.json({newReview:new_review});
    
    }catch(err){
        console.log(err);
        res.status(500).send("Server Error");
    }
})

// @route   Get api/reviews/:userId
// @desc    Get all reviews of a user
// @access  Public
router.get('/:userId',async (req,res)=>{
    try{
        const userId=sanitize(req.params.userId);
        const reviews=await Reviews.find({userId:userId}).populate("refMovieId","movieId title genres poster imdb_link")
        res.json(reviews);
    }catch(err){
        console.log(err);
        res.status(500).send("Server Error");
    }
})

module.exports=router