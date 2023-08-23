import Container from "../components/container";
import Layout from "../components/layout";
import Head from "next/head";
import BattleItemList from "../components/battle-item-list";

import React, { useState } from "react";

type Props = {
};

const Index = ({ }: Props) => {

  const [report, setReport] = useState({
    Mission: "",
    BattleNotes: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setReport((prev) => {
      return { ...prev, [name]: value }
    })

  }

  return (
    <>
      <Layout>
        <Head>
          <title>Mt. Doom</title>
        </Head>
        <Container>
          <div>
            <div>

              <section id="calculator">
                <div className="content">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold md:pr-8">
                      Battle Card
                    </h2>
                    <form
                    //action=""
                    //method="POST"
                    >

                      <fieldset>
                        <div className="sm:flex mb-3">
                          <label
                            className="w-28 py-2 pr-2 block sm:inline-block"
                            htmlFor="mission"
                          >
                            Mission:
                          </label>
                          <input
                            id="mission"
                            name="Mission"
                            placeholder="Enter the mission."
                            type="text"
                            className="border p-2 w-full"
                            onChange={handleChange}
                            required
                          />
                        </div>


                        <div className="sm:flex mb-3">
                          <label
                            className="w-28 py-2 pr-2 block sm:inline-block"
                            htmlFor="notes"
                          >
                            Battle Notes:
                          </label>
                          <textarea
                            id="notes"
                            name="BatteNotes"
                            placeholder="Battle Notes"
                            className="border p-2  w-full"
                            onChange={handleChange}
                            required
                          ></textarea>
                        </div>

                        <div className="text-right">
                          <button
                            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                            type="submit"
                          >
                            Save Report
                          </button>
                        </div>
                      </fieldset>
                    </form>
                    <div>
                      <h2>Results</h2>
                      <BattleItemList battleItemList={report} />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </Layout>
    </>
  );
};

export default Index;

