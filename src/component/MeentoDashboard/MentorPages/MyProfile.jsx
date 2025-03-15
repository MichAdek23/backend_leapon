import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function MyProfile() {
    const { upDatePage, handleToggleState, } = useContext(GlobalContext)
    return (
        <div>
            <header className="flex justify-between">
                <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-[32px] font-medium">My Profile</h1>
                        <p className="text-base font-meduim text-slate-600">Tell us about yourself</p>
                    </div>


                    <div className="flex justify-center gap-4">
                        <img
                            onClick={() => upDatePage("Message")}
                            src="/image/messageIcon.png"
                            className="md:w-12 h-9 md:h-12 cursor-pointer"
                            alt=""
                        />
                        <img
                            onClick={() => upDatePage("Setting")}
                            src="/image/settingIcon.png"
                            className="md:w-12 h-9 md:h-12 cursor-pointer"
                            alt=""
                        />
                    </div>
                </div>

                <div onClick={handleToggleState} className="block lg:hidden mt-3">
                    <button>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </div>
            </header>



            <section>
                <div>
                 <div className=' h-[162px]'>
                    <img src="image/img.png" className=' w-full h-full object-cover' alt="" />
                 </div>
                  <div></div>
                </div>
                 
            </section>
        </div>
    );
}

export default MyProfile;