import React from 'react';
import Clipboard from './icons/Clipboard';

function SyncButton({outerDivClasses='',text='UPDATE',color='green'}) {
    const gradientMap = {
        'green': 'from-green-400 to-green-500',
        'red': 'from-red-400 to-red-500',
        'orange': 'from-amber-400 to-amber-500'
    };

    return (
        <div className={`flex flex-col place-items-center ${outerDivClasses}`}>
            <button className={`bg-gradient-to-r ${gradientMap[color]} text-white border-none rounded-2xl p-4 w-24 h-24 shadow-md transition-transform transition-shadow duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer relative overflow-hidden`}>
                <Clipboard/>
            </button>
            <span className='font-aberforthTiles text-3xl'>{text}</span>
        </div>
    )
}

export default SyncButton;