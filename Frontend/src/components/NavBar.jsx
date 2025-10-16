import { SignedIn, UserButton } from '@clerk/clerk-react';
import { Menu, MenuIcon, Share2, Wallet, X } from 'lucide-react';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import SideMenu from './SideMenu';
import CreditsDisplay from './CreditsDisplay';

const NavBar = ({activeMenu}) => {

    const [openSideMenu,setOpenSideMenu]=useState(false);

  return (
    <div className='flex items-center justify-between gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4 sm:px-7 sticky top-0 z-30'>
      {/* Left Side -menu button and title */}
      <div className='flex items-center gap-5'>
        <button onClick={()=>setOpenSideMenu(!openSideMenu)} className='block lg:hidden text-blck hover:bg-gray-100 p-1 rounded transition-colors'>
        {openSideMenu ? (
            <X className='text-2xl'/>
        ):(
        <Menu className='text-2xl'/>
        )}
        </button>
        <div className='flex items-center gap-2'>
            <Share2 className='text-yellow-600'/>
            <span className='text-lg font-medium text-black truncate'>
                ShareSphere
            </span>
        </div>
      </div>

      {/* Right Side - credits and user button */}
        <SignedIn><div className="flex items-center gap-4">
            <Link to="/subscriptions">
            <CreditsDisplay credits="5"/>
            </Link>
            <div className="relative">
                <UserButton/>
            </div>
        </div>
        </SignedIn>

      {/* Mobile side menu*/}
      {openSideMenu && (
        <div className="fixed top-[73px] left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20">
            {/*side Menu bar */}
            <SideMenu activeMenu={activeMenu}/>
        </div>
      )}
    </div>
  )
}

export default NavBar
