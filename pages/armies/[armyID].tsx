import React from "react";
import Container from "../../components/container";
import Layout from "../../components/layout";
import { useRouter } from "next/router";
import ArmyDashboard from "../../components/army-dashboard";

//Resolves a known Next.js bug.
export async function getServerSideProps(context) {
  return {
    props: {},
  };
}

const ArmyID = () => {
  const router = useRouter();
  const armyID = router.query.armyID;

  console.log('armyID:',armyID);

  return (
    <>
      <Layout>
        <Container>
          <ArmyDashboard armyID={armyID} />
        </Container>
      </Layout>
    </>
  );
};

export default ArmyID;
