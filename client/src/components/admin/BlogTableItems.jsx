import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const BlogTableItems = ( {blog, fetchBlogs, index} ) => {
    
    const{title, createdAt} = blog;
    const BlogDate = new Date(createdAt)

    const {axios} = useAppContext()
    const deleteBlog = async() =>{
        const confirm = window.confirm('Are U Sure you want to delete this blog?')
        if(!confirm){
            return
        }
        try {
        const { data } = await axios.post('api/blog/delete', { id: blog._id });
        if (data.success) {
            toast.success(data.message);
            await fetchBlogs(); // 👈 This is what was missing
        } else {
            toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const togglePublish = async() =>{
        try {
            const {data} = await axios.post('api/blog/toggle-publish', {id: blog._id})
            if(data.success)
            toast.success(data.message)
            await fetchBlogs()
        } catch (error) {
            toast.error(error.message)
        }
    }
    

    return (
        <tr className=''>
            <th className=' px-2 py-4'>{index}</th>
            <td className=' px-2 py-4'>{title}</td>
            <td className=' px-2 py-4 max-sm:hidden'>{BlogDate.toDateString()}</td>
            <td className=' px-2 py-4 max-sm:hidden'>
                <p className={`${blog.isPublished ? ' text-green-600' : ' text-orange-700'}`}
                >{blog.isPublished ? 'published' : 'unpublished'}</p>
            </td>
            <td className=' flex px2 py-4 text-xs gap-3'>
                <button className=' border px-2 py-0.5 mt-1 rounded cursor-pointer' onClick={togglePublish}>
                    {blog.isPublished ? 'unPublish' : 'Publish'}
                </button>
                <img src={assets.cross_icon} className=' w-8 transition-all cursor-pointer hover:scale-110'
                    onClick={deleteBlog} alt="" />
            </td>
        </tr>
    )
}

export default BlogTableItems