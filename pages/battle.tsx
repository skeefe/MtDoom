import Container from "../components/container";
import Layout from "../components/layout";
import Head from "next/head";
import FormBattleReport from "../components/form-battle-report";

import React from "react";

type Props = {
};

const Battle = ({ }: Props) => {

  return (
    <>
      <Layout>
        <Head>
          <title>Mt. Doom: Battle</title>
        </Head>
        <Container>
          <FormBattleReport />
        </Container>
      </Layout>
    </>
  );
};

export default Battle;

