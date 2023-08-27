import Container from "../../components/container";
import Layout from "../../components/layout";
import Head from "next/head";
import { useRouter } from 'next/router';
import FormBattleReport from "../../components/form-battle-report";

import React from "react";


const BattleID = () => {
  const router = useRouter()
  const battleID = router.query.id;

  console.log('BattleID: ', battleID);

  return (
    <>
      <Layout>
        <Head>
          <title>{`Battle: ${battleID}`}</title>
        </Head>
        <Container>
          <FormBattleReport battleID={battleID} />
        </Container>
      </Layout>
    </>
  );
};

export default BattleID;

