import type { GetServerSideProps, NextPage } from "next";
import TwitterLayout from "../../components/Layout/TwitterLayout";
import { BsArrowLeftShort } from "react-icons/bs";
import { useCurrentUser } from "../../hooks/user";
import Image from "next/image";
import FeedCard from "../../components/FeedCard";
import { Tweet, User } from "../../gql/graphql";
import{useRouter} from "next/router"
import { getUserByIdQuery } from "../../graphql/queries/user";
import { graphqlClient } from "../../clients/api";
import { userInfo } from "os";

interface ServerProps {
  userInfo?: User;
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
    const { userInfo } = props;
        const router=useRouter()
        console.log(router.query)
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