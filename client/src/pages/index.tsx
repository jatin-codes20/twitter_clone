import React, { useCallback, useState } from "react";
import { BsTwitter } from "react-icons/bs";
import { BiHash, BiImageAlt, BiMoney } from "react-icons/bi";
import { BiHomeCircle } from "react-icons/bi";
import { BsBell } from "react-icons/bs";
import { BsEnvelope } from "react-icons/bs";
import { BsBookmarks } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import FeedCard from "../../components/FeedCard";
import { SlOptions } from "react-icons/sl";
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
    const  tweets = props.tweets ;
    const { mutateAsync } = useCreateTweet();
    const [content, setContent] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [awsURL, setAwsURL] = useState({getSignedURLForTweet:""});
    const [ uploadFile, setFile] = useState<File | null>(null);
   const handleCreateTweet = useCallback(
    async () => {
    if(uploadFile){
    const { getSignedURLForTweet } = await graphqlClient.request(
        getSignedURLForTweetQuery,
        {
          imageName: uploadFile.name,
          imageType: uploadFile.type,
        }
      );

     if(getSignedURLForTweet) setAwsURL({getSignedURLForTweet})

      if (getSignedURLForTweet) {
        toast.loading("Uploading...", { id: "2" });
        await axios.put(getSignedURLForTweet, uploadFile, {
          headers: {
            "Content-Type": uploadFile.type,
          },
        });
        toast.success("Upload Completed", { id: "2" });
        const url = new URL(getSignedURLForTweet);
        const myFilePath = `${url.origin}${url.pathname}`;
        setImageURL(myFilePath);
      }
        
    }
    await mutateAsync({
      content,
      imageURL,
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

             


