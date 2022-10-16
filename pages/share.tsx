import Head from "next/head";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";
import WebappApiService from "../services/WebappApiService";
import PersistenceService from "../services/PersistenceService";
import { nanoid } from "nanoid";

export default function Share() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!router.isReady) return;
    const listId = router.query["id"] as string;
    console.log(listId);
    (async () => {
      const list = await WebappApiService.getSharedList(listId);
      console.log("Loading shared list:", list);
      list.id = nanoid(8);
      list.key = nanoid();
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
        <meta name="title" content="Share List Title" />
        <meta name="description" content="Share List Description" />
      </Head>
    </>
  );
}
