import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// 테스트 함수: 새로운 사용자를 생성하고 콘솔에 출력합니다.
// async function test() {
//   const user = await db.user.create({
//     data: {
//       username: "반민석",
//       phone: "01099998482"
//     }
//   });
//   console.log(user);
// }


 async function test() {
   const user = await db.sMSToken.create({
     data: {
       token: "1012345",
       user: {
          connect:{
            id:2,
          },
       },
     }
   });
   console.log(user);
 }


//test();
export default db;