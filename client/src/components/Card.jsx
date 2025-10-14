import React from 'react'

function Card() {
  return (
    <div className='bg-black h-auto w-[45vh] rounded-md shadow-lg p-4'>
        <img 
        src='https://i.ytimg.com/vi/MZEaUEx_xgQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD7Rvxc7krKZEbTFIrjBRDHIwovGA' 
        alt='Loading'
        className='rounded-md object-contain'
        />
        <p className='text-white mt-2 text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima unde adipisci earum aliquam! Consequuntur consectetur aliquid iusto, accusantium sint et, tenetur vitae totam porro optio explicabo beatae dicta omnis numquam?</p>
        <button className='text-white rounded-md bg-red-500 px-9 py-1 cursor-pointer mt-3 block mx-auto font-black tracking-tight'>CLICK</button>
    </div>
  )
}

export default Card