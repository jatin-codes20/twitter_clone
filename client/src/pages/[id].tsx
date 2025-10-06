import type { GetServerSideProps, NextPage } from "next";
import TwitterLayout from "../../components/Layout/TwitterLayout";
import { BsArrowLeftShort } from "react-icons/bs";
import { useCurrentUser } from "../../hooks/user";
import Image from "next/image";
import FeedCard from "../../components/FeedCard";
import { Tweet, User } from "../../gql/graphql";
import{useRouter} from "next/router"
import { getUserByIdQuery } from "../../graphql/queries/user";

import { followUserMutation, unfollowUserMutation } from "../../graphql/mutation/user";
// Ensure that followUserMutation and unfollowUserMutation are exported as GraphQL documents (e.g., string or TypedDocumentNode) from the mutation file.

import { graphqlClient } from "../../clients/api";
import { userInfo } from "os";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

interface ServerProps {
  userInfo?: User;
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
    const { userInfo } = props;
        const router=useRouter()
    const { user: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const amIFollowing = useMemo(() => {
    if (!props.userInfo) return false;
    return (
      (currentUser?.following?.findIndex(
        (el) => el?.id === props.userInfo?.id
      ) ?? -1) >= 0
    );
  }, [currentUser?.following, props.userInfo]);

  const handleFollowUser = useCallback(async () => {
    if (!props.userInfo?.id) return;

    await graphqlClient.request(followUserMutation, { to: props.userInfo?.id });
    await queryClient.invalidateQueries({ queryKey: ["current-user"] });
  }, [props.userInfo?.id, queryClient]);

  const handleUnfollowUser = useCallback(async () => {
    if (!props.userInfo?.id) return;

    await graphqlClient.request(unfollowUserMutation, {
      to: props.userInfo?.id,
    });
    await queryClient.invalidateQueries({ queryKey: ["current-user"] });
  }, [props.userInfo?.id, queryClient]);
    
    return(
        <TwitterLayout>

          <div>
          <nav className="flex items-center gap-3 py-3 px-3">
            <BsArrowLeftShort className="text-4xl" />
            <div>
              <h1 className="text-2xl font-bold">
          {userInfo?.firstName} {userInfo?.lastName }
              </h1>
              <h1 className="text-md font-bold text-slate-500">
                {userInfo?.tweets?.length} Tweets
              </h1>
            </div>
          </nav>
          
           <div className="p-4 border-b border-slate-800">
            {userInfo?.profileImage && (
              <Image
                src={userInfo?.profileImage}
                alt="user-image"
                className="rounded-full"
                width={100}
                height={100}
              />
           

          )}
              <h1 className="text-2xl font-bold mt-5">
              {userInfo?.firstName} {userInfo?.lastName}
            </h1>
            
             <div className="flex justify-between items-center">
            <div className="flex gap-4 mt-2 text-sm text-gray-400">
              <span>{userInfo?.followers?.length} followers</span>
              <span>{userInfo?.following?.length} following</span>
            </div>

          </div>

              {currentUser?.id !== props.userInfo?.id && (
                <>
                  {amIFollowing ? (
                    <button
                      onClick={handleUnfollowUser}
                      className="bg-white text-black px-3 py-1 rounded-full text-sm"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={handleFollowUser}
                      className="bg-white text-black px-3 py-1 rounded-full text-sm"
                    >
                      Follow
                    </button>
                  )}
                </>
              )}
            
            </div>

             <div>
            {userInfo?.tweets?.map((tweet) => (
              <FeedCard data={tweet as Tweet} key={tweet?.id} />
            ))}
          </div>

         
          </div>
        </TwitterLayout>
       
    )
}

export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  const userId = context.query.id as string | undefined;

  if (!userId) return { notFound: true, props: { userInfo: undefined } };

  const userInfo = await graphqlClient.request(getUserByIdQuery, { userId });

  if (!userInfo?.getUserById) return { notFound: true };

  return {
    props: {
      userInfo: userInfo.getUserById as User,
    },
  };
};

export default UserProfilePage;