"use server";

import bcrypt from "bcrypt";
import { z } from "zod";
import db from "../../lib/db";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "../../lib/constants";
import getSession from '../../lib/session';
import { redirect } from "next/navigation";

interface ActionState{
  token: boolean
}

const checkEmailExists= async (email:string)=>{
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      password : true,
    }
  });
  //if(user){
  //  return true;
  //}else{
  //  return false;
  //}
  return Boolean(user);
}

const formSchema = z.object({
  email: z.string().email().toLowerCase().refine(
    checkEmailExists,"An account with this email does not exist."
  ),
  password : z.string({required_error:"Password is required"})
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});
export async function login(prevState: ActionState, formData: FormData) {
  const data={
    email : formData.get("email"),
    password: formData.get("password"),
    //...Object.fromEntries(formData.entries()),
  };
  // 1초 지연 로직 : await new Promise((resolve) => setTimeout(resolve, 1000));
  const result = await formSchema.safeParseAsync(data);
  if(!result.success){
    //console.log('result.error.flatten()',result.error.flatten());
    //console.log(result.error.flatten())
    return result.error.flatten().fieldErrors;
  }else{
    //console.log(result.data)
    //find a user with the email=> 
    const user = await db.user.findUnique({
      where: {
        email:result.data.email,
      },
      select: {
        id: true,
        password : true,
      }
    });
    //if the user is found, check password hash
    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? "xxxx"
    );
    
    if(ok){
      //log the user in
      const session = await getSession();
      session.id = user!.id;
      await session.save();
      redirect("/profile");
    }else{
       //redirect "/profile"
      return {
        //fieldError:{
          password:["Wrong password."],
          email:[],
        //}
      }
    }
    
    
   

  }
}