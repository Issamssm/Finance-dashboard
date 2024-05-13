import { auth, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    '/',
    '/api(.*)'
]);

export default clerkMiddleware((auth, resquest) => {
    if (isProtectedRoute(resquest)) auth().protect();

    return NextResponse.next()
});

export const config = {
    matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};