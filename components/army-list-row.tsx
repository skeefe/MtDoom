import React from 'react';
import { useRouter } from "next/router";

export default function ArmyListRow(army) {

  const router = useRouter();

  function handleRowClick(id) {
    router.push(`/army/${id}`);
  }

  return (
    <>
      <tr
        onClick={() => handleRowClick(army.army.id)}
        className="cursor-pointer"
      >
        <td>{army.Name}</td>  
        <td>{army.Played}</td>       
        <td>{army.Won}</td>        
        <td>{army.Lost}</td>
        <td>{army.PrimaryPointsFor + army.SecondaryPointsFor}</td>
        <td>{army.PrimaryPointsFor + army.SecondaryPointsFor - army.PrimaryPointsAgainst - army.SecondaryPointsAgainst}</td>
      </tr>
    </>
  );
};
