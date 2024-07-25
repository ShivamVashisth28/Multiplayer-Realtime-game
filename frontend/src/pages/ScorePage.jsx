import { useRecoilState } from 'recoil'
import { scoreAtom } from '../store/scoreAtom'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ScorePage() {
  
    const [usersScore, setUsersScore] = useRecoilState(scoreAtom)
    const navigate = useNavigate()
    
    const handleOnClick = () => {
        setUsersScore([])
        navigate('/')
    }

    return (
        <div className='flex flex-col gap-10 justify-center items-center w-screen h-screen'>
            <div className='flex flex-col gap-5 text-4xl  font-fantasy text-white bg-black border-2 border-white p-5 shadow-lg shadow-yellow-300 rounded-lg'>
                <div  className='p-2'> Name : Score </div>
                {usersScore.map((user,index) => {
                    return <div key={index} className='p-2 flex '> {user.name} : {user.score} </div>
                })}
            </div>

            <button onClick={handleOnClick} className='text-white text-3xl hover:scale-125 hover:text-yellow-300 '>Play Again</button>
        </div>
    )
}

export default ScorePage