import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import React, { useContext } from 'react';

function StepOne() {
    const { handleIncreament } = useContext(GlobalContext)

    
    return (
        <div className=' w-[300px] lg:w-[400px]'>     
              <p className=' text-base  text-center font-medium mt-3 lg:mt-6'>STEP 1 of 4</p>

              <progress className=' bg-customOrange h-2' value="30" max="100" ></progress>

              <h1 className=' mt-7 text-[36px] font-medium'>Complete Profile Details</h1>

               <div>
                 <p className=' mt-5 text-lg font-medium text-cyan-600'>Upload profile photo*</p>

                 <div className=' flex flex-col lg:flex-row items-center mt-5 gap-3'>
                    <div className=' h-[75px] w-[75px] rounded-full flex justify-center items-center bg-slate-600 text-4xl font-medium text-blue-950'>E</div>
                    <div>
                      <input type="file" name="image" className=' bg-transparent' placeholder='Select a file' id="" />
                       
                        <p>Make sure the file is below 12mb</p>
                    </div>
                 </div>
               </div>

               <div className=' mt-7  relative  w-full border-2 border-slate-300  p-4 rounded-lg '>
                  <select className=' text-base text-slate-400 font-medium w-full ' name="" id="">
                    <option  value="">Select One</option>
                    <option value="">Male</option>
                    <option value="">Female</option>
                  </select>

                  <p className=' absolute  bottom-12 bg-white  text-base font-bold text-slate-400'>Select Gender</p>
               </div>

            <button onClick={handleIncreament} className=' mt-4 w-full h-14 rounded-lg cursor-pointer text-white bg-customOrange'>Continue</button>
       
        </div>
    );
}

export default StepOne;