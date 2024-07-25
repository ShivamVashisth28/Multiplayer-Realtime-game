import React, { useEffect, useRef, useState } from 'react'
import { PiCursorFill } from "react-icons/pi";

function CursorBox({name,cursorRef,color='black',pos}) {
    
    const tempRef = useRef(null);

    useEffect(()=>{
        if(pos){
            const x = pos.x
            const y = pos.y
            if(y < window.screen.height - 120  && x < window.screen.width - 120){
                tempRef.current.style.transform = `translate(${x}px, ${y}px)`
            }
        }
    },[pos])
    
    return (
        <div ref={cursorRef || tempRef} className={ `z-10 text-lg font-light font-fantasy text-white absolute `} >
            <PiCursorFill color={`${color}`}  className='size-9' attributeType='border-2' />
            {name || "example"}
        </div>
  )
}

export default CursorBox