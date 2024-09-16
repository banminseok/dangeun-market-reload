import getAccessToken from '@/lib/auth/github/getAccessToken';
import getGithubEmail from '@/lib/auth/github/getGithubEmail';
import getGithubPropfile from '@/lib/auth/github/getGithubProfile';
import db from '@/lib/db';
import getSession from '@/lib/session';
import updateSession from '@/lib/updateSession';
import { notFound, redirect } from 'next/navigation';
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
      return notFound();
    }
    const {error, access_token} = await getAccessToken(code);
    if (error) {
        console.log('400 Error',code)
      return new Response(null, {
        status: 400,
      });
    }
    const email = await getGithubEmail(access_token);
    const { id, name, profile_photo } = await getGithubPropfile(access_token);

    const user = await db.user.findUnique({
        where: {
          github_id: id + "",
        },
        select: {
          id: true,
        },
    });
    if (user) {
      await updateSession(user.id);
      return redirect("/profile");
    }

    //username 중복확인
    const existsUsername = Boolean(
        await db.user.findUnique({
            where: {
            username: name,
            },
            select: {
            id: true,
            },
        })
    );
      const newUser = await db.user.create({
        data: {
          username: existsUsername ? `${name}-git` : name,
          github_id: id + "",
          avatar: profile_photo,
        },
        select: {
          id: true,
        },
      });
      await updateSession(newUser.id);
      return redirect("/profile");
    //return Response.json({ accessTokenData });
}