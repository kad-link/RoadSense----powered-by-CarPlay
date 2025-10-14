import React from 'react'
import Card from './Card'

function Services() {
  return (
    <>
    <div className='h-screen w-full'>
    <h1 className='text-black text-6xl p-3 text-center'>Our Services </h1>
    <div className='card-div flex flex-wrap justify-center w-full gap-6'>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
    </div>
    </div>
    </>
  )
}

export default Services