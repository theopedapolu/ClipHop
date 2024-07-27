import React from 'react';
import Clock from './Clock';
import Device from './Device';
import { useState } from 'react';

function Crown() {
    const [clockColor,setClockColor] = useState("black");
    const [deviceGroups, setDevices] = useState();

    return (
        <div className='relative h-[30rem] mt-10'>
            <Clock color={`${clockColor}`}/>
            <Device color={"green-500"} top={"1/2"} left={"1/2"}/>
        </div>
    )
}

export default Crown;