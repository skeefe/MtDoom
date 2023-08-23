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

      {trimmedBattlItemList.map((battleItem) => (
        <BattleItem label={battleItem} value={battleItemList[battleItem]} />
      ))}

    </table>
  );
};

export default BattleItemList;
