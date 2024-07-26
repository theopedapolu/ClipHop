import React from 'react';
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

function Device({deviceType='D',color='sky-400',top="1/2",left="1/2"}) {
    const DeviceIcon = iconMap[deviceType];
    return (
        <div className={`absolute flex items-center justify-center rounded-full bg-${color} w-[4.3rem] h-[4.3rem] drop-shadow-2xl top-${top} left-${left} -translate-x-1/2 -translate-y-1/2`}>
        <DeviceIcon/>
        </div>
    )
}

export default Device;