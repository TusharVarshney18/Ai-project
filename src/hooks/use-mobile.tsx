import { useEffect, useMemo, useState } from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

type DeviceType = "mobile" | "tablet" | "desktop";

interface DeviceInfo {
  width: number;
  height: number;

  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  isPortrait: boolean;
  isLandscape: boolean;

  isTouchDevice: boolean;

  device: DeviceType;
}

export function useDevice(): DeviceInfo {
  const getDeviceInfo = (): DeviceInfo => {
    if (typeof window === "undefined") {
      return {
        width: 0,
        height: 0,

        isMobile: false,
        isTablet: false,
        isDesktop: true,

        isPortrait: true,
        isLandscape: false,

        isTouchDevice: false,

        device: "desktop",
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    const isMobile = width < MOBILE_BREAKPOINT;

    const isTablet =
      width >= MOBILE_BREAKPOINT &&
      width < TABLET_BREAKPOINT;

    const isDesktop = width >= TABLET_BREAKPOINT;

    const isPortrait = height >= width;

    const isLandscape = width > height;

    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    const device: DeviceType = isMobile
      ? "mobile"
      : isTablet
      ? "tablet"
      : "desktop";

    return {
      width,
      height,

      isMobile,
      isTablet,
      isDesktop,

      isPortrait,
      isLandscape,

      isTouchDevice,

      device,
    };
  };

  const [deviceInfo, setDeviceInfo] =
    useState<DeviceInfo>(getDeviceInfo);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const updateDevice = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setDeviceInfo(getDeviceInfo());
      }, 100);
    };

    updateDevice();

    window.addEventListener("resize", updateDevice);
    window.addEventListener("orientationchange", updateDevice);

    return () => {
      clearTimeout(timeout);

      window.removeEventListener("resize", updateDevice);
      window.removeEventListener(
        "orientationchange",
        updateDevice
      );
    };
  }, []);

  return useMemo(() => deviceInfo, [deviceInfo]);
}