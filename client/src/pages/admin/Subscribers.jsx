import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const Subscribers = () => {
  const { axios } = useAppContext()
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSubscribers = async () => {
    try {
      const { data } = await axios.get('/api/admin/subscribers')
      if (data.success) {
        setSubscribers(data.subscribers)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteSubscriber = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this subscriber?')
    if (!confirmed) return

    try {
      const { data } = await axios.post('/api/admin/delete-subscriber', { id })
      if (data.success) {
        toast.success(data.message)
        fetchSubscribers()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-6 bg-blue-50/50'>
      <h1>Subscribers</h1>
      <div className='relative max-w-4xl mt-5 h-4/5 overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-gray-600 text-left uppercase'>
            <tr>
              <th scope='col' className='px-2 py-4 xl:px-6'>#</th>
              <th scope='col' className='px-2 py-4'>Email</th>
              <th scope='col' className='px-2 py-4 max-sm:hidden'>Subscribed On</th>
              <th scope='col' className='px-2 py-4'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className='px-2 py-4' colSpan={4}>Loading subscribers...</td>
              </tr>
            )}

            {!loading && subscribers.length === 0 && (
              <tr>
                <td className='px-2 py-4' colSpan={4}>No subscribers yet.</td>
              </tr>
            )}

            {!loading && subscribers.map((subscriber, index) => (
              <tr key={subscriber._id} className='border-y border-gray-300'>
                <td className='px-2 py-4 xl:px-6'>{index + 1}</td>
                <td className='px-2 py-4'>{subscriber.email}</td>
                <td className='px-2 py-4 max-sm:hidden'>
                  {new Date(subscriber.createdAt).toLocaleDateString()}
                </td>
                <td className='px-2 py-4'>
                  <img
                    onClick={() => deleteSubscriber(subscriber._id)}
                    src={assets.bin_icon}
                    alt='delete'
                    className='w-5 hover:scale-110 transition-all cursor-pointer'
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Subscribers
