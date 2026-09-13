import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

import { widgetDeepLinkPath } from "./widgetDeepLink.ts";

export const useWidgetDeepLink = (): void => {
  const navigate = useNavigate();
  const launchUrlRead = useRef(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }
    const open = (url: string) => {
      const path = widgetDeepLinkPath(url);
      if (path) {
        void navigate(path, { replace: true });
      }
    };
    if (!launchUrlRead.current) {
      launchUrlRead.current = true;
      App.getLaunchUrl()
        .then((launch) => {
          if (launch) {
            open(launch.url);
          }
        })
        .catch((cause) => {
          console.error("Failed to read the launch URL", cause);
        });
    }
    const handle = App.addListener("appUrlOpen", ({ url }) => open(url));
    return () => {
      void handle.then((listener) => listener.remove());
    };
  }, [navigate]);
};
