import { NextRequest } from 'next/server'

export async function GET(request : NextRequest) {
  console.log(request)
  return Response.json({
    ok:true,
  });
}

export async function POST(request : NextRequest) {
  const data = await request.json();
  console.log("log the usr in !!!!")
  return Response.json(data);
}


/**
 * Next.js의 route.ts (또는 route.js) 파일은 App Router에서 사용되는 중요한 파일 컨벤션입니다. 이 파일을 통해 특정 경로에 대한 커스텀 요청 핸들러를 생성할 수 있습니다. 주요 특징은 다음과 같습니다:
위치: app 디렉토리 내의 폴더에 위치합니다.
기능: Web Request와 Response API를 사용하여 특정 경로에 대한 커스텀 요청 처리를 가능하게 합니다.
지원하는 HTTP 메서드: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS 등을 지원합니다.
사용 방법: 각 HTTP 메서드에 대한 비동기 함수를 export하여 구현합니다. 예:
typescript
export async function GET(request: Request) {}
export async function POST(request: Request) {}

파라미터:
request: NextRequest 객체로, 들어오는 요청에 대한 확장된 제어를 제공합니다.
context: 동적 라우트 파라미터를 포함하는 객체입니다.
동적 라우팅: 폴더 이름에 대괄호를 사용하여 동적 세그먼트를 만들 수 있습니다.
NextResponse: 응답을 커스터마이즈하기 위해 NextResponse 객체를 반환할 수 있습니다.
API 라우트 대체: pages 디렉토리의 API 라우트를 대체하는 기능을 합니다.
route.ts 파일은 Next.js 13.2 버전부터 도입되었으며, 서버 사이드에서 API 엔드포인트를 쉽게 생성하고 관리할 수 있게 해줍니다. 이를 통해 개발자는 더 유연하고 효율적인 방식으로 라우팅 로직을 구현할 수 있습니다.
 * 
 */