"use server";

import { z } from "zod";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "../lib/constants";

interface ActionState{
  token: boolean
}

const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  password : z.string({required_error:"Password is required"})
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});
export async function login(prevState: ActionState, formData: FormData) {
  console.log(prevState, formData);
  const data={
    email : formData.get("email"),
    password: formData.get("password"),
    //...Object.fromEntries(formData.entries()),
  };
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const result = formSchema.safeParse(data);
  if(!result.success){
    //console.log('result.error.flatten()',result.error.flatten());
    console.log(result.error.flatten())
    return result.error.flatten().fieldErrors;
  }else{
    console.log(result.data)
  }
}