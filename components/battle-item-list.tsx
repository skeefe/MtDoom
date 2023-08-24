import BattleItem from "./battle-item";

type Props = {
  battleItemList: {
    Mission: string,
    BattleNotes: string
  }
};

const BattleItemList = ({
  battleItemList
}:
  Props) => {

  //Remove the empty keys.
  Object.keys(battleItemList).forEach(
    (key) => (battleItemList[key] === null || battleItemList[key] === "") && delete battleItemList[key]
  );
  const trimmedBattlItemList = Object.keys(battleItemList);

  return (
    <table>

      {trimmedBattlItemList.map((battleItem, index) => (
        <BattleItem label={battleItem} value={battleItemList[battleItem]} key={index} />
      ))}

    </table>
  );
};

export default BattleItemList;
