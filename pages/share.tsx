import Head from "next/head";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import WebappApiService from "../services/WebappApiService";
import PersistenceService from "../services/PersistenceService";
import { nanoid } from "nanoid";

function Share({ list }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const title = list?.name;
  const description = `${list?.name} ${list?.points}pts`;

  useEffect(() => {
    console.log("Loading shared list:", list);
    
    PersistenceService.loadFromShare(dispatch, list, () => {
      router.push("/list");
    });
  }, []);

  return (
    <>
      <Head>
        <title>OPR Army Forge</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={description} />
      </Head>
    </>
  );
}

Share.getInitialProps = async (ctx) => {
  try {
    const listId = ctx.query["id"];
    const list = await WebappApiService.getSharedList(listId);
    list.id = nanoid(8);
    list.key = nanoid();
    return { list };
  } catch (e) {
    return { list: null };
  }
};

export default Share;
