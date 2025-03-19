import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Pending from './messageComponemts/Pending';
import Histroy from './messageComponemts/histroy';


function Booking() {
  const { upDatePage, handleToggleState } = useContext(GlobalContext);
  const [components, setComponents] = useState('Pending'); 

  const changeStateToPending = () => {
    setComponents('Pending'); 
  };

  const changeStateToHistory = () => {
    setComponents('History'); 
  };

  const displayComponent = () => {
    switch (components) {
      case 'Pending':
        return  <Pending/>;
      case 'History':
        return <Histroy/>; 
      default:
        return <div>No component found</div>; 
    }
  };

  return (
    <section className="p-3 md:p-0">
      {/* Header Section */}
      <header className="flex justify-between">
        <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-[32px] font-medium">Bookings</h1>
            <p className="text-base font-medium text-slate-600">Easy Communication with everyone</p> {/* Fixed typo */}
          </div>

          <div className="flex justify-center gap-4">
            <img
              onClick={() => upDatePage('Message')}
              src="/image/messageIcon.png"
              className="md:w-12 h-9 md:h-12 cursor-pointer"
              alt="Message Icon"
              loading="lazy"
            />
            <img
              onClick={() => upDatePage('Setting')}
              src="/image/settingIcon.png"
              className="md:w-12 h-9 md:h-12 cursor-pointer"
              alt="Setting Icon"
              loading="lazy"
            />
          </div>
        </div>
        <div onClick={handleToggleState} className="block lg:hidden mt-3">
          <button>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </header>

      <main className="mt-14">
        <div className="p-2 bg-white w-fit flex items-center gap-2 rounded-md cursor-pointer">
          <button
            onClick={changeStateToPending}
            className={`h-10 w-28 rounded-md text-black font-semibold transition-colors duration-300 ${
              components === 'Pending' ? 'bg-customOrange text-white' : 'bg-slate-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={changeStateToHistory}
            className={`h-10 w-28 rounded-md text-black font-semibold transition-colors duration-300 ${
              components === 'History' ? 'bg-customOrange text-white' : 'bg-slate-200'
            }`}
          >
            History
          </button>
        </div>

        <section className="w-full bg-slate-100 mt-4 p-4 rounded-lg">
          {displayComponent()}
        </section>
      </main>
    </section>
  );
}

export default Booking;