import React from 'react'
import { asset } from '../../../assets/assets'
import { CircleDotDashed } from 'lucide-react';

const AfterHero = () => {
  return (
    <div className=' '>
      <div className='relative '>
        <img className='mt-24 h-15 w-full' src={asset.section} alt="" />
        <div className='absolute top-7 w-full flex items-center justify-center text-2xl  px-20 text-yellow-50 font-bold'> 
          <CircleDotDashed className='mr-6'/>
          Your Mentor, Your Future 
          <CircleDotDashed className='mr-6 ml-6'/> 
          Connect, Grow, Achieve 
          <CircleDotDashed className='mr-6 ml-6'/> 
          Your Vision, Our Mission
          <CircleDotDashed className='mr-6 ml-6'/> 
          </div>
      </div>
    </div>
  )
};

export default AfterHero
