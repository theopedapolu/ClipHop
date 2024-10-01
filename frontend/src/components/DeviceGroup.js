import React from "react";
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

function getGridParams(devices) {
    // Find num rows and num cols
    if (devices.length === 1) {
        return {numRows:1,numCols:1}
    } else if (devices.length === 2) {
        return {numRows:1,numCols:2}
    } else {
        return {numRows:2,numCols:2}
    }

}


function DeviceGroup({devices, color="bg-green-500"}) {
    const {numRows,numCols} = getGridParams(devices)
    return (
        <div className='grid place-items-center w-[10rem] p-3' style={{gridTemplateRows:`repeat(${numRows}, minmax(0, 1fr))`,gridTemplateColumns:`repeat(${numCols}, minmax(0, 1fr))`}}>
            {devices.map((device,idx) => {
                const DeviceIcon = iconMap[device.type];
                return (
                    <span key={device.name} className={`${devices.length===3 ? (idx===2 ? 'col-span-2':'-mb-5'):''} rounded-full ${color} p-3`}>
                        <DeviceIcon/>
                    </span>
                )
            })}
        </div>
    )
}

export default DeviceGroup;