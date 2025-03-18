
import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Step1 from './stepOne';
import Step2 from './StepTwo';
import Step3 from './StepThree';
import Step4 from './StepFour';



function MentorForm() {
  const navigate = useNavigate();
 const {  currentIndex} = useContext(GlobalContext)



  const DisplaySteps = ()=>{
    if (currentIndex == 1) {
      return <Step1/>
   } else if (currentIndex == 2) {
      return  <Step2/>
   } else if ( currentIndex == 3) {
      return  <Step3/>
   } else if (currentIndex == 4) {
     return  <Step4/>
   }
  }



   


  return (
    <section className="relative flex h-full">
      
      <div className="hidden lg:block h-full w-3/5">
        <img src="src\assets\image\young-people-working-from-modern-place 1.png" className="h-full w-full object-cover" alt="" />
        <div onClick={() => navigate('/')} className="absolute top-4">
          <img src="/image/LogoAyth.png" className="w-40" alt="" />
        </div>
      </div>



      <div className="flex flex-col lg:flex-row w-full lg:w-2/5 ">
      <div onClick={() => navigate('/')} className=" block lg:hidden bg-black py-2 px-2">
                    <img src="src\assets\image\LogoAyth.png" className="w-40" alt="" />
     </div>

         <div className=' w-full flex mt-14 justify-center '>            
         {
           DisplaySteps() 
         }
      </div>
       
       </div>
   
    </section>
  );
}

export default MentorForm;