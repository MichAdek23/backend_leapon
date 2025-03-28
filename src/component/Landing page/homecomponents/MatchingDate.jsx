"use client"

import * as React from "react"

import { Calendar } from "./Calendar"
import { Button } from "./button"

const MatchingDate = () => {
  const [date, setDate] = React.useState(new Date())

  return (
   <>
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="sm:w-[280px]"
    />
    <Button className='sm:w-[270px] w-[250px] text-orange-100 bg-orange-500 rounded-none rounded-l-xl my-3'>Continue</Button>
   </>
  )
}

export default MatchingDate;