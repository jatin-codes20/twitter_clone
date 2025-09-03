import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { GraphqlContext } from "../../interface.js";
import { PrismaClient, Tweet } from '@prisma/client';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface CreateTweetPayload {
  content: string;
  imageURL?: string;
}

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIARPJIVNSENDROKXJZ",
    secretAccessKey: "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",
  },
});

const prismaClient = new PrismaClient();


const queries = {
  getAllTweets: () =>
    prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" } }),
  getSignedURLForTweet: async (
    parent: any,
    { imageType, imageName }: { imageType: string; imageName: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");
    const allowedImageTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedImageTypes.includes(imageType))
      throw new Error("Unsupported Image Type"+ imageType);

    const putObjectCommand = new PutObjectCommand({
      Bucket: "risheek-twitter-dev",
      ContentType: imageType,
      Key: `uploads/${ctx.user.id}/tweets/${imageName}-${Date.now()}`,
    });

    const signedURL = await getSignedUrl(s3Client, putObjectCommand);

    return signedURL;
  },
};


const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweetPayload },
    ctx: GraphqlContext
  ) => {

    if (!ctx.user) throw new Error("You are not authenticated");
    const tweet = await prismaClient.tweet.create({
      data: {
        content: payload.content,
        imageURL: payload.imageURL??null,
        author: { connect: { id: ctx.user.id } },
      },
    });

    return tweet;
  },
};

const extraResolvers = {
  Tweet: {
    author: (parent: Tweet) =>
      prismaClient.user.findUnique({ where: { id: parent.authorId } }),
  },
};

export const resolvers = { mutations, extraResolvers, queries };