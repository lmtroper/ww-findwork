import React from 'react'
import { Bakbak_One, Averia_Serif_Libre } from "next/font/google";
const averiaSerif = Averia_Serif_Libre({ subsets: ["latin"], weight: "300" });
const averiaSerifBold = Averia_Serif_Libre({ subsets: ["latin"], weight: "400" });



const Circle = ({ number, active }) => {
  return (
    <div className={`${active ? `active ${averiaSerifBold.className}` : `inactive ${averiaSerif.className}`} circle mr-6`}>
    {number}
  </div>
  )
}

export default Circle
