import React from 'react'

function StatsCard(props) {
  return (
    <div>
        <div className='rounded-lg bg-gray-300 text-black w-[330px] h-[220px]'>
                <h1 className='text-gray-600 p-10'>{props.title}</h1>
                <h2 className='text-4xl text-black font-bold ml-10 mt-5'>{props.info}</h2>
        </div>
    </div>
  )
}

export default StatsCard