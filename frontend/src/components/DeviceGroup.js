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

function DeviceGroup({devices, color="bg-green-500"}) {
    return (
        <>
            {devices.map(device => {
                const DeviceIcon = iconMap[device.type];
                return (
                    <div key={device.name} className={`rounded-full flex items-center justify-center ${color} p-3`}>
                        <DeviceIcon/>
                    </div>
                )
            })}
        </>
    )
}

export default DeviceGroup;