import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

const Newsletter = () => {
  const { axios } = useAppContext()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailError, setEmailError] = useState('')

  const validateEmail = (value) => {
    const trimmed = value.trim()
    if (!trimmed) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) return 'Please enter a valid email'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validateEmail(email)
    setEmailError(validationError)
    if (validationError) {
      toast.error(validationError)
      return
    }

    try {
      setIsSubmitting(true)
      const { data } = await axios.post('/api/newsletter/subscribe', { email })
      if (data.success) {
        toast.success(data.message)
        setEmail('')
        setEmailError('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center text-center space-y-2 my-32'>
        <h1 className='md:text-4xl text-2xl font-semibold'>Never miss a Blog!</h1>
        <p className='md:text-lg text-gray-500/70 pb-8'>
            Subscribe to get the latest blog, new tech, and exclusive news
        </p>
        <form className='flex items-center justify-between max-w-2xl w-full md:h-13 h-12' onSubmit={handleSubmit}>
            <input
              className={`border rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500 ${emailError ? 'border-red-400' : 'border-gray-300'}`}
              type="email"
              placeholder='Enter your email-id'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) setEmailError(validateEmail(e.target.value))
              }}
              required
            />
        
            <button
              type='submit'
              disabled={isSubmitting}
              className='md:px-12 px-8 h-full text-white bg-primary/80 hover:bg-primary transition-all cursor-pointer rounded-md rounded-l-none disabled:opacity-70 disabled:cursor-not-allowed'
            >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>        
        </form>
        {emailError && <p className='text-sm text-red-500'>{emailError}</p>}
    </div>
  )
}

export default Newsletter