import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
    const clientId = process.env.GITHUB_CLIENT_ID;

    const redirectUrl =
        `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user&redirect_uri=http://localhost:3000/api/auth/github/callback`

    return NextResponse.redirect(redirectUrl);

    // res.redirect(redirectUrl)
}
