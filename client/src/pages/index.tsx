import React from "react";
import { BsTwitter } from "react-icons/bs";
import { BiHash, BiMoney } from "react-icons/bi";
import { BiHomeCircle } from "react-icons/bi";
import { BsBell } from "react-icons/bs";
import { BsEnvelope } from "react-icons/bs";
import { BsBookmarks } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import FeedCard from "../../components/FeedCard";
import { SlOptions } from "react-icons/sl";



interface TwitterSideBarButton{
  title: string;
  icon: React.ReactNode;
}

const sidebarMenuButtons: TwitterSideBarButton[] = [
  {
    title: "Home",
    icon: <BiHomeCircle/>
  },
  {
    title: "Explore",
  icon: <BiHash/>},
  {
    title: "Notifications",
    icon: <BsBell/>},
  {
    title: "Messages",
    icon: <BsEnvelope/>},   
  {
    title: "Bookmarks",
    icon: <BsBookmarks/>},
      {
    title: "Twitter Blue",
    icon: <BiMoney/>},
  {
    title: "Profile",
    icon: <BsPerson/>,
  },
   {
    title: "More",
    icon: <SlOptions/>,
  }
  // Add more buttons as needed
];

export default function Home() {
  return (
    
         
         <div >
          <div className="grid grid-cols-12 h-screen w-screen px-40">
            <div className="col-span-3  pt-1 ml-4">
              <div className=" mt-5 ml-4 text-2xl h-fit w-fit  hover:bg-gray-700 rounded-full  cursor-pointer transition-all pt-1 " >
                
                <BsTwitter className=""></BsTwitter>
              </div>
             <div className="mt-4 text-base bold pr-4">
              <ul>
              {sidebarMenuButtons.map(item => <li key={item.title} className="flex justify-start items-center gap-2  hover:bg-gray-700  cursor-pointer rounded-full px-5 py-2  w-fit"><span>{item.icon}</span><span>{item.title}</span>
                </li>)}
              </ul>
              <button className="bg-[#1d9bf0] text-center rounded-full p-1 w-full mt-3 cursor-pointer">Tweet</button>
             </div>
            </div>
            <div className="col-span-5 border-r-[1px] border-l-[1px] border border-gray-600 h-screen overflow-y-scroll">
              <FeedCard />
               <FeedCard />
                <FeedCard />
                 <FeedCard />
               <FeedCard />
                <FeedCard />
                 <FeedCard />
               <FeedCard />
                <FeedCard />
            </div>
            <div className="col-span-3"></div>
          </div>
          </div>
  );
}
