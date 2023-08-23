type Props = {
  label: string;
  value: string;
};

const BattleItem = ({
  label,
  value
}: 
Props) => {
  return (
    <tbody>
      <tr>
        <th>{label}:</th>
        <td>{value}</td>
      </tr>
    </tbody>
  );
};

export default BattleItem;
