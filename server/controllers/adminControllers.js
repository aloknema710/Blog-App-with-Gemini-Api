import jwt from 'jsonwebtoken';
import Blog from '../models/Blog.js';
import Comment from '../models/Comments.js';
import Subscriber from '../models/Subscriber.js';

export const adminLogin = (req, res) => {
    try {
        const { email, password } = req.body;
        if (email !== process.env.ADMIN_EMAIL && password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET)
        res.json({success: true, token})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getAllBlogsAdmin = async(req, res) =>{
    try {
        const blogs = await Blog.find({}).sort({createdAt: -1});
        res.json({success: true, blogs})
    } catch (error) {
        res.json({success: false, message: error.message}) 
    }
}

export const getAllComments = async(req, res) =>{
    try {
        const comments = await Comment.find({}).populate('blog').sort({createdAt: -1});
        res.json({success: true, comments})
    } catch (error) {
        res.json({success: false, message: error.message}) 
    }
}

export const getDashboard = async(req, res) =>{
    try {
        const recentBlogs = await Blog.find({}).sort({createdAt: -1}).limit(5);
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments()
        const drafts = await Blog.countDocuments({isPublished: false})

        const subscribers = await Subscriber.countDocuments();
        const dashboardData = {
            blogs, comments, drafts, subscribers, recentBlogs
        }
        res.json({success:true, dashboardData})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const deleteCommentById = async(req, res) =>{
    try {
        const {id} = req.body;
        await Comment.findByIdAndDelete(id);
        res.json({success: true, message: "Comment deleted Succesfully"})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const approveCommentById = async(req, res) =>{
    try {
        const {id} = req.body;
        await Comment.findByIdAndUpdate(id, {isApproved: true})
        res.json({success: true, message: "Comment Approved Succesfully"})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getAllSubscribers = async(req, res) =>{
    try {
        const subscribers = await Subscriber.find({}).sort({createdAt: -1});
        res.json({success: true, subscribers});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const deleteSubscriberById = async(req, res) =>{
    try {
        const {id} = req.body;
        if(!id){
            return res.json({success: false, message: "Subscriber id is required"});
        }
        await Subscriber.findByIdAndDelete(id);
        res.json({success: true, message: "Subscriber removed successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}