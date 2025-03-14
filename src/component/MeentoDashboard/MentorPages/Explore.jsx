import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { GlobalContext } from "@/component/GlobalStore/GlobalState";
import axios from "axios";



function Explore() {
  const { upDatePage, handleToggleState, setSelectedMentee, AddMentees, acceptedMentees } = useContext(GlobalContext);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputSearch, setInputSearch] = useState()
  const [applySearch, setApplySearch] = useState(false);


  
  useEffect(() => {
    const fetchMentee = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://reqres.in/api/users");
        console.log(res.data); 
        setMentees(res.data.data); 
      } catch (error) {
        console.error("Error fetching mentees:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchMentee();
  }, []);


  const filteredData = mentees
  .filter((item) => 
    !acceptedMentees.some((mentee) => mentee.id === item.id) 
  )
  .filter((item) =>
    applySearch
      ? inputSearch
        ? item.first_name.toLowerCase().includes(inputSearch.toLowerCase()) ||
          item.last_name.toLowerCase().includes(inputSearch.toLowerCase()) ||
          item.email.toLowerCase().includes(inputSearch.toLowerCase())
        : true
      : true
  );

  localStorage.removeItem("Add");
  const handleSearch = ()=>{
    setApplySearch(true)
  }


  const handleBookingNavigation = (mentee)=>{
  
    localStorage.setItem('mentee', JSON.stringify(mentee))
    setSelectedMentee(mentee)
    AddMentees(mentee)
    upDatePage('Message')


  }

  if (!mentees) {
     return <div className=" text-4xl flex  justify-center items-center h-96"> Failed to fetch Data</div>
  }

  return (
    <section className=" p-3 md:p-0">
      {/* Header Section */}
      <header className="flex justify-between">
        <div className="flex flex-col w-full lg:flex-row justify-start items-start lg:items-center gap-4 lg:gap-0 lg:justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-[32px] font-medium">Mentees</h1>
            <p className="text-lg font-bold">Accept Mentee </p>
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

      {/* Main Content */}
      <div className="relative z-20 h-fit">
        <section className="mt-11 w-full flex flex-col md:flex-row lg:flex-nowrap gap-5 h-14 justify-center">
          <p className="absolute z-20 left-9 hidden md:block md:bottom-11 text-slate-400 bg-slate-100">
            search
          </p>
          <div className="md:w-[89%] md:h-full rounded-lg md:rounded-3xl px-3 py-3 md:py-0 md:px-6 border-2">
            <input
              type="text"
              placeholder="Search by name, role, specific area of mentorship"
              className="w-full outline-none h-full bg-transparent"
              name=""
              id=""
              value={inputSearch}
              onChange={(e)=> setInputSearch(e.target.value)}
              
            />
          </div>
          <div onClick={handleSearch } className="h-full cursor-pointer flex justify-center items-center rounded-2xl bg-customOrange py-2 md:w-[12%]">
            <button className="text-base font-bold text-white">Find Mentor</button>
          </div>
        </section>
      </div>

      {/* Mentee Cards */}
      <section  className="h-fit cursor-pointer mt-10 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
        filteredData.map((mentee) => (
            <div
              key={mentee.id} 
              className="border-2 rounded-lg w-full lg:w-fit h-fit bg-white"
            >
              <div className="h-3/5">
                <img
                  src={mentee.avatar} // Use the avatar from the API
                  className="h-full w-full object-cover"
                  alt={mentee.first_name}
                />
              </div>
              <div className="h-2/5 p-6">
                <h3 className="text-lg font-bold text-customDarkBlue">
                  {mentee.first_name} {mentee.last_name}
                </h3>
                <p className="flex items-center text-xs text-customDarkBlue font-normal">
                  <span>
                    <img
                      src="/image/tick.png"
                      className="object-cover h-4 w-4"
                      alt=""
                    />
                  </span>
                  {mentee.email}
                </p>
                <p>4.0/5 (15 Testimonials)</p>

                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex gap-1">
                    <p className="text-xs p-2 rounded-lg bg-slate-200">
                      Experience: 3 Years
                    </p>
                    <p className="text-xs p-2 rounded-lg bg-slate-200">
                      Sessions: 21
                    </p>
                  </div>
                  {/* handleBookingNavigation(mentee) */}
                  <div onClick={()=> handleBookingNavigation(mentee) } className=" px-8 bg-customOrange py-3 cursor-pointer rounded-xl text-base font-medium text-white">
                    <button>Accept Mentee</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </section>
  );
}

export default Explore;