import { auth } from "@/auth";

export { auth as middleware };

export const config = {
  matcher: ["/dashboard/:path*", "/projects/:path*", "/workspace/:path*"],
};
