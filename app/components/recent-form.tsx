
import getDocSnapshot from "../firebase/getDocSnapshot";
import { iBattle } from "../types/battle";
import { formatDate } from "../../utils/date-format";


const RecentForm = (props: {
    Item: string;
    Type: "Armies" | "Generals";
    Battles: iBattle[];
}) => {

    const sortedBattles = [...props.Battles].sort((a, b) => a.Date.seconds - b.Date.seconds);

    const getGeneralAlias = (id: string) => getDocSnapshot("Generals", id)["Alias"];
    const getArmyName = (id: string) => getDocSnapshot("Armies", id)["Name"];

    const getBattleDetails = (battle: iBattle) => {
        // 1. Determine if the current subject is the Attacker
        const isAttacker = props.Type === "Generals"
            ? battle.Attacker === props.Item
            : battle.AttackerArmy === props.Item;

        // 2. Determine the Result (W/L/D)
        let result = "D";

        // Only run Win/Loss logic if there isn't a Draw
        if (battle.Victor && battle.Victor !== "DRAW") {
            if (props.Type === "Generals") {
                // Simple match for General
                result = battle.Victor === props.Item ? "W" : "L";
            } else {
                // For Army: Check if the winning General was leading THIS army
                const winningArmyId = battle.Victor === battle.Attacker
                    ? battle.AttackerArmy
                    : battle.DefenderArmy;

                result = winningArmyId === props.Item ? "W" : "L";
            }
        } else {
            // If battle.Victor is "DRAW" or doesn't exist, it stays "D"
            result = "D";
        }
        
        // 3. Get Opponent Info for the Tooltip
        const opponentGeneralId = isAttacker ? battle.Defender : battle.Attacker;
        const opponentArmyId = isAttacker ? battle.DefenderArmy : battle.AttackerArmy;

        const myScore = isAttacker ? battle.TotalAttacker : battle.TotalDefender;
        const oppScore = isAttacker ? battle.TotalDefender : battle.TotalAttacker;
        const date = formatDate(battle.Date.seconds).short;

        return {
            result,
            hoverText: `${myScore} - ${oppScore} vs ${getGeneralAlias(opponentGeneralId)} (${getArmyName(opponentArmyId)}) - ${date}`,
        };
    };
    return (
        <div className="recent-form">
            <h3>Battle Record</h3>
            <span className="instruction">Oldest to Newest</span>
            <div className="form-pips">
                {sortedBattles.map((battle, index) => {
                    const details = getBattleDetails(battle);
                    return (
                        <div
                            key={index}
                            className={`form-pip pip-${details.result}`}
                            title={details.hoverText}
                        >
                            {details.result}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentForm;