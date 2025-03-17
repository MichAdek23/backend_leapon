
import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

function MenteeForm() {
  const navigate = useNavigate();
 const {  DisplaySteps , } = useContext(GlobalContext)



   


  return (
    <section className="relative flex h-full">
      
      <div className="hidden lg:block h-full w-3/5">
        <img src="/image/young-people-working-from-modern-place 1.png" className="h-full w-full object-cover" alt="" />
        <div onClick={() => navigate('/')} className="absolute top-4">
          <img src="/image/LogoAyth.png" className="w-40" alt="" />
        </div>
      </div>



      <div className="flex items-center w-full lg:w-2/5 justify-center">
         {
           DisplaySteps() 
         }
      </div>

   
    </section>
  );
}

export default MenteeForm;