"use server";

import {z} from 'zod'
import validator from "validator";
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import crypto from "crypto";
import twilio from "twilio";
import getSession from '@/lib/session';

interface ActionState{
  token : boolean;
  phone? : string;
}


async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists);
}

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (exists) {
    return getToken();
  } else {
    return token;
  }
}

const phoneSchema = z.string()
  .trim()
  //.refine((phone)=>validator.isMobilePhone(phone, "ko-KR"),"Wrong phone format");

const tokenSchema = z.coerce.number()
  .min(100000)
  .max(999999)
  .refine(tokenExists,"This token does not exist.");


export async function smsLogin(prevState:ActionState, formData:FormData){
  const phone = formData.get("phone");
  const token = formData.get("token");
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if(!result.success){
      return {
        token:false,
        error : result.error.flatten(),
      };
    }else{
      // delete provious token
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      //create token
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: { // 전화번호와 매칭되는 user 가 없으면 임의 string 로  생성.
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });
      /*
      // send the token using twilio
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        body: `Your Karrot verification code is: ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.MY_PHONE_NUMBER!,
        //to: result.data,
      });
      */
      return {
        token: true,
      };
    }
  }else{
    //verification code ==> verify Token
    //get th userId  of token
    //
    console.log(token);
    const tokenResult = await tokenSchema.spa(token);
    const phoneResult = await phoneSchema.safeParse(prevState.phone);
    console.log(phoneResult)
    if (!tokenResult.success) {
      return {
        token: true,
        error: tokenResult.error.flatten(),
      };
    } else {
      //redirect("/");
      const token = await db.sMSToken.findUnique({
        where: {
          token: tokenResult.data.toString(),
          user: {
            phone : phoneResult.data,
          }
        },
        select: {
          id: true,
          userId: true,
        },
      });
      if (!token) {
        return {
          error: {
            formErrors: ["This token is not exists"],
          },
        };
      }
      const session = await getSession();
      session.id = token!.userId;
      await session.save();
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });
      redirect("/profile");
    }
  }
}

