"use server";
import {z} from "zod";

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
); //banpa$$122A

const formSchema= z.object({
  username : z.string({
    invalid_type_error:"Username must be a string!",
    required_error:"Where is my username??",
  }).min(3,"Way too short!(username은 4자이상!)").max(10,"That is too looooo (10자 이하)")
  .trim().toLowerCase().transform((username)=>`🔥 ${username}`)
  .refine( (username) => !username.includes("potato"),
  "No potatoes allowed!"
  ),
  email : z.string().email().toLowerCase(),
  password : z.string().min(4).regex(
    passwordRegex,
    "Passwords must contain at least one UPPERCASE, lowercase, number and special characters #?!@$%^&*-"
  ),
  confirm_password : z.string().min(4),  
})
.superRefine(({ password, confirm_password }, ctx) => {
  if (password !== confirm_password) {
    ctx.addIssue({
      code: "custom",
      message: "Two passwords should be equal",
      path: ["confirm_password"],
    });
  }
});

export async function createAccount(preState:any, formData:FormData) {
  const data = {
    username : formData.get("username"),
    email : formData.get("email"),
    password : formData.get("password"),
    confirm_password : formData.get("confirmPassword"),
  }
  console.log(data);

  const result = formSchema.safeParse(data);
  if(!result.success){
    return result.error.flatten();
  }else{
    console.log(result.data);
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