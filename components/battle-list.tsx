import React, { useState } from "react";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import { formatDate } from "../utils/date-format";
import { useRouter } from "next/router";
import Spinner from "./spinner";

const BattleList = () => {
  const router = useRouter();
  const battleCollection = getCollectionSnapshot("Battles");

  const [loading, setLoading] = useState(false);

  function handleRowClick(id) {
    router.push(`/battle/${id}`);
  }

  return (
    <>
      <Spinner visible={loading} />
      <div className="lg:flex gap-x-12">
        <section id="battleList" className="lg:flex-1">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-8">
            Battle List
          </h1>

          <table className="battles-list">
            <thead>
              <tr>
                <th>Date</th>
                <th>Mission</th>
                <th>Attacker</th>
                <th>Defender</th>
              </tr>
            </thead>

            <tbody>
              {battleCollection.map((battleItem, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(battleItem.id)}
                  className="cursor-pointer"
                >
                  <td>{formatDate(battleItem.Date.seconds)}</td>
                  <td>
                    <strong>{battleItem.PrimaryMission}</strong>
                    <span>Mission Rule: {battleItem.MissionRule}</span>
                    <span>Deployment: {battleItem.Deployment}</span>
                  </td>
                  <td>
                    <strong>
                      {battleItem.AttackerArmy}
                      {battleItem.Victor === battleItem.Attacker ? " 🎖" : null}
                    </strong>
                    <span>General: {battleItem.Attacker}</span>
                    <span>Total: {battleItem.TotalAttacker}</span>
                  </td>
                  <td>
                    <strong>
                      {battleItem.DefenderArmy}
                      {battleItem.Victor === battleItem.Defender ? " 🎖" : null}
                    </strong>
                    <span>General: {battleItem.Defender}</span>
                    <span>Total: {battleItem.TotalDefender}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
};

export default BattleList;
