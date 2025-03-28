import { asset } from '@/assets/assets'
import React from 'react'

const Mentee = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 px-6 sm:px-20 gap-32'>

      <div className='bg-white w-full'>
        <h1 className='text-orange-500 font-bold text-xl'>MENTEE PROFILE</h1>
        <div className='font-bold text-xl sm:text-3xl text-left mt-8'>
        Detailed information about the <br/> mentee's background, goals, <br/>interests, and areas they seek <br /> mentorship in.
        </div>
        <div className='bg-gray-200 mt-8 py-2 px-5 text-sm rounded-md'>
        Chance to tell your unique story, including career journey, lessons <br />learned, and aspirations.
        </div>
      </div>

      <div className='bg-gray-200 w-full border border-r-0 border-b-0 rounded-tl-xl pl-5 pt-5'>
        <div className='bg-white border border-b-0 border-r-0  rounded-tl-xl pl-2 py-2'>
          <div className='bg-white'>
            <img src={asset.mentee2} alt=""  className=' w-[70%] h-[100px] sm:w-[36%] sm:h-[120px] absolute rounded-l-xl' />
            <div className=' relative top-20 left-5 flex items-center justify-left sm:gap-x-10 gap-x-2'>
              <img src={asset.mentee1} alt="" className='w-[100px] sm:w-[149px] border-4 border-gray-100 rounded-full' />
              <div className='font-bold text-[10px] sm:text-xl  text-left'>
                <h1>Emmanuella Bernard </h1>
                <p>Registered Nurse</p>
              </div>
            </div>
          </div>
        
        <div className='mt-28 rounded-xl bg-white mr-8 py-2 px-5'>
          <h1 className='text-gray-900 font-bold text-xl'>Overview</h1>
          <hr className='border-orange-500 w-[90px] border-2'/>
          <hr className='pb-3'/>

          <p className='text-[12px] mb-5'>
          I am a dedicated Nigerian nurse with 5 years of experience 
          in Intensive Care. Skilled in managing critically ill patients, 
          administering complex medications, and providing ventilator 
          support. Passionate about improving patient outcomes and advocating 
          for quality healthcare in Nigeria. Seeking a challenging role where 
          I can utilize my skills and contribute to the growth of the healthcare sector

          </p>
         
        </div>
      </div>
      </div>
    </div>
  )
}

export default Mentee
