import React from 'react';
import Clipboard from './icons/Clipboard';

function SyncButton({outerDivClasses='',color='green',onClick}) {
    const gradientMap = {
        'green': 'from-green-400 to-green-500',
        'red': 'from-red-400 to-red-500'
    };

    return (
        <div className={`flex flex-col place-items-center ${outerDivClasses}`}>
            <button onClick={onClick} className={`bg-gradient-to-r ${gradientMap[color]} text-white border-none rounded-2xl p-4 w-24 h-24 shadow-md transition-transform transition-shadow duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer relative overflow-hidden`}>
                <Clipboard/>
            </button>
            <span className='font-aberforthTiles text-3xl'>SYNC</span>
        </div>
    )
}

export default SyncButton;