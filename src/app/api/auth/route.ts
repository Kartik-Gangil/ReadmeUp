import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    // console.log({ token })
    if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

    return NextResponse.json({ authenticated: true }, { status: 200 });
}
