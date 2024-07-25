import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from '../store/userAtom';
import CursorBox from '../components/CursorBox';
import { useSocket } from '../context/SocketContext';
import Balls from '../components/gameElements/Balls';
import {useNavigate} from 'react-router-dom'
import { scoreAtom } from '../store/scoreAtom';



function GamePage() {
    const userStored = useRecoilValue(userAtom);
    const divRef = useRef(null);
    const { socket } = useSocket();
    const navigate = useNavigate()
    const setUsersScoreRecoil = useSetRecoilState(scoreAtom);

    const [usersScore,setUsersScore] = useState([])
    const [score,setScore] = useState(0)
    const [users, setUsers] = useState([]);
    const [balls, setBalls] = useState([]) // [{ pos:{x : x,y : y } , color:"red" }]
    const maxWidth = window.screen.width - 150
    const maxHeight = window.screen.height - 150
    

    useEffect(() => {
        
        if (socket) {
            console.log('Socket connected:', socket.id);

            const handleOtherUserDetails = (data) => {
                setUsers(data);
            };

            const handleBallDetails = (data) => {
                setBalls(data)
            }
            
            const handleUsersScore = (data) => {
                setUsersScore(data)
                setUsersScoreRecoil(data);
        
            }

            const handleGameOver = (data) => {
                if(data){
                    
                    
                    // setUsers([])
                    // setBalls([])
                    // setUsersScore(0)
                    
                    navigate('/score')
                }
            }

            socket.on('other-user-details', handleOtherUserDetails);
            socket.on('ball-details', handleBallDetails);
            socket.on('users-score',handleUsersScore);
            socket.on('game-over',handleGameOver);

            return () => {
                socket.off('ball-details', handleBallDetails)
                socket.off('other-user-details', handleOtherUserDetails);
                socket.off('game-over',handleGameOver)
            };
        }
    }, [socket]);

    const handleMove = (e) => {
        const x = e.clientX;
        const y = e.clientY;

        if (divRef.current && y < maxHeight && x < maxWidth) {
            divRef.current.style.transform = `translate(${x}px, ${y}px)`;
        }

        const user = {
            name: userStored.userId,
            pos: { x, y },
            color: userStored.color
        };

        if (user.name) {
            socket?.emit('user-details', user);
        }
    };

    const checkCollision = (e) => {
        // check when the user clicks on cursor 
        // check the coodinates of the cursor and the balls
        // if same color ball is hit then score+=2
        // else score --
        // delete that ball from the render
        
        const BALL_SIZE = 24;
        const mouseX = e.clientX
        const mouseY = e.clientY

        // find the index of the ball that is hit 

        const index = balls?.findIndex((ball)=>{
        const ballLeft = ball.pos.x;
        const ballTop = ball.pos.y;
        const ballRight = ballLeft + BALL_SIZE;
        const ballBottom = ballTop + BALL_SIZE;

        return (
            mouseX >= ballLeft &&
            mouseX <= ballRight &&
            mouseY >= ballTop &&
            mouseY <= ballBottom
        );
        })

        // check whether that ball is of same color or not

        if(index>=0){
            if(balls[index].color === userStored.color){
                setScore((prev)=>prev+5)
               
            }else{
                setScore((prev)=>prev+1)
                
            }
            const data = {
                name : userStored.userId,
                score:score
            }
            socket.emit('personal-score',data)
        }

        // delete that ball from the render

        setBalls((balls)=>{
            const newBalls = balls.filter((ball,i)=>{
                if((index !== i)){
                    return ball
                }
            })
            socket.emit('ball-change',newBalls)
            return newBalls
        })

        // socket.emit('ball-change',balls)
    }

    return (
        <div onMouseMove={handleMove} onClick={checkCollision} className='w-full h-full cursor-none '>
            <div className='flex gap-5 text-3xl absolute font-fantasy text-white'>
                {usersScore.map((user,index) => {
                    return <div key={index}> {user.name} : {user.score} </div>
                })}
            </div>
            <CursorBox name={userStored.userId} color={userStored.color} cursorRef={divRef} />
        
            {users.map((user) => {
                return user.name !== userStored.userId && <CursorBox name={user.name} color={user.color} key={user.name} pos={user.pos} />
            })}
            
            {balls.map((ball,index)=>{
                    return <Balls pos={ball.pos} color={ball.color} key={index} />
            })}
        </div>
    );
}

export default GamePage;
