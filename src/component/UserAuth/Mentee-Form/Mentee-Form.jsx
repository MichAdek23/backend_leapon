
import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import StepOne from './stepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';



function MenteeForm() {
  const navigate = useNavigate();
 const {  currentIndex} = useContext(GlobalContext)



  const DisplaySteps = ()=>{
    if (currentIndex == 1) {
      return <StepOne/>
   } else if (currentIndex == 2) {
      return  <StepTwo/>
   } else if ( currentIndex == 3) {
      return <StepThree/>
   } else if (currentIndex == 4) {
     return  <StepFour/>
   }
  }



   


  return (
    <section className="relative flex h-full">
      
      <div className="hidden lg:block h-full w-3/5">
        <img src="/image/young-people-working-from-modern-place 1.png" className="h-full w-full object-cover" alt="" />
        <div onClick={() => navigate('/')} className="absolute top-4">
          <img src="/image/LogoAyth.png" className="w-40" alt="" />
        </div>
      </div>



      <div className="flex w-full lg:w-2/5 ">
         {/* <button className=' w-5 h-5 bg-slate-400 rounded-full '>
            <FontAwesomeIcon className=' text-2xl' icon={faArrowLeft}/>
         </button> */}

         <div className=' w-full flex mt-14 justify-center '>            
         {
           DisplaySteps() 
         }
      </div>
       
       </div>
   
    </section>
  );
}

export default MenteeForm;