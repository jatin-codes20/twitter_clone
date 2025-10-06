import React, { useCallback, useState } from "react";

import { BiImageAlt } from "react-icons/bi";

import FeedCard from "../../components/FeedCard";

import { useCurrentUser } from "../../hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCreateTweet, useGetAllTweets } from "../../hooks/tweet";
import { Tweet } from "../../gql/graphql";
import TwitterLayout from "../../components/Layout/TwitterLayout";
import { GetServerSideProps } from "next";
import { graphqlClient } from "../../clients/api";
import { getAllTweetsQuery, getSignedURLForTweetQuery } from "../../graphql/queries/tweet";
import toast from "react-hot-toast";
import axios from "axios";

interface TwitterSideBarButton{
  title: string;
  icon: React.ReactNode;
}

interface HomeProps {
  tweets?: Tweet[];
}



export default function Home(props: HomeProps) {

    const  { user } = useCurrentUser();
    const querClient=useQueryClient()
    const { tweets = props.tweets as Tweet[] } = useGetAllTweets();
    
    const { mutateAsync } = useCreateTweet();
    const [content, setContent] = useState("");
    const [imageURL, setImageURL] = useState("");
  
    const [ uploadFile, setFile] = useState<File | null>(null);
   const handleCreateTweet = useCallback(
    async () => {
       let uploadedUrl: string | undefined;
    if(uploadFile){
    const { getSignedURLForTweet } = await graphqlClient.request(
        getSignedURLForTweetQuery,
        {
          imageName: uploadFile.name,
          imageType: uploadFile.type,
        }
      );
      console.log(getSignedURLForTweet);
    

      if (getSignedURLForTweet) {
        toast.loading("Uploading...", { id: "2" });
        console.log("Uploading to:", getSignedURLForTweet);
        await axios.put(getSignedURLForTweet, uploadFile, {
          headers: {
            "Content-Type": uploadFile.type,
          },
        });
        console.log("Upload successful");
        toast.success("Upload Completed", { id: "2" });
        const url = new URL(getSignedURLForTweet);
        uploadedUrl= `${url.origin}${url.pathname}`;
        setImageURL(uploadedUrl);
      }
        
    }
    await mutateAsync({
      content,
      imageURL: uploadedUrl ?? imageURL
    });
    setContent("");
    setImageURL("");
    setFile(null);
  
  }, [mutateAsync, content, imageURL, uploadFile]);


   const handleInputChangeFile = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      event.preventDefault();
      const file: File | null | undefined = input.files?.item(0);
      if (!file) return;
      console.log(file);
      setFile(file);
      const url = URL.createObjectURL(file);
      
        setImageURL(url);
      
    };
  }, []);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    const handlerFn = handleInputChangeFile(input);

    input.addEventListener("change", handlerFn);

    input.click();
  }, [handleInputChangeFile]);



       return (  
         <div >
          <TwitterLayout>
          <div>
                    <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-1">
                          {user?.profileImage && (
                            <Image
                              className="rounded-full"
                              src={user?.profileImage}
                              alt="user-image"
                              height={50}
                              width={50}
                            />
                          )}
                        </div>
                        <div className="col-span-11">
                          <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                           className="w-full bg-transparent text-xl px-3 border-b border-slate-700"
                            placeholder="What's happening?"
                            rows={3}
                          ></textarea>
                            {imageURL && (
                            <Image
                              src={imageURL}
                              alt="tweet-image"
                              width={300}
                              height={300}
                            />
                            )}
                          
                          <div className="mt-2 flex justify-between items-center">
                            <BiImageAlt onClick={handleSelectImage} className="text-xl" />
                            <button
                              onClick={handleCreateTweet}
                              className="bg-[#1d9bf0] font-semibold text-sm py-2 px-4 rounded-full"
                            >
                              Tweet
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {tweets?.map((tweet) =>
                    tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null
                  )}
                          </TwitterLayout>
                        
                      </div>
         
         
  
              )};

    export const getServerSideProps: GetServerSideProps<HomeProps> = async (
                      context
                    ) => {
                      const allTweets = await graphqlClient.request(getAllTweetsQuery);
                      return {
                        props: {
                          tweets: allTweets.getAllTweets as Tweet[],
                        },
                      };
};

             


