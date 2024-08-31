import React from "react";
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

function Info({outerDivClasses,name,type='A',color='bg-green-500'}) {
    const DeviceIcon = iconMap[type];
    return (
        <div className={`flex flex-col place-items-center ${outerDivClasses} font-poppins text-lg text-nowrap`}>
            <div className={`rounded-full ${color} p-3`}>
                <DeviceIcon/>
            </div>
            <span className="mt-1">This device is known as:</span>
            <span className="-mt-1 p-0 font-bold">{name}</span>
        </div>
    )
}

export default Info;