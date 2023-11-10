import React from "react";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import { useRouter } from "next/router";

const BattleList = () => {
  const router = useRouter();
  const battleCollection = getCollectionSnapshot("Battles");

  function handleRowClick(id) {
    router.push(`/battle/${id}`);
  }

  function formatDate(timeStamp) {
    const date:Date = new Date(timeStamp*1000);
    const formattedDate:string = `${date.toLocaleDateString()}`;
    return formattedDate;
  }

  return (
    <>
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
                  <td>{battleItem.Date}</td>
                  <td>
                    {battleItem.Mission}
                    {battleItem.PrimaryMission}
                  </td>
                  <td>
                    <strong>{battleItem.AttackerArmy}{battleItem.Victor === battleItem.Attacker ? " 🎖" : null}</strong>
                    <span>General: {battleItem.Attacker}</span>
                    <span>Total: {battleItem.TotalAttacker}</span>
                  </td>
                  <td>
                    <strong>{battleItem.DefenderArmy}{battleItem.Victor === battleItem.Defender ? " 🎖" : null}</strong>
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
