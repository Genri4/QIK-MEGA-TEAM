"use client";

import { useEffect } from "react";

import { useUserStore } from "@state";
import { getAuthorizedUser } from "@entities";
import { useFetcher } from "@shared";

export const GetUserAuthorizedUser = () => {
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  const getAuthorizedUserRequest = useFetcher(getAuthorizedUser);
  useEffect(() => {
    getAuthorizedUserRequest.execute({ method: "GET" }).then((result) => {
      if (result && result?.user) {
        console.log(result?.user);
        setUser(result.user);
      } else {
        clearUser();
      }
    });
  }, []);

  return null;
};
