import Container from "../../components/container";
import Layout from "../../components/layout";
import { useRouter } from "next/router";
import FormBattleReport from "../../components/form-battle-report";

import React from "react";

//Resolves a known Next.js bug.
export async function getServerSideProps(context) {
  return {
    props: {},
  };
}

const BattleID = () => {
  const router = useRouter();
  const armyID = router.query.armyID;

  return (
    <>
      <Layout>
        <Container>
          <h1>{armyID}</h1>
        </Container>
      </Layout>
    </>
  );
};

export default BattleID;
