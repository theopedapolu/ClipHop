import React, { useState } from "react";
import Mac from './icons/Mac.js';
import iPhone from './icons/iPhone.js';
import iPad from './icons/iPad.js';
import Android from './icons/Android.js';
import PC from './icons/PC.js';
import { useState } from "react";

const iconMap = {
    'A': Android,
    'B':iPad,
    'C':iPhone,
    'D':Mac,
    'E':PC
}

function DeviceGroup({color,top,left}) {
    const [devices,setDevices] = useState([{
        name:"skynet",
        type:"Mac"
    }]);
    return (
        f
    ) 
}

export default DeviceGroup;