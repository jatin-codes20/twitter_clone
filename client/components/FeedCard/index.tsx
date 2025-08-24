import React from "react";
import Image from "next/image";
import { BiHeart, BiMessage, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";

const FeedCard : React.FunctionComponent = () => {
     
return <div>
        <div className="grid grid-cols-12 p-2 border-t border-gray-600 hover:bg-gray-900 cursor-pointer transition-all"
        >
            <div className="col-span-2" >
                <Image src="https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png" alt="Profile"  height={50} width={50} className="rounded-full"/>
            </div>
            
            <div className="col-span-10 text-sm ">
               <h5 className="font-semibold">Risheek Nadimpalli</h5>
               <p >Thisz is my first tweet in my own twitter account .I am exited for this.</p>
                <div className="flex justify-between mt-5 text-xl items-center pr-4 w-[90%]">
                    <div>
                        <BiMessage></BiMessage>  
                    </div>
                    <div>
                       <FaRetweet></FaRetweet>   
                    </div>
                    
                    <div>
                      <BiHeart></BiHeart>
                    </div>
                    <div>
                        <BiUpload></BiUpload>
                    </div>
                </div>
            </div>
        </div>
           
        </div>
    
}
export default FeedCard;
