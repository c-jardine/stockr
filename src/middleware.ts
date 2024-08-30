export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/materials/(.*)",
    "/products/(.*)",
    "/blueprints/(.*)",
    "/production/(.*)",
    "/history/(.*)",
    "/settings/(.*)",
  ],
};
