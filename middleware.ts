import { NextRequest, NextResponse } from "next/server";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { jwtVerify } from "jose";
import { PARTNER, USER } from "./app/context/constants";

const allowedOrigins =
    process.env.NEXT_PUBLIC_LOCAL === "true"
        ? ["http://localhost:3001", "http://localhost:3003"]
        : ["https://admin.alternonft.com", "https://alternonft.com"];

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/partner")) {
        if (!request.cookies.has("jwt")) return NextResponse.redirect(new URL("/account", request.url));
        const jwtToken = request.cookies.get("jwt") as RequestCookie;
        const secret = new TextEncoder().encode(process.env.TOKEN_SECRET as string);
        const decoded = await jwtVerify(jwtToken.value, secret, { typ: "JWT" });

        if (!decoded || !decoded.payload || !decoded.payload.exp || !decoded.payload.role)
            return NextResponse.redirect(new URL("/account", request.url));

        if (new Date() > new Date(decoded.payload.exp * 1000)) return NextResponse.redirect(new URL("/account", request.url));

        if (decoded.payload.role !== PARTNER) {
            return NextResponse.redirect(new URL("/account", request.url));
        }
        return NextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith("/creator")) {
        if (!request.cookies.has("jwt")) return NextResponse.redirect(new URL("/account", request.url));
        const jwtToken = request.cookies.get("jwt") as RequestCookie;
        const secret = new TextEncoder().encode(process.env.TOKEN_SECRET as string);
        const decoded = await jwtVerify(jwtToken.value, secret, { typ: "JWT" });

        if (!decoded || !decoded.payload || !decoded.payload.exp || !decoded.payload.role)
            return NextResponse.redirect(new URL("/account", request.url));

        if (new Date() > new Date(decoded.payload.exp * 1000)) return NextResponse.redirect(new URL("/account", request.url));

        if (decoded.payload.role !== USER) {
            return NextResponse.redirect(new URL("/account", request.url));
        }
        return NextResponse.next();
    }

    // if (request.nextUrl.pathname.startsWith("/api/")) {
    //     console.log(request);
    //     const origin = request.headers.get("origin");
    //     console.log("-----ORIGIN: " + origin);
    //     if (!origin || !allowedOrigins.includes(origin)) {
    //         return new NextResponse(null, {
    //             status: 400,
    //             statusText: "Bad Request",
    //             headers: {
    //                 "Content-Type": "text/plain",
    //             },
    //         });
    //     }
    //     return NextResponse.next();
    // }
}

export const config = {
    matcher: ["/api/:path*", "/partner/:path*", "/creator/:path*"],
};
