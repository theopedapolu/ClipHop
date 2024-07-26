import React from 'react';
import Clock from './Clock';
import Device from './Device';

function Crown() {
    return (
        <div className='relative h-[25rem] top-5'>
            <Clock/>
            <Device color={"green-500"} top={"1/2"} left={"1/2"}/>
            
        </div>
    )
}

export default Crown