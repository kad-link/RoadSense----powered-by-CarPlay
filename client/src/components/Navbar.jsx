import React from 'react'

function Navbar() {


  return (
    <>
    <div className='navbar w-full h-[25vh] bg-transparent'>
        <div className='flex items-center col p-9'>
            <div className='title font-bold text-6xl tracking-tighter text-white'>
            ROADSENSE
            </div>
            <div className='register-button bg-white cursor-pointer ml-auto text-black px-2 py-1 rounded-sm font-black'>
            REGISTER
            </div>
        </div>
    </div>
    </>
  )
}

export default Navbar