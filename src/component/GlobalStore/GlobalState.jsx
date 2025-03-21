import React, { createContext,  useMemo,  useState } from "react";
import Overview from "../MeentoDashboard/MentorPages/Overview";
import Explore from "../MeentoDashboard/MentorPages/Explore";
import Message from "../MeentoDashboard/MentorPages/Message";
import Booking from "../MeentoDashboard/MentorPages/Booking";
import MyProfile from "../MeentoDashboard/MentorPages/MyProfile";
import Setting from "../MeentoDashboard/MentorPages/Setting";
import ProfileId from "../MeentoDashboard/MentorPages/profileId";


export const GlobalContext = createContext();

const components = {
  Overview,
  Explore,
  Message,
  Booking,
  Profile: MyProfile,
  Setting,
  ProfileId 
};

function GlobalState({ children }) {
  const [activeComponent, setActiveComponent] = useState(() => {
    const storedComponent = localStorage.getItem('components');
    if (storedComponent && storedComponent !== "undefined") {
      try {
        return JSON.parse(storedComponent);
      } catch (error) {
        console.error("Error parsing stored component:", error);
        return "Overview"; 
      }
    }
    return "Overview"; 
  });

  const [otpshow , setOtpShow] = useState(false)


  const ShowResetConfirmation = ()=>{
       setOtpShow(!otpshow)
  }

  

  const [toggleState, setToggleState] = useState(false);

  const [selectedMentee, setSelectedMentee] = useState(() => {
    const storedMentee = localStorage.getItem('mentee');
    if (storedMentee) {
      try {
        return JSON.parse(storedMentee);
      } catch (error) {
        console.error("Error parsing stored mentee:", error);
        return null;
      }
    }
    return null;
  });

  const [acceptedMentees, setAcceptedMentees] = useState(() => {
    const AcceptedMentee = localStorage.getItem('Add');
    try {
      return AcceptedMentee ? JSON.parse(AcceptedMentee) : [];
    } catch (error) {
      console.error("Error parsing accepted mentees:", error);
      return [];
    }
  });

  const memoizedAcceptedMentees = useMemo(() => acceptedMentees, [acceptedMentees]);



  const [currentIndex, setCurrentIndex] = useState(1);
    
  const steps = [1,2,3,4,3]
 
  const handleIncreament = ()=>{
     setCurrentIndex((index)=> (index + 1 ) % steps.length)
  }

  
  const handleDecreament = ()=>{
    setCurrentIndex((index)=> (index - 1 ) % steps.length)
 }
 

  const handleToggleState = () => {
    setToggleState(!toggleState);
    // hhhhhdh
  };

  const upDatePage = (ComponentName) => {
    localStorage.setItem('components', JSON.stringify(ComponentName));
    setActiveComponent(ComponentName);
    setToggleState(false);
  };

  const AddMentees = (mentee) => {
    const isAlreadyAdded = acceptedMentees.some((item) => item.id === mentee.id);
    if (!isAlreadyAdded) {
      const updatedList = [...acceptedMentees, mentee];
      setAcceptedMentees(updatedList);
      localStorage.setItem("Add", JSON.stringify(updatedList));
    }
  };

  const ActiveComponent = components[activeComponent] || Overview;

  return (
    <GlobalContext.Provider value={{ ActiveComponent,  handleDecreament, handleIncreament , currentIndex,  acceptedMentees: memoizedAcceptedMentees, AddMentees, upDatePage, ShowResetConfirmation , otpshow , setOtpShow, activeComponent, handleToggleState, toggleState, setSelectedMentee, selectedMentee }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalState;