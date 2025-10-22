import React from 'react'
import { NavLink } from 'react-router-dom'

function Card(props) {
  return (
    <div className='bg-black h-auto w-[45vh] rounded-md shadow-lg p-4'>
        <img 
        src={props.imgsrc} 
        alt='Loading'
        className='rounded-md object-contain'
        />
        <h2 className='text-white mt-2 text-center text-2xl font-bold'>{props.title}</h2>
        <p className='text-white mt-2 text-center'>{props.description}</p>
        <NavLink to={props.link}>
        <button 
        className="relative overflow-hidden text-white rounded-md bg-red-500/0 px-9 py-1 cursor-pointer mt-3 block mx-auto font-black tracking-tight border border-red-500 transition-all duration-300 group"
        >
          <span className="relative z-10">Explore</span>
          <span className="absolute inset-0 bg-red-500 scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100 group-active:scale-x-100"></span>
        </button>

        
        </NavLink>
    </div>
  )
}


Card.defaultProps = {
  
  title: "Card loading . . .",
  description: 'Card is yet to made and generated.'
}

export default Card