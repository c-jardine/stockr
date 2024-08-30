import { type NextRouter } from "next/router";

export function isActiveLink(router: NextRouter, href: string) {
  return router.asPath === href || router.pathname.startsWith(href);
}
