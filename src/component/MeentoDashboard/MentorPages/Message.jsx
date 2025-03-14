import { GlobalContext } from "@/component/GlobalStore/GlobalState";
import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function Message() {
    const { upDatePage, handleToggleState, acceptedMentees } =
        useContext(GlobalContext);
    const [inputValue, setInputValue] = useState("");
    console.log(acceptedMentees);

    const filterMentee = acceptedMentees.filter((mentee) =>
        inputValue  ? mentee.first_name.toLowerCase().includes(inputValue.toLowerCase()) || mentee.last_name.toLowerCase().includes(inputValue.toLowerCase()) : true 
      );

    return (
        <div>
            <header className="flex p-3 md:p-0 justify-between">
                <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-[32px] font-medium">Message</h1>
                        <p className="text-lg font-bold">
                            Easy Communication with eveyone{" "}
                        </p>
                    </div>

                    <div className="flex justify-center gap-4">
                        <img
                            onClick={() => upDatePage("Message")}
                            src="/image/messageIcon.png"
                            className="md:w-12 h-9 md:h-12"
                            alt=""
                        />
                        <img
                            onClick={() => upDatePage("Setting")}
                            src="/image/settingIcon.png"
                            className="md:w-12 h-9 md:h-12"
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

            <main className=" w-full  border-4 h-screen md:h-[80vh] sidebar mt-20 rounded-3xl bg-white flex flex-col md:flex-row">
                <div className=" h-full  sidebar  w-full md:w-1/3 ">
                    <div className="h-20  p-4">
                        <div className=" h-14 rounded-xl ps-3 border-2 flex ">
                            <button>
                                <FontAwesomeIcon className=" text-slate-500" icon={faSearch} />
                            </button>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="  outline-none  ps-2 h-full w-full"
                                placeholder="Search by Name"
                                name=""
                                id=""
                            />
                        </div>
                    </div>

                    <div className="">
                        <div className=" mt-7 flex flex-col gap-5">
                            {!filterMentee.length ? (
                                <div className="text-gray-500">No Mentee Accepted</div>
                            ) : (
                                filterMentee.map((mentee) => (
                                    <div
                                        key={mentee.id}
                                        className="flex items-center  cursor-pointer p-2 hover:bg-gray-100"
                                    >
                                        <img
                                            src={mentee.avatar}
                                            alt={mentee.first_name}
                                            className=" w-14  h-14 rounded-lg mr-4"
                                        />
                                        <div>
                                            <h3 className="font-medium">
                                                {mentee.first_name} {mentee.last_name}
                                            </h3>
                                            <p className="text-sm text-gray-500">{mentee.email}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <div className=" h-full w-[73.3333%] border-s-2"></div>
            </main>
        </div>
    );
}

export default Message;
