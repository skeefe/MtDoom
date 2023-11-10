import React from "react";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";

const BattleList = () => {

  const battleCollection = getCollectionSnapshot('Battles')

  /*

  ## TO DO  
  - Style the "Details" button.
  - Sort how to have a hardcoded store of values to use in Selects.
  - Sort how to remove options from 1 select based on another select (e.g. Attacker and Defender)
  - Loop the turns in a sub component.
  

  ## Future
  - Sort out the col on the right for desktop.
  - Add a "Create Battle" button on home page. Needs to auto start a Doc on click.
  - Favicon
  - Game dashboard stuff! :D 

  */

  function getDetailsLink(id) {
    const link:string = `/battle/${id}`;
    return link;
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
                <th></th>
              </tr>
            </thead>

            <tbody>
              {battleCollection.map((battleItem, index) => (
                
                <tr key={index}>
                  <td>{formatDate(battleItem.Date.seconds)}</td>
                  <td>{battleItem.Mission}{battleItem.PrimaryMission}</td>
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
                  <td><a href={getDetailsLink(battleItem.id)}>Details</a></td>
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
