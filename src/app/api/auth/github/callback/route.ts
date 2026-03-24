
import jwt from "jsonwebtoken";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/user";
import { connectToServer } from "@/lib/connection";

const redirectURL = process.env.redirectURL! || 'http://localhost:5173/main';

export async function GET(req: NextRequest) {
    connectToServer()
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code');

    const response = await axios.post("https://github.com/login/oauth/access_token", {
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code: code
    }, {
        headers: {
            Accept: "application/json"
        }
    })

    const accessToken = response.data.access_token;
    // console.log(accessToken)
    // get user data

    const user = await axios.get("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    const githubUser = user.data;


    //  mongodb user cred saving
    const existingUser = await User.findOne({ Github_Uname: githubUser.login });

    if (existingUser) {
        console.log("User already exists!");
    }
    else {
        const newUser = await User.create({
            Id: githubUser.id,
            Photo: githubUser.avatar_url,
            name: githubUser.name,
            Github_Uname: githubUser.login,
            Email: githubUser.email
        });
    }



    const token = jwt.sign(
        {
            id: githubUser.id,
            username: githubUser.login,
            avatar: githubUser.avatar_url,
            githubAccessToken: accessToken
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    );


    const nextResponse = NextResponse.redirect(new URL(redirectURL))
    nextResponse.cookies.set('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 3600000
    })

    return nextResponse;

}