import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const Login = () => {

    const {axios, setToken} = useAppContext();
    const[email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post('/api/admin/login', {email, password});
            if(data.success){
                setToken(data.token)
                localStorage.setItem('token', data.token);
                axios.defaults.headers.common['Authorization'] = `${data.token}`;
                // window.location.reload();
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            console.error("Login error:", error); // <-- Log the full error
        }
    }

  return (
    <div className=' flex items-center justify-center h-screen'>
        <div className=' w-full max-w-sm p-6 max-md:m-6 border border-primary/30 rounded-lg shadow-xl shadow-primary/15'>
            <div className='flex flex-col items-center justify-center'>
                <div className=' w-full py-6 text-center'>
                    <h1 className=' text-3xl font-bold'>Admin <span className=' text-primary'>Login</span></h1>
                    <p className=' font-light'>Enter your credentials to access the admin panel</p>
                </div>
                <form onSubmit={handleSubmit} action="" className=' mt-6 w-full sm:max-w-md text-gray-600'>
                    <div className=' flex flex-col'>
                        <label > Email </label>
                        <input className=' border-b-2 border-gray-300 p-2 mb-6 outline-none' 
                        type="email" required placeholder='Email id' value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className=' flex flex-col'>
                        <label >Password</label>
                        <input className=' border-b-2 border-gray-300 p-2 mb-6 outline-none' 
                            type="password" required placeholder='Password'
                            onChange={(e) => setPassword(e.target.value)} value={password}
                            />
                    </div>
                    <button className='w-full py-3 font-medium bg-primary text-white rounded cursor-pointer
                         hover:bg-primary/90 transition-all' type='submit'>Login</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login