import  { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  useSetRecoilState } from 'recoil';
import { userAtom } from '../store/userAtom';

function InputBox() {
    
    const [name, setName] = useState('');
    const [color, setColor] = useState('');
    const setUserName = useSetRecoilState(userAtom)
    const navigate = useNavigate()

    const handleClick = ()=>{
        if(name && color){
            const value =name+Math.floor(Math.random()*1000)
            localStorage.setItem("userName" ,value);
            localStorage.setItem('userColor',color)
            setUserName({userId:value,color:color});
            navigate('/game')
        }else{
            toast.warn("Please Enter your Name And Choose Color")
        }

    }
    return (
        <div className='flex justify-center items-center h-full '>
            <div className='flex flex-col w-1/3 h-3/6 bg-slate-900 rounded-lg p-10 gap-10 shadow-md shadow-blue-100' >
                <input placeholder='Enter Name' onChange={(e)=>setName(e.target.value)} value={name} className='bg-inherit font-serif align-center text-center text-white border-2 text-3xl p-3 shadow-md shadow-blue-100 border-black '/>
                <div className='flex gap-3 border-2 text-xl p-3 shadow-md shadow-blue-100 border-black' >
                    <div onClick={()=>{setColor('red')}} className='bg-red-700 p-6 font-semibold border-2 border-rose-50'></div>
                    <div onClick={()=>{setColor('blue')}} className='bg-blue-700 p-6 font-semibold border-2 border-rose-50'></div>
                    <div onClick={()=>{setColor('green')}} className='bg-green-700 p-6 font-semibold border-2 border-rose-50'></div>
                    <div onClick={()=>{setColor('yellow')}} className='bg-yellow-500 p-6 font-semibold border-2 border-rose-50'></div>
                    <div onClick={()=>{setColor('purple')}} className='bg-purple-700 p-6 font-semibold border-2 border-rose-50'></div>
                </div>
                <button onClick={handleClick} className='border-2 border-black text-3xl text-white font-serif p-3 shadow-md shadow-blue-100 hover:scale-110 hover:text-orange-500'>Lets Go</button>
            </div>

            <ToastContainer theme='dark' autoClose={3000} />
        </div>
    )
}

export default InputBox