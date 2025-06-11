import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ua = navigator.userAgent.toLowerCase().replace(/^mozilla\/\d\.\d\W/, '')

export interface PlatformInfo {
  os: string | null;
  browser: string | null;
  version: string | null;
}

const mobiles: Record<string, RegExp> = {
  iphone: /iphone/,
  ipad: /ipad|macintosh/,
  android: /android/,
};

const desktops: Record<string, RegExp> = {
  windows: /win/,
  mac: /macintosh/,
  linux: /linux/,
};

export const detectPlatform = (): PlatformInfo => {
  // Determine the operating system
  const mobileOS = Object.keys(mobiles).find(
    (os) => mobiles[os].test(ua) && navigator.maxTouchPoints >= 1
  );
  const desktopOS = Object.keys(desktops).find((os) =>
    desktops[os].test(ua)
  );
  const os = mobileOS || desktopOS || null;

  // Extract browser information
  const browserTest = ua.match(
    /(\w+)\/(\d+\.\d+(?:\.\d+)?(?:\.\d+)?)/g
  );
  const browserOffset =
    browserTest &&
      browserTest.length > 2 &&
      !/^(ver|cri|gec)/.test(browserTest[1])
      ? 1
      : 0;
  const browserResult =
    browserTest &&
    browserTest[browserTest.length - 1 - browserOffset]?.split("/");
  const browser = browserResult?.[0] || null;
  const version = browserResult?.[1] || null;

  return { os, browser, version };
};