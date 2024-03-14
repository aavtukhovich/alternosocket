import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET(request: NextRequest) {
    const tag = request.nextUrl.searchParams.get("tag") || "/";
    const origin = request.headers.get("origin");
    revalidateTag(tag);
    const result = { revalidated: true, now: Date.now() };
    return new NextResponse(JSON.stringify(result), {
        headers: {
            "Access-Control-Allow-Origin": origin || "null",
            "Content-Type": "application/json",
        },
    });
}
