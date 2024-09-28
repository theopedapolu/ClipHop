import React from 'react';
import Mac from './icons/Mac.js';
import iPhone from './icons/iPhone.js';
import iPad from './icons/iPad.js';
import Android from './icons/Android.js';
import PC from './icons/PC.js';

const iconMap = {
    'Android': Android,
    'iPad':iPad,
    'iPhone':iPhone,
    'Mac':Mac,
    'PC':PC
}

function getShifts(numDevices) {
    
}

function Device({deviceType='B',color='sky-400',top="1/2",left="1/2"}) {
    const DeviceIcon = iconMap[deviceType];
    return (
        <div className='absolute top-1 left-1/2 flex bg-amber-400'>
        <div className={`absolute z-20 rounded-full flex items-center justify-center bg-${color} w-[4.3rem] h-[4.3rem] -translate-x-[3.7rem]`}>
        <DeviceIcon/>
        </div>
        <div className={`absolute z-10 rounded-full flex items-center justify-center bg-${color} w-[4.3rem] h-[4.3rem]`}>
        <DeviceIcon/>
        </div>
        <div className={`absolute z-0 rounded-full flex items-center justify-center bg-${color} w-[4.3rem] h-[4.3rem] -translate-x-[1.85rem] -translate-y-[3.2rem]`}>
        <DeviceIcon/>
        </div>
        </div>
    )
}

export default Device;