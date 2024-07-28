import React, { useState } from "react";
import Mac from './icons/Mac.js';
import iPhone from './icons/iPhone.js';
import iPad from './icons/iPad.js';
import Android from './icons/Android.js';
import PC from './icons/PC.js';

const iconMap = {
    'A': Android,
    'B':iPad,
    'C':iPhone,
    'D':Mac,
    'E':PC
}

function DeviceGroup({color="green-500",top,left}) {
    // const [devices,setDevices] = useState([{
    //     name:"skynet",
    //     type:"Mac"
    // }]);
    return (
        <div className={`absolute z-20 rounded-full flex items-center justify-center bg-${color} w-[4.3rem] h-[4.3rem] -translate-x-[3.7rem]`}>
        <Android/>
        </div>
    ) 
}

export default DeviceGroup;