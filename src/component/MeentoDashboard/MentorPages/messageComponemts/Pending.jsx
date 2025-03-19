import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import React, { useContext } from 'react';

function Pending() {
    const { acceptedMentees, upDatePage  } = useContext(GlobalContext)
    console.log(acceptedMentees)
    
    return (
        <section>
            {
                acceptedMentees.map((pending)=>(
                     <div key={pending.id} className=' py-6 border-b-2 border-slate-400' >
                        <div>
                        <h1 className=' text-slate-500'> Mentorship Session with {pending.first_name}</h1>
                        <img src={pending.avatar}  className=' h-24 w-24 rounded-full' alt="" />
                         <p>Wed,31 july 2025</p>
                        </div>

                       <div className=' flex flex-col lg:flex-row gap-3  mt-8'>
                        <button className=' h-12  w-32 p-2 rounded-lg  text-slate-100 font-semibold bg-customOrange'>Join meeting</button>
                        <button onClick={() => upDatePage('Message')} className=' h-12  w-32 p-2 rounded-lg border-2 font-semibold  '>send message</button>
                        <button className=' h-12  w-32 p-2 rounded-lg border-2 font-semibold'>Cancel Session</button>
                       </div>
                     </div>
                ))
            }
        </section>
    );
}

export default Pending;