import React from "react";
import getCollectionSnapshot from "../firebase/getCollectionSnapshot";

const BattleList = () => {

  const battleCollection = getCollectionSnapshot('Battles')

  /*

  ## TO DO
  - Setup buttons to go to the Battle details page.
  - Populate details page with FB data.
  - Style the "Details" button.
  - Sort how to have a hardcoded store of values to use in Selects.
  - Sort how to remove options from 1 select based on another select (e.g. Attacker and Defender)
  - Sort out the Doc ID.
  - 

  ## Future
  - Look at https://firefoo.app/
    - Sort how to deal with changed field names.
      - https://stackoverflow.com/questions/57003980/is-it-possible-to-rename-fields-in-firestore-collection ?
  - Sort out the col on the right for desktop.
  - Remove the Submit button - push on change.
  - Add a "Create Battle" button on home page. Needs to auto start a Doc on click.
  - Favicon
  - Auth?
  - Style based on Victory.
  - Game dashboard stuff! :D 

  */

  function getDetailsLink(id) {
    const link:string = `/battle/${id}`;
    return link;
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
                  <td>{battleItem.Date}</td>
                  <td>{battleItem.Mission}{battleItem.PrimaryMission}</td>
                  <td>
                    <strong>{battleItem.Attacker}</strong>
                    <span>Army: {battleItem.AttackerArmy}</span>
                    <span>Total: {battleItem.TotalAttacker}</span>
                  </td>
                  <td>
                    <strong>{battleItem.Defender}</strong>
                    <span>Army: {battleItem.DefenderArmy}</span>
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
