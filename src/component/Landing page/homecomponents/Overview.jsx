import { asset } from '@/assets/assets'
import React from 'react'
import { Link } from 'react-router-dom'


const Overview = () => {
  return (
   
    <div className="relative  mb-50 bg-[url('/beforeFooter.png')] bg-center bg-cover bg-no-repeat h-[40%] sm:h-[100%]">
        <div className='grid grid-cols-1 text-center pt-5 sm:pt-20 gap-y-1 sm:gap-y-3'>
            <h1 className='text-xl text-orange-50 font-bold sm:text-4xl'>Your Path to Success, Starts Here</h1>
            <h5 className='text-orange-50 font-semibold text-[12px] sm:text-md'>Connect with Industry Leaders, Accelerate Your Career.</h5>
            <Link onClick={()=>  navigate('/SignUp')} className=" mx-auto text-orange-500 md:block border bg-orange-50 flex border-orange-50  px-2 py-1 sm:px-6 sm:py-2 rounded-xl">Get Started</Link>
        </div>
      <div className='absolute bottom-0 flex mx-auto w-[80%] left-10 right-10 sm:left-20 sm:right-20 '>
        <img src={asset.Overview} alt="" className=''/>
      </div>
    </div>
    
  )
  
}

export default Overview
