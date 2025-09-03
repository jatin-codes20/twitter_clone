import React, { useCallback, useMemo } from 'react';
import { BiHomeCircle } from 'react-icons/bi';
import { BiHash, BiImageAlt, BiMoney } from "react-icons/bi";
import { BsBell } from "react-icons/bs";
import { BsEnvelope } from "react-icons/bs";
import { BsBookmarks } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import { BsTwitter } from "react-icons/bs";
import { useCurrentUser } from '../../hooks/user';
import { useQueryClient } from '@tanstack/react-query';
import Image from "next/image";
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import {graphqlClient} from "../../clients/api"
import { VerifyGoogleTokenQuery } from "../../graphql/queries/user";
import Link from 'next/link';

interface TwitterlayoutProps {
  children: React.ReactNode;
}


interface TwitterSideBarButton{
  title: string;
  icon: React.ReactNode;
  link: string;
}




const TwitterLayout: React.FunctionComponent<TwitterlayoutProps> = ( props) => {

    const  { user } = useCurrentUser();
    const querClient=useQueryClient()

     const sidebarMenuItems: TwitterSideBarButton[] = useMemo(
    () => [
      {
        title: "Home",
        icon: <BiHomeCircle />,
        link: "/",
      },
      {
        title: "Explore",
        icon: <BiHash />,
        link: "/",
      },
      {
        title: "Notifications",
        icon: <BsBell />,
        link: "/",
      },
      {
        title: "Messages",
        icon: <BsEnvelope />,
        link: "/",
      },
      {
        title: "Bookmarks",
        icon: <BsBookmarks />,
        link: "/",
      },
      {
        title: "Twitter Blue",
        icon: <BiMoney />,
        link: "/",
      },
      {
        title: "Profile",
        icon: <BsPerson />,
        link: `/${user?.id}`,
      },
      {
        title: "More Options",
        icon: <SlOptions />,
        link: "/",
      },
    ],
    [user?.id]
  );


    const handleLoginSuccess = useCallback(async (cred:CredentialResponse) => {
          
          const googleToken = cred.credential
          
          if(!googleToken) return toast.error("Google token not found")
              const {verifyGoogleToken}= await graphqlClient.request(
              VerifyGoogleTokenQuery,
              { token: googleToken }
            );
      
              if(verifyGoogleToken){
              window.localStorage.setItem("__twitter_token",verifyGoogleToken);
              toast.success("Login Successful");
              await querClient.invalidateQueries({queryKey:["current-user"]});
              }
          },[]);
    

    return ( <div>
          <div className="grid grid-cols-12 h-screen w-screen px-40">
            <div className="col-span-3   pr-4 flex justify-end relative">
            <div>
                <div className=" mt-5 ml-4 text-2xl h-fit w-fit  hover:bg-gray-700 rounded-full  cursor-pointer transition-all pt-1 " >
                
                <BsTwitter className=""></BsTwitter>
              </div>
             <div className="mt-4 text-base bold pr-4">
              <ul>
                  {sidebarMenuItems.map((item) => (
                    <li key={item.title}>
                      <Link
                        className="flex justify-start items-center gap-2 hover:bg-gray-700 rounded-full px-5 py-5 w-fit cursor-pointer"
                        href={item.link}
                      >
                        <span>{item.icon}</span>
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              <button className="bg-[#1d9bf0] text-center rounded-full p-1 w-full mt-3 cursor-pointer">Tweet</button>
             </div>
             <div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 rounded-full p-y-4 px-4 ">
                {user?.profileImage && (
                  <Image
                    className="rounded-full"
                    src={user?.profileImage}
                    alt="user-image"
                    height={30}
                    width={30}
                  />
                )}
                <div>
                  <h4>{user?.firstName}</h4>
                </div>
                
              </div>
            </div>
            </div>
            <div className="col-span-5 border-r-[1px] border-l-[1px] border border-gray-600 h-screen overflow-y-scroll">
            {props.children}
            </div>
            <div className="col-span-4 p-5 border border-gray-600 ">
           {!user && < div className="text-center pl-9 py-8 bg-slate-700 rounded-lg">
              <h1 className="my-2 text-2xl">New to twitter?</h1>
              <GoogleLogin onSuccess={handleLoginSuccess}></GoogleLogin>
            </div>}
          </div>
          
          </div>

             </div>
             )};


export default TwitterLayout;
