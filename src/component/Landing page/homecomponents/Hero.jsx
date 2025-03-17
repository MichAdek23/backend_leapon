import React from 'react'
import { asset } from '../../../assets/assets'
import { Search } from 'lucide-react';

const Hero = () => {
  return (
    <div className='flex items-center justify-center md:justify-between px-1 py-8'>
      <div className='hidden md:block'>
          <ul className='grid grid-cols-2 gap-2'>
           <img className='rounded-xl' src={asset.blackman1} alt="" />
           <img className='rounded-xl' src={asset.people} alt="" />
           <img className='rounded-xl' src={asset.closeup} alt="" />
           <img className='rounded-xl' src={asset.frame17} alt="" />
          </ul>
      </div>
      <div className='text-center px-4'>
         <h1 className='text-6xl font-bold text-center'>  1-on-1 <br/>
            Strategic <br/>
            Mentorship</h1>
        <p className='mb-5 mt-4 p-3 text-md'>Experience life-changing mentorship, your path to <br/> extraordinary growth starts here.</p>
        <p className='border text-gray-500 rounded-xl py-3 text-sm flex items-center justify-center'> <Search className='pr-3'/> what do you want to get better at</p>
      </div>
      <div className='hidden md:block'>
          <ul className='grid grid-cols-2 gap-2'>
           <img className='rounded-xl' src={asset.young} alt="" />
           <img className='rounded-xl' src={asset.confident} alt="" />
           <img className='rounded-xl' src={asset.portrait} alt="" />
           <img className='rounded-xl' src={asset.couple } alt="" />
          </ul>
      </div>
    </div>
  )
}

export default Hero
