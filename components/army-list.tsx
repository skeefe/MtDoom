import React from "react";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";
import ArmyListRow from "./army-list-row";

const ArmyList = () => {
  const armyCollection = getCollectionSnapshot("Armies", "Name", "asc");
  const activeArmyCollection = armyCollection.filter((obj) =>
    Object.keys(obj).includes("Played")
  );

  return (
    <>
      <div className="lg:flex gap-x-12">
        <section id="armyList" className="lg:flex-1">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-8">
            Armies
          </h1>

          <table className="armys-list w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th className="text-center">Played</th>
                <th className="text-center">Won</th>
                <th className="text-center">Lost</th>
                <th className="text-center">Avg. Points</th>
                <th className="text-center">Total Points</th>
                <th className="text-center">Points +/-</th>
                <th className="text-center">Win %</th>
                {/* <th className='text-center'>Last 5</th> */}
                <th className="text-center">First Turn %</th>
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
