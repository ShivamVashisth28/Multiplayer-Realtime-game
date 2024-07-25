import React, { useEffect, useRef } from 'react'

function Balls({color='red' , pos={x:3,y:3}}) {
    
    const divRef = useRef(null)

    useEffect(()=>{
        divRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    },[pos])

    return (
        <div ref={divRef} className={`border-2 border-white h-8 w-8 rounded-full bg-${color}-${color==='yellow' ? '500' : '700'} absolute  `} ></div>
    )
}

export default Balls