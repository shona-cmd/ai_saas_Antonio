import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";


const replicate = new Replicate({
    auth:process.env.REPLICATE_API_TOKEN,
});


export async function POST(req:Request) {
    try{
        const {userId} = auth();
        const body = await req.json();
        const {prompt} = body;

        if (!process.env.REPLICATE_API_TOKEN) {
            throw new Error(
              'The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.'
            );
          }

        if(!userId){
            return new NextResponse("Unauthorized", {status:401});
        }

        if(!prompt){
            return new NextResponse("Prompt is required", {status:400});
        }
        
        const response  = await replicate.run(
            "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
            {
              input: {
                prompt_b: prompt,
              }
            }
          );

        return NextResponse.json(response);
    }catch(error){
        console.log("[Music_ERROR",error);
        return new NextResponse("Internal error",{status:500});
    }
}