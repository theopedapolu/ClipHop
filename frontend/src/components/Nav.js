import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGithub } from '@fortawesome/free-brands-svg-icons';
import { faXTwitter} from '@fortawesome/free-brands-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faBug } from '@fortawesome/free-solid-svg-icons';

function Nav() {
    return  (
    <nav className=''>
        <div className='max-w-screen-xl flex justify-end flex-wrap items-center mx-auto p-4'>
        <div className='w-auto block'>
            <ul className='flex flex-row space-x-10 p-0 mt-0'>
                <li className=''> 
                    <a className='block p-0 bell' href="#">
                        <FontAwesomeIcon icon={faBell} size='2x' className='text-zinc-700 hover:text-yellow-500'/>
                    </a>
                </li>
                <li className=''>
                    <a className='block p-0 hover:color-amber-400' href="#">
                        <FontAwesomeIcon icon={faBug} size='2x' className='text-zinc-700 hover:text-green-600'/>
                    </a>
                </li>
                <li>
                    <a className='block p-0' href="https://x.com/TPedapolu" target='_blank'>
                        <FontAwesomeIcon icon={faXTwitter} size="2x" className='text-zinc-700 hover:text-blue-600'/>
                    </a>
                </li>
                <li>
                <a className='block p-0' href="https://github.com/theopedapolu/ClipHop" target='_blank'> 
                        <FontAwesomeIcon icon={faGithub} size="2x" className='text-zinc-700 hover:text-rose-500'/>
                    </a>
                </li> 
            </ul>
        </div>
        </div>
    </nav>

    )
}

export default Nav;