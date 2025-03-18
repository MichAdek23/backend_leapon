import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import React, {  useState } from 'react';

function StepFour() {
    const [textarea, setTextarea] = useState('');
    const [university, setUniversity] = useState('');
    const [department, setDepartment] = useState('');

    return (
        <div className='w-[300px] lg:w-[470px]'>
            <p className='text-base text-center font-medium mt-3 lg:mt-6'>STEP 4 of 4</p>

            <progress className='bg-customOrange h-2' value="100" max="100"></progress>

            <h1 className='mt-7 mb-12 text-[36px] font-medium'>Tell us About yourself</h1>

            {/* University Input Field */}
            <div className='border-2 relative w-full rounded-xl mb-4'>
                <input
                    type="text"
                    className='relative outline-none p-4 w-full rounded-xl'
                    placeholder='E.g University of Port Harcourt'
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                />
                {/* Positioned <p> tag on the border of the input */}
                <p className='absolute -top-3 left-4 bg-white px-2 text-base font-bold text-slate-400'>
                    School
                </p>
            </div>

            {/* Department Input Field */}
            <div className='border-2 relative w-full rounded-xl mb-4'>
                <input
                    type="text"
                    className='relative outline-none p-4 w-full rounded-xl'
                    placeholder='E.g Computer Science'
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                />
                {/* Positioned <p> tag on the border of the input */}
                <p className='absolute -top-3 left-4 bg-white px-2 text-base font-bold text-slate-400'>
                    Department
                </p>
            </div>

            {/* Textarea for Introduction */}
            <div className='border-2 relative w-full rounded-xl mb-4'>
                <textarea
                    className='relative outline-none p-4 w-full h-40 rounded-xl'
                    placeholder='Introduce yourself to your mentors, let them know your Education Level and what you want to achieve'
                    value={textarea}
                    onChange={(e) => setTextarea(e.target.value)}
                />
                {/* Positioned <p> tag on the border of the textarea */}
                <p className='absolute -top-3 left-4 bg-white px-2 text-base font-bold text-slate-400'>
                    Select Gender
                </p>
            </div>

            {/* Continue Button */}
            <button  className='mt-4 w-full h-14 rounded-lg cursor-pointer text-white bg-customOrange'>
                Continue
            </button>
        </div>
    );
}

export default StepFour;