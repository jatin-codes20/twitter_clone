import { useQuery } from "@tanstack/react-query"
import { graphqlClient } from "../clients/api"
import { getCurrentUserQuery } from "../graphql/queries/user"
export const useCurrentUser=()=>{
    const query=useQuery({
        queryKey:["current-user"],
        queryFn: () =>  graphqlClient.request(getCurrentUserQuery)
    });
   
  return {...query,user:query.data?.getCurrentUser}

};