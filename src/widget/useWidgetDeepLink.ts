import { useEffect } from "react";
import { useNavigate } from "react-router";

import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

import { widgetDeepLinkPath } from "./widgetDeepLink.ts";

export const useWidgetDeepLink = (): void => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }
    const open = (url: string) => {
      const path = widgetDeepLinkPath(url);
      if (path) {
        void navigate(path);
      }
    };
    App.getLaunchUrl()
      .then((launch) => {
        if (launch) {
          open(launch.url);
        }
      })
      .catch((cause) => {
        console.error("Failed to read the launch URL", cause);
      });
    const handle = App.addListener("appUrlOpen", ({ url }) => open(url));
    return () => {
      void handle.then((listener) => listener.remove());
    };
  }, [navigate]);
};
