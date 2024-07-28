require('dotenv').config()
const Review = require("../models/review");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function addReview(req,res) {
    const {email, name, message, riderId} = req.body;
    try{
        const newReview = await Review.addReview(email, name, message, riderId);
        if (newReview) {
            res.status(201).json({ message: "Review added successfully!" });
        } else {
            res.status(400).json({ message: "Error adding review" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function delReview(req,res) {
    const email = req.query.email;

    try {
        const rider = await Review.retrieveReview(email);
        console.log("Attempting to delete rider:", rider.name);
        console.log(rider.name);
        const success = await Rider.deleteRider(email);
        if (success) {
            res.status(200).send("Rider deleted successfully");
        } else {
            res.status(404).send("Rider not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting rider");
    }
}

async function retrieveReview(req,res) {
    const reviewId = req.query.reviewId;
    
    try {
        const review = await Review.retrieveReview(reviewId);
        if (rider) {
            res.json(review);
        } else {
          res.status(404).send("Review not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving data");
    }
}

async function retrieveReviews(req, res) {
    const riderId = req.query.riderId;

    try {
        const reviews = await Review.retrieveReviews(riderId);
        if (reviews) {
            res.json(reviews);
        } else {
            res.status(404).send("Reviews not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving data");
    }
}

async function updateReview(req, res) {
    const {message, reviewId, email} = req.body;

    try{
      const review = await Review.retrieveReview(email);
      console.log("Attempting to update review:", review.reviewId);
      const success = await Review.updateReview(message, reviewId);
      if (success) {
        res.status(200).send("Review updated successfully");
      } else {
        res.status(404).send("Review not found");
      }
    } catch (error){
      console.error(error);
      res.status(500).send("Error updating review");
    }
}

module.exports = {
    addReview,
    delReview,
    retrieveReview,
    retrieveReviews,
    updateReview
};