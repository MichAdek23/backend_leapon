import { GlobalContext } from "@/component/GlobalStore/GlobalState";
import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

function Message() {
  const { upDatePage, handleToggleState, acceptedMentees } = useContext(GlobalContext);
  const [inputValue, setInputValue] = useState("");

  // Handle undefined or null acceptedMentees
  if (!acceptedMentees) {
    return <div className="text-center text-slate-500 py-6">Loading...</div>;
  }

  // Filter mentees based on input value
  const filterMentee = acceptedMentees.filter((mentee) =>
    inputValue
      ? mentee.first_name.toLowerCase().includes(inputValue.toLowerCase()) ||
        mentee.last_name.toLowerCase().includes(inputValue.toLowerCase())
      : true
  );

  return (
    <div>
      {/* Header Section */}
      <header className="flex p-3 md:p-0 justify-between items-center">
        <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-[32px] font-medium">Message</h1>
            <p className="text-base font-medium text-slate-600">Easy Communication with everyone</p>
          </div>

          <div className="flex justify-center gap-4">
            <img
              onClick={() => upDatePage("Message")}
              src="/image/messageIcon.png"
              className="md:w-12 h-9 md:h-12 cursor-pointer"
              alt="Message Icon"
            />
            <img
              onClick={() => upDatePage("Setting")}
              src="/image/settingIcon.png"
              className="md:w-12 h-9 md:h-12 cursor-pointer"
              alt="Setting Icon"
            />
          </div>
        </div>

        <div onClick={handleToggleState} className="block lg:hidden mt-3">
          <button aria-label="Toggle menu">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full border-4 h-screen md:h-[80vh] mt-20 overflow-y-hidden rounded-3xl bg-white flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="h-full sidebar w-full md:w-1/3">
          <div className="h-20 p-4">
            <div className="w-11/12 h-14 rounded-xl ps-3 border-2 flex">
              <button aria-label="Search">
                <FontAwesomeIcon className="text-slate-500" icon={faSearch} />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="outline-none ps-2 h-full w-full"
                placeholder="Search by Name"
                aria-label="Search by Name"
              />
            </div>
          </div>

          {/* Mentee List */}
          <div className="h-full">
            <div className="mt-7 flex flex-col gap-5">
              {!filterMentee.length ? (
                <div className="text-gray-500">No Mentee Accepted</div>
              ) : (
                filterMentee.map((mentee) => (
                  <div
                    key={mentee.id}
                    className="flex items-center cursor-pointer p-2 hover:bg-gray-100"
                  >
                    <img
                      src={mentee.avatar || '/default-avatar.png'}
                      alt={`${mentee.first_name}'s avatar`}
                      className="w-14 h-14 rounded-lg mr-4"
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

        {/* Chat Area */}
        <div className="h-full border relative w-[73.3333%] border-s-4">
          <header className="flex p-4 border-b-2 justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="h-11 w-11">
                <img src="/image/img.png" className="h-full w-full" alt="Profile" />
              </div>
              <div>
                <p>Olaide Bamisebi</p>
                <p>Available</p>
              </div>
            </div>
          </header>

          {/* Chat Messages */}
          <section className="h-full">
            <div className="h-12 w-full absolute bottom-3 px-3 flex items-center">
              <div className="h-12 w-full rounded-xl border-2 bottom-3 px-3 flex items-center">
                <input
                  type="text"
                  className="outline-none ps-4 w-11/12 h-full"
                  placeholder="Type a message"
                  aria-label="Type a message"
                />
                <button className="rotate-45 cursor-pointer" aria-label="Send message">
                  <FontAwesomeIcon className="text-slate-600" icon={faPaperPlane} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Message;