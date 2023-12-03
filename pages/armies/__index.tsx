import Container from "../../components/container";
import Layout from "../../components/layout";
import Head from "next/head";
import ArmyList from "../../components/army-list";
import firebase_app from "../../firebase/config";
import { getFirestore, updateDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/router";

import React from "react";

type Props = {};

const Index = ({ }: Props) => {
    return (
        <>
            <Layout>
                <Head>
                    <title>Mt. Doom: Armies</title>
                </Head>
                <Container>
                    <ArmyList />
                </Container>
            </Layout>
        </>
    );
};

export default Index;
