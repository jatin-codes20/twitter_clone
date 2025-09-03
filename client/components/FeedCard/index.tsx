import React from "react";
import Image from "next/image";
import { BiHeart, BiMessage, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { Tweet } from "../../gql/graphql";
import Link from "next/link";


interface FeedCardProps {
  data: Tweet;
}

const FeedCard : React.FunctionComponent<FeedCardProps> = (props) => {
     const { data } = props;
return <div>
        <div className="grid grid-cols-12 p-2 border-t border-gray-600 hover:bg-gray-900 cursor-pointer transition-all"
        >
            <div className="col-span-2" >
              {data.author?.profileImage && (
                <Image
                  src={data.author?.profileImage}
                  alt="Profile"
                  height={50}
                  width={50}
                  className="rounded-full"
                />
              )}
            </div>
            
            <div className="col-span-10 text-sm ">
               <Link href={`/${data.author?.id}`} className="font-semibold">{data.author?.firstName} {data.author?.lastName}</Link>
               <p>{data.content}</p>
               {data.imageURL && (
            <Image src={data.imageURL} alt="image" width={400} height={400} />
          )}
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
