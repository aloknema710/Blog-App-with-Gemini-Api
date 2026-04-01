import express from 'express';
import { adminLogin, approveCommentById, deleteCommentById, deleteSubscriberById, getAllBlogsAdmin, getAllComments, getAllSubscribers, getDashboard } from '../controllers/adminControllers.js';
import auth from '../middleware/auth.js'

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.get('/comments', auth, getAllComments)
adminRouter.get('/blogs', auth, getAllBlogsAdmin)
adminRouter.post('/delete-comment', auth, deleteCommentById)
adminRouter.post('/approve-comment', auth, approveCommentById)
adminRouter.get('/dashboard', auth, getDashboard)
adminRouter.get('/subscribers', auth, getAllSubscribers)
adminRouter.post('/delete-subscriber', auth, deleteSubscriberById)

export default adminRouter;