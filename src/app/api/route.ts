import { generateReadme } from "@/lib/generateReadme";
import { rateLimit } from "@/lib/rateLimit";
import { verifyJWT } from "@/lib/verifyJWT";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

    const { error, status, user } = verifyJWT(req)

    if (error) {
        const response = NextResponse.json({ message: error }, { status })
        response.cookies.delete('token')  // ✅ also clear expired cookie
        return response
    }


    const rateLimiter = await rateLimit(req);

    if (!rateLimiter.success) return NextResponse.json({ error: 'Too many request' }, { status: 429 });

    const { url, branch } = await req.json();
    const githubToken = (user as any).githubAccessToken;

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    try {

        const stream = new TransformStream()
        const writer = stream.writable.getWriter()
        const encoder = new TextEncoder()

        // ⚡ Do NOT await — return the stream immediately and pipe into it in background
        generateReadme(url, branch, githubToken, {
            write: async (chunk: string) => {
                await writer.write(encoder.encode(chunk))
            },
            end: async () => {
                await writer.close()
            }
        });

        return new NextResponse(stream.readable, {
            headers: {
                'Content-Type': 'text/plain',
                'Transfer-Encoding': 'chunked',
            }

        })
    } catch (e: any) {
        return NextResponse.json({ error: 'Error generating readme ' + e.message }, { status: 500 })
    }

}

