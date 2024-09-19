import React from 'react';
import Clipboard from './icons/Clipboard';

function SyncButton({outerDivClasses='',onClick}) {
    return (
        <div className={`flex flex-col place-items-center ${outerDivClasses}`}>
            <button onClick={onClick} className={`bg-gradient-to-r from-amber-400 to-amber-500 text-white border-none rounded-2xl p-4 w-24 h-24 shadow-md transition-transform transition-shadow duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer relative overflow-hidden`}>
                <Clipboard/>
            </button>
            <span className='font-aberforthTiles text-3xl'>UPDATE</span>
        </div>
    )
}

export default SyncButton;