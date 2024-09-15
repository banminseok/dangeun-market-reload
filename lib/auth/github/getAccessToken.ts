
export default async function getAccessToken(code:string) {
  let accessTokenURL = "https://github.com/login/oauth/access_token";

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code: code,
  }).toString();

  accessTokenURL = `${accessTokenURL}?${params}`;

  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const {error, access_token} = await accessTokenResponse.json();
  console.log(error)
  return { error, access_token };
};
