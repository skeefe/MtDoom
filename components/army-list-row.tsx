import React from 'react';
import { useRouter } from "next/router";

export default function ArmyListRow(army) {

  const router = useRouter();

  const primaryPointsFor = isNaN(army.PrimaryPointsFor) ? 0 : army.PrimaryPointsFor;
  const primaryPointsAgainst = isNaN(army.PrimaryPointsAgainst) ? 0 : army.PrimaryPointsAgainst;
  const secondaryPointsFor = isNaN(army.SecondaryPointsFor) ? 0 : army.SecondaryPointsFor;
  const secondaryPointsAgainst = isNaN(army.SecondaryPointsAgainst) ? 0 : army.SecondaryPointsAgainst; 

  function handleRowClick(id) {
    router.push(`/army/${id}`);
  }

  return (
    <>
      <tr
        onClick={() => handleRowClick(army.id)}
        className="cursor-pointer"
      >
        <td>{army.Name}</td>  
        <td>{army.Played}</td>       
        <td>{army.Won}</td>        
        <td>{army.Lost}</td>
        <td>{primaryPointsFor + secondaryPointsFor}</td>
        <td>{primaryPointsFor + secondaryPointsFor - primaryPointsAgainst - secondaryPointsAgainst}</td>        
        <td>{(army.Won/army.Played)*100 + "%"}</td>
        <td>{army.Record}</td>
      </tr>
    </>
  );
};
