import Container from "../components/container";
import Layout from "../components/layout";
import Head from "next/head";
import BattleList from "../components/battle-list";
import firebase_app from "./../firebase/config";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useRouter } from 'next/router'

import React from "react";

type Props = {
};

const Index = ({ }: Props) => {
  const router = useRouter();

  async function handleAddBattle() {
    const db = getFirestore(firebase_app)
    const docRef = await addDoc(collection(db, "Battles"), {});
    router.push(`/battle/${docRef.id}`)
  }

  return (
    <>
      <Layout>
        <Head>
          <title>Mt. Doom</title>
        </Head>
        <Container>
          <BattleList />
          <button
            className="mx-auto mt-8 text-2xl"
            type="submit"
            onClick={event => handleAddBattle()}
          >
            Create Battle
          </button>
        </Container>
      </Layout>
    </>
  );
};

export default Index;

