import { PrismaClient, Tweet, User } from '@prisma/client';
import { redisClient } from '../client/redis/index.js';

export interface CreateTweetPayload {
  content: string;
  imageURL?: string;
  userId: string;
}
const prismaClient = new PrismaClient();
class TweetService {
public static async createTweet(data: CreateTweetPayload) {
    const rateLimitFlag = await redisClient.get(
      `RATE_LIMIT:TWEET:${data.userId}`
    );
    if (rateLimitFlag) throw new Error("Please wait....");
    
    const tweet = await prismaClient.tweet.create({
      data: {
        content: data.content,
        imageURL: data.imageURL??null,
        author: { connect: { id: data.userId } },
      },
    });
    await redisClient.setex(`RATE_LIMIT:TWEET:${data.userId}`, 10, 1);
    await redisClient.del("ALL_TWEETS");

    return tweet;
  }


  public static async getAllTweets() {
    const cachedTweets = await redisClient.get<string>("ALL_TWEETS");
    
if (cachedTweets) {
  // cachedTweets might already be a string
  if (typeof cachedTweets === "string") {
    return JSON.parse(cachedTweets) as Tweet[];
  } else {
    return cachedTweets as Tweet[];
  }
}
   

    const tweets = await prismaClient.tweet.findMany({
      orderBy: { createdAt: "desc" },
    });
   await redisClient.set("ALL_TWEETS", JSON.stringify(tweets));
    return tweets;
  }
}
export default TweetService;