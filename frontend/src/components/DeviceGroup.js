import React, { useState } from "react";
import Mac from './icons/Mac.js';
import iPhone from './icons/iPhone.js';
import iPad from './icons/iPad.js';
import Android from './icons/Android.js';
import PC from './icons/PC.js';
import { icon } from "@fortawesome/fontawesome-svg-core";

const iconMap = {
    'A': Android,
    'B':iPad,
    'C':iPhone,
    'D':Mac,
    'E':PC
}

function DeviceGroup({devices, color="green-500"}) {
    return (
        <>
            {devices.map(device => {
                const DeviceIcon = iconMap[device.type];
                return (
                    <div key={device.id} className={`rounded-full flex items-center justify-center bg-${color} w-[4.3rem] h-[4.3rem]`}>
                        <DeviceIcon/>
                    </div>
                )
            })}
        </>
    )
}

export default DeviceGroup;