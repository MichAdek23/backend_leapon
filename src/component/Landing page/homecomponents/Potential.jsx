import React from 'react'
import { Button } from './button'
import { asset } from '@/assets/assets'

const Potential = () => {
  return (
    <div className='py-20 '>
      <div className="relative bg-[url('/Section5.png')] bg-center bg-cover sm:h-80 h-40 w-100 rounded-xl mx-6 sm:mx-20">
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white '>
        <h2 className='text-[12px] sm:text-4xl font-bold'>Unlock Your Potential with <br /> Expert Guidance</h2>
      <Button className='text-sm sm:text-xl sm:mt-10 mt-5 bg-white text-orange-500 rounded-xl'> Join Us Now</Button> 
      </div>
      
    </div>
    </div>
  )
}

export default Potential
