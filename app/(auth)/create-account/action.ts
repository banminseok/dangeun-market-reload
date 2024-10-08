"use server";
import {z} from "zod";
import bcrypt from "bcrypt";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "../../../lib/constants";
import db from "../../../lib/db";
import { redirect } from "next/navigation";
import getSession from "../../../lib/session";
import updateSession from "@/lib/updateSession";

interface ActionState{
  token : boolean
}

const checkUsername = (username: string) => !username.includes("potato");

const checkPasswords=({
  password, confirm_password,
}:{
  password: string; confirm_password:string;
})=>password===confirm_password;


const formSchema= z.object({
  username : z.string({
    invalid_type_error:"Username must be a string!",
    required_error:"Where is my username??",
  }).min(3,"Way too short!(username은 4자이상!)").max(10,"That is too looooo (10자 이하)")
  .trim().toLowerCase()
  //.transform((username)=>`🔥 ${username}`)
  .refine(checkUsername, "No potatoes allowed"),
  email: z.string().email().toLowerCase(),
  password : z.string().min(PASSWORD_MIN_LENGTH)
  .regex(
    PASSWORD_REGEX,
    "Passwords must contain at least one UPPERCASE, lowercase, number and special characters #?!@$%^&*-"
  ),
  confirm_password : z.string().min(PASSWORD_MIN_LENGTH),  
})
.superRefine(async ({username}, ctx)=>{
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id:true,
    },
  });
  if (user) {
    ctx.addIssue({
      code: "custom",
      message: "This username is already taken",
      path: ["username"],
      fatal: true,
    });
    return z.NEVER;
  }
})
.superRefine(async ({email},ctx)=>{
  const user = await db.user.findUnique({
    where: {
      email
    },
    select: {
      id:true,
    },
  });
  if(user){
    ctx.addIssue({
      code:"custom",
      message : "This email is already taken",
      path: ["email"],
      fatal:true,
    });
    return z.NEVER;
  }
})
//.superRefine(({ password, confirm_password }, ctx) => {
//  if (password !== confirm_password) {
//    ctx.addIssue({
//      code: "custom",
//      message: "Two passwords should be equal",
//      path: ["confirm_password"],
//    });
//  }
//});
.refine(checkPasswords, {
  message: "Both passwords should be the same!",
  path: ["confirm_password"],
});


export async function createAccount(preState:ActionState, formData:FormData) {
  const data = {
    username : formData.get("username"),
    email : formData.get("email"),
    password : formData.get("password"),
    confirm_password : formData.get("confirm_password"),
  }
  //console.log(data);

  const result = await formSchema.safeParseAsync(data);
  if(!result.success){
    return result.error.flatten();
  }else{
    //console.log(result.data); 
    //check if the email is already used.
    //hash password. 
        //npm i bcrypt
        //npm i @types/bcrypt
        const hashedPassword =  await bcrypt.hash(result.data.password, 12);
    //savu the user to db
    const user = await db.user.create({
      data:{
        username:result.data.username,
        email:result.data.email,
        password: hashedPassword,
      },
      select:{
        id:true,
      },
    });
    console.log(process.env.COOKIE_PASSWORD);
    // log the user in ==> cookie({id:5})
    //npm i iron-session
    const session  = await getSession();

    session.id = user.id;
    await session.save();
    await updateSession(user.id);
    redirect("/profile");
  }
}


/**
 * 
 * [.regax]
정규표현식으로 데이터 검증을 할 수 있습니다.

[.toLowerCase]
String 타입의 데이터를 모두 소문자로 변환해줍니다.

[.trim]
String 타입의 데이터에서 맨앞과 뒤에 붙은 공백을 제거해줍니다.

[.transform]
이 메서드를 이용하면 해당 데이터를 변환할 수 있습니다.
예시: .transform((username) => `🔥 ${username} 🔥`)

[zod 공식문서]
https://zod.dev/

 * 비밀번호 정규 표현식
소문자, 대문자, 숫자, 특수문자의 일부를 모두 포함하고 있는지 검사
const passwordRegex = new RegExp(
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);

.transform
파싱 후 데이터를 변환하려면 transform 메서드를 사용하세요.
```
const stringToNumber = z.string().transform((val) => val.length);
stringToNumber.parse("string"); // => 6
```
https://zod.dev/?id=transform

비밀번호 정규표현식 테스트
https://regexr.com/3bfsi

zod 공식 문서
https://zod.dev
 */