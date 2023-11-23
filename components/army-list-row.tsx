import React from 'react';
import { useRouter } from "next/router";

export default function ArmyListRow(army) {

  const router = useRouter();

  const primaryPointsFor = isNaN(army.PrimaryPointsFor) ? 0 : army.PrimaryPointsFor;
  const primaryPointsAgainst = isNaN(army.PrimaryPointsAgainst) ? 0 : army.PrimaryPointsAgainst;
  const secondaryPointsFor = isNaN(army.SecondaryPointsFor) ? 0 : army.SecondaryPointsFor;
  const secondaryPointsAgainst = isNaN(army.SecondaryPointsAgainst) ? 0 : army.SecondaryPointsAgainst;
  //const lastFiveRecord = army.Record.slice(Math.max(army.Record.length - 5, 0))

  function handleRowClick(id) {
    router.push(`/armies/${id}`);
  }

  return (
    <>
      <tr
        onClick={() => handleRowClick(army.id)}
        className="cursor-pointer"
      >
        <td>{army.Name}</td>  
        <td className="text-center">{army.Played}</td>       
        <td className="text-center">{army.Won}</td>        
        <td className="text-center">{army.Lost}</td>
        <td className="text-center">{primaryPointsFor + secondaryPointsFor}</td>
        <td className="text-center">{primaryPointsFor + secondaryPointsFor - primaryPointsAgainst - secondaryPointsAgainst}</td>        
        <td className="text-center">{Math.round((army.Won/army.Played)*1000)/10 + "%"}</td>
        {/*
        <td className="text-center">
          {lastFiveRecord.map((record) => record.Result)}
        </td>
        */}
        <td className="text-center">{Math.round((army.FirstTurn/army.Played)*1000)/10 + "%"}</td>
      </tr>
    </>
  );
};
