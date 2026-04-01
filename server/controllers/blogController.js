import fs from 'fs';
import imageKit from '../configs/imagekit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comments.js';
import main from '../configs/gemini.js';

export const addBlog = async(req, res) =>{
    try {
        const {title, subTitle, description, category, isPublished} = JSON.parse(req.body.blog) // Parse the JSON string
        const imageFile = req.file; // Access the uploaded file
        console.log("Parsed data:", {title, subTitle, description, category, isPublished});
        // console.log("Received data:", req.body); // Debug log
        // console.log("Received file:", req.file); // Debug log
        // check if all fields are present
        if (!title || !description || !category || !imageFile) {
            return res.json({success: false, message: "Missing required Fields"});
        }
        // Upload image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imageKit.upload({
            file: fileBuffer, // Use the file buffer
            fileName: imageFile.originalname,
            folder: "/blogs/"
        }) 
        // optimization through imagekit url transformation
        const optimizedImageUrl = imageKit.url({
            path: response.filePath,
            transformation: [
                {"quality": "80" },
                {"format": "webp" },
                {"width": "400" }
            ]
        })

        const image = optimizedImageUrl;
        await Blog.create({title, subTitle, description, category, image, isPublished});
        res.json({success: true, message: "Blog Added Successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getAllBlogs = async(req, res) =>{
    try {
        const blogs = await Blog.find({isPublished: true})
        res.json({success: true, blogs})
    } catch (error) {
        res.json({success: false, message: error.message});        
    }
}

export const getBlogById = async(req, res) =>{
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.json({success: false, message: "Blog not found"});
        }
        res.json({success: true, blog})
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const deleteBlogById = async(req, res) =>{
    try {
        const { id } = req.body;
        await Blog.findByIdAndDelete(id);
        //deleting comments associated with it
        await Comment.deleteMany({blog: id})
        res.json({success: true, message: "Blog Deleted Successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const togglePublish = async(req, res) =>{
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id);
        // if(!blog){
        //     return res.json({success: false, message: "Blog not found"});
        // }
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({success: true, message: "Blog Publish status updated"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const addComment = async(req, res) => {
    try {
        const { blogId, name, content } = req.body;
        if (!blogId || !name || !content) {
            return res.json({ success: false, message: "Missing required fields" });
        }
        await Comment.create({ blog: blogId, name, content });
        res.json({ success: true, message: "Comment added for review" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// export const addComment = async(req, res) =>{
//     try {
//         const {blog, name, content} = req.body;
//         if(!blog || !name || !content){
//             return res.json({success: false, message: "Missing required fields"});
//         }
//         await Comment.create({blog, name, content});
//         res.json({success: true, message: "Comment added for review"});
//     } catch (error) {
//         res.json({success: false, message: error.message});
//     }
// }

export const getBlogComments = async(req, res) =>{
    try {
        const { blogId } = req.query;
        const comments = await Comment.find({blog: blogId, isApproved: true}).sort({createdAt: -1});
        res.json({success: true, comments});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const generateContent = async (req, res) =>{
    try {
        const {prompt} = req.body
        const content = await main(prompt + 'Generate a blog content for this topic in simple text format')
        res.json({success:true, content})
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}