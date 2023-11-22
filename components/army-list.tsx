import React from "react";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import ArmyListRow from "./army-list-row";


const ArmyList = () => {
  const armyCollection = getCollectionSnapshot("Armies", "Name", "asc");
  const activeArmyCollection = armyCollection.filter(obj => Object.keys(obj).includes("Played"));

  return (
    <>
      <div className="lg:flex gap-x-12">
        <section id="armyList" className="lg:flex-1">

          <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-8">
            Army List - Under Construction
          </h1>

          <table className="armys-list w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Played</th>
                <th>Won</th>
                <th>Lost</th>
                <th>Total Points</th>
                <th>Points +/-</th>
                <th>Win %</th>
                <th>Last 5</th>
              </tr>
            </thead>
            <tbody>
              {activeArmyCollection.map((armyItem, index) => (
                <ArmyListRow {...armyItem} key={index} />
              ))}
            </tbody>
          </table>

        </section>
      </div>
    </>
  );
};

export default ArmyList;