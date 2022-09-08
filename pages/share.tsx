import Head from "next/head";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../data/store";
import { useMediaQuery } from "react-responsive";
import MobileView from "../views/listBuilder/MobileView";
import DesktopView from "../views/listBuilder/DesktopView";
import { useLoadFromQuery } from "../hooks/useLoadFromQuery";
import { useRouter } from "next/router";
import WebappApiService from "../services/WebappApiService";
import PersistenceService from "../services/PersistenceService";

export default function Share() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!router.isReady) return;
    const listId = router.query["id"] as string;
    console.log(listId);
    (async () => {
      const list = await WebappApiService.getSharedList(listId);
      PersistenceService.loadFromShare(dispatch, list, () => {
        router.push("/list");
      });
    })();
  }, [router.query]);

  // Break from mobile to desktop layout at 1024px wide
  const isBigScreen = useMediaQuery({ query: "(min-width: 1024px)" });

  return (
    <>
      <Head>
        <title>OPR Army Forge</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}
