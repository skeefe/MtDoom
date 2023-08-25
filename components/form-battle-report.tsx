import React, { useState, useEffect } from "react";
import Container from "./container"
import BattleItemList from "../components/battle-item-list";


const FormBattleReport = () => {

  const [report, setReport] = useState({
    Date: getDate(),
    Mission: "",
    Attacker: "",
    AttackerArmy: "",
    Defender: "",
    DefenderArmy: "",
    FirstTurn: "",
    Size: "3000pt",
    T1AttackerPrimary: 0,
    T1AttackerSecondary1Title: "",
    T1AttackerSecondary1: 0,
    T1AttackerSecondary2Title: "",
    T1AttackerSecondary2: 0,
    T1DefenderPrimary: 0,
    T1DefenderSecondary1Title: "",
    T1DefenderSecondary1: 0,
    T1DefenderSecondary2Title: "",
    T1DefenderSecondary2: 0,
    T2AttackerPrimary: 0,
    T2AttackerSecondary1Title: "",
    T2AttackerSecondary1: 0,
    T2AttackerSecondary2Title: "",
    T2AttackerSecondary2: 0,
    T2DefenderPrimary: 0,
    T2DefenderSecondary1Title: "",
    T2DefenderSecondary1: 0,
    T2DefenderSecondary2Title: "",
    T2DefenderSecondary2: 0,
    T3AttackerPrimary: 0,
    T3AttackerSecondary1Title: "",
    T3AttackerSecondary1: 0,
    T3AttackerSecondary2Title: "",
    T3AttackerSecondary2: 0,
    T3DefenderPrimary: 0,
    T3DefenderSecondary1Title: "",
    T3DefenderSecondary1: 0,
    T3DefenderSecondary2Title: "",
    T3DefenderSecondary2: 0,
    T4AttackerPrimary: 0,
    T4AttackerSecondary1Title: "",
    T4AttackerSecondary1: 0,
    T4AttackerSecondary2Title: "",
    T4AttackerSecondary2: 0,
    T4DefenderPrimary: 0,
    T4DefenderSecondary1Title: "",
    T4DefenderSecondary1: 0,
    T4DefenderSecondary2Title: "",
    T4DefenderSecondary2: 0,
    T5AttackerPrimary: 0,
    T5AttackerSecondary1Title: "",
    T5AttackerSecondary1: 0,
    T5AttackerSecondary2Title: "",
    T5AttackerSecondary2: 0,
    T5DefenderPrimary: 0,
    T5DefenderSecondary1Title: "",
    T5DefenderSecondary1: 0,
    T5DefenderSecondary2Title: "",
    T5DefenderSecondary2: 0,
    Victor: "",
    VictoryType: "",
    TurnEnded: 0,
    AttackerMVP: "",
    DefenderMVP: "",
    BattleNotes: "",
    TotalAttacker: 0,
    TotalDefender: 0,
  });

  useEffect(() => {
    calculateTotal();
  }, [
    report.T1AttackerPrimary,
    report.T1AttackerSecondary1,
    report.T1AttackerSecondary2,
    report.T1DefenderPrimary,
    report.T1DefenderSecondary1,
    report.T1DefenderSecondary2,
    report.T2AttackerPrimary,
    report.T2AttackerSecondary1,
    report.T2AttackerSecondary2,
    report.T2DefenderPrimary,
    report.T2DefenderSecondary1,
    report.T2DefenderSecondary2,
    report.T3AttackerPrimary,
    report.T3AttackerSecondary1,
    report.T3AttackerSecondary2,
    report.T3DefenderPrimary,
    report.T3DefenderSecondary1,
    report.T3DefenderSecondary2,
    report.T4AttackerPrimary,
    report.T4AttackerSecondary1,
    report.T4AttackerSecondary2,
    report.T4DefenderPrimary,
    report.T4DefenderSecondary1,
    report.T4DefenderSecondary2,
    report.T5AttackerPrimary,
    report.T5AttackerSecondary1,
    report.T5AttackerSecondary2,
    report.T5DefenderPrimary,
    report.T5DefenderSecondary1,
    report.T5DefenderSecondary2
  ]);


  function handleChange(e, calculate: boolean = false) {
    const name = e.target.name;
    let value = e.target.value;

    if (calculate) {
      value = parseFloat(e.target.value);
      if (isNaN(value)) {
        value = 0;
      }
    }

    setReport((prev) => {
      return { ...prev, [name]: value }
    })
  }


  function calculateTotal() {
    //Add all of the relevant fields.
    const TotalAttacker: number = (
      report.T1AttackerPrimary +
      report.T1AttackerSecondary1 +
      report.T1AttackerSecondary2 +
      report.T2AttackerPrimary +
      report.T2AttackerSecondary1 +
      report.T2AttackerSecondary2 +
      report.T3AttackerPrimary +
      report.T3AttackerSecondary1 +
      report.T3AttackerSecondary2 +
      report.T4AttackerPrimary +
      report.T4AttackerSecondary1 +
      report.T4AttackerSecondary2 +
      report.T5AttackerPrimary +
      report.T5AttackerSecondary1 +
      report.T5AttackerSecondary2
    );

    const TotalDefender: number = (
      report.T1DefenderPrimary +
      report.T1DefenderSecondary1 +
      report.T1DefenderSecondary2 +
      report.T2DefenderPrimary +
      report.T2DefenderSecondary1 +
      report.T2DefenderSecondary2 +
      report.T3DefenderPrimary +
      report.T3DefenderSecondary1 +
      report.T3DefenderSecondary2 +
      report.T4DefenderPrimary +
      report.T4DefenderSecondary1 +
      report.T4DefenderSecondary2 +
      report.T5DefenderPrimary +
      report.T5DefenderSecondary1 +
      report.T5DefenderSecondary2
    );

    setReport((prev) => {
      return { ...prev, ['TotalAttacker']: TotalAttacker, ['TotalDefender']: TotalDefender }
    },)
  }

  function getDate() {
    const date = new Date();
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

  function handleSubmit(e) {
    console.log('here');
    setReport((prev) => {
      return { ...prev, FormSubmit: true }
    })
    e.preventDefault();
  }

  return (
    <div className="lg:flex gap-x-12">
      <section id="calculator" className="lg:flex-1">
        <div className="content">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-8">
            Battle Report
          </h1>
          <form
          //action=""
          //method="POST"
          >

            {/* SETUP */}
            <fieldset>
              <legend>Setup</legend>

              <div className="mb-3">
                <label
                  htmlFor="date"
                >
                  Date:
                </label>
                <input
                  id="date"
                  name="Date"
                  placeholder="Enter the date."
                  type="text"
                  value={report.Date}
                  className="border p-2 w-full"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="Size"
                >
                  Battle Size:
                </label>
                <select id="size"
                  name="Size"
                  className="border p-2 w-full"
                  onChange={handleChange}
                  required
                  defaultValue="3000pts"
                >
                  <option>1000pts</option>
                  <option>1500pts</option>
                  <option>2000pts</option>
                  <option>3000pts</option>
                </select>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="mission"
                >
                  Mission:
                </label>
                <input
                  id="mission"
                  name="Mission"
                  placeholder="Enter the mission."
                  type="text"
                  className="border p-2 w-full"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="Attacker"
                >
                  Attacker:
                </label>
                <select id="attacker"
                  name="Attacker"
                  className="border p-2 w-full"
                  onChange={handleChange}
                  placeholder="Select the Attacker"
                  required
                >
                  <option value="">-- Select the Attacker --</option>
                  <option>JSmooth</option>
                  <option>Spoonz</option>
                  <option>Sir Sibot</option>
                </select>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="AttackerArmy"
                >
                  Attacker Army:
                </label>
                <select id="attackerArmy"
                  name="AttackerArmy"
                  className="border p-2 w-full"
                  onChange={handleChange}
                  placeholder="Select the Attacker Army"
                  required
                >
                  <option value="">-- Select the Attacker Army --</option>
                  <option>Astra Militarum</option>
                  <option>Space Wolves</option>
                  <option>Ultramarines</option>
                  <option>Craftworld</option>
                  <option>Filthy Blood Angels</option>
                  <option>Cold Blooded</option>
                  <option>Tau</option>
                  <option>Bastiladons</option>
                  <option>Rusty Jeckyls</option>
                  <option>Orks</option>
                  <option>Necrons</option>
                  <option>Imperial Knights</option>
                  <option>Deathwatch</option>
                  <option>Dark Angels</option>
                  <option>Custodes</option>
                  <option>Ad Mech</option>
                  <option>Bridgeburners</option>
                </select>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="Defender"
                >
                  Defender:
                </label>
                <select id="defender"
                  name="Defender"
                  className="border p-2 w-full"
                  onChange={handleChange}
                  placeholder="Select the Defender"
                  required
                >
                  <option value="">-- Select the Defender --</option>
                  <option>JSmooth</option>
                  <option>Spoonz</option>
                  <option>Sir Sibot</option>
                </select>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="DefenderArmy"
                >
                  Defender Army:
                </label>
                <select id="defenderArmy"
                  name="DefenderArmy"
                  className="border p-2 w-full"
                  onChange={handleChange}
                  placeholder="Select the Defender"
                  required
                >
                  <option value="">-- Select the Defender Army --</option>
                  <option>Astra Militarum</option>
                  <option>Space Wolves</option>
                  <option>Ultramarines</option>
                  <option>Craftworld</option>
                  <option>Filthy Blood Angels</option>
                  <option>Cold Blooded</option>
                  <option>Tau</option>
                  <option>Bastiladons</option>
                  <option>Rusty Jeckyls</option>
                  <option>Orks</option>
                  <option>Necrons</option>
                  <option>Imperial Knights</option>
                  <option>Deathwatch</option>
                  <option>Dark Angels</option>
                  <option>Custodes</option>
                  <option>Ad Mech</option>
                  <option>Bridgeburners</option>
                </select>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="firstTurn"
                >
                  First Turn:
                </label>
                <select id="firstTurn"
                  name="FirstTurn"
                  className="border p-2 w-full"
                  onChange={handleChange}
                  placeholder="Select the Player"
                  required
                >
                  <option value="">-- Select the Player --</option>
                  <option>JSmooth</option>
                  <option>Spoonz</option>
                  <option>Sir Sibot</option>
                </select>
              </div>
            </fieldset>

            {/* TURN 1 */}
            <fieldset>
              <legend>Turn 1</legend>
              <div className="player">
                <div className="mb-3">
                  <label
                    htmlFor="T1AttackerPrimary"
                  >
                    Attacker Primary Points:
                  </label>
                  <input
                    id="t1AttackerPrimary"
                    name="T1AttackerPrimary"
                    placeholder="Attacker Primary Points"
                    type="number"
                    className="border p-2 w-full"
                    onChange={event => handleChange(event, true)}
                    min="0"
                    max="15"
                    required
                  />
                </div>

                <div className="secondaries">
                  <div className="secondary">
                    <div className="mb-3">
                      <label
                        htmlFor="T1AttackerSecondary1Title"
                      >
                        Attacker Secondary 1 Title:
                      </label>
                      <input
                        id="t1AttackerSecondary1Title"
                        name="T1AttackerSecondary1Title"
                        placeholder="Attacker Secondary 1 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T1AttackerSecondary1"
                      >
                        Attacker Secondary 1 Score:
                      </label>
                      <input
                        id="t1AttackerSecondary1"
                        name="T1AttackerSecondary1"
                        placeholder="Attacker Secondary 1 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T1AttackerSecondary2Title"
                      >
                        Attacker Secondary 2 Title:
                      </label>
                      <input
                        id="t1AttackerSecondary2Title"
                        name="T1AttackerSecondary2Title"
                        placeholder="Attacker Secondary 2 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T1AttackerSecondary2"
                      >
                        Attacker Secondary 2 Score:
                      </label>
                      <input
                        id="t1AttackerSecondary2"
                        name="T1AttackerSecondary2"
                        placeholder="Attacker Secondary 2 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="player">
                <div className="mb-3">
                  <label
                    htmlFor="T1DefenderPrimary"
                  >
                    Defender Primary Points:
                  </label>
                  <input
                    id="t1DefenderPrimary"
                    name="T1DefenderPrimary"
                    placeholder="Defender Primary Points"
                    type="number"
                    className="border p-2 w-full"
                    onChange={event => handleChange(event, true)}
                    min="0"
                    max="15"
                    required
                  />
                </div>

                <div className="secondaries">
                  <div className="secondary">
                    <div className="mb-3">
                      <label
                        htmlFor="T1DefenderSecondary1Title"
                      >
                        Defender Secondary 1 Title:
                      </label>
                      <input
                        id="t1DefenderSecondary1Title"
                        name="T1DefenderSecondary1Title"
                        placeholder="Defender Secondary 1 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T1DefenderSecondary1"
                      >
                        Defender Secondary 1 Score:
                      </label>
                      <input
                        id="t1DefenderSecondary1"
                        name="T1DefenderSecondary1"
                        placeholder="Defender Secondary 1 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T1DefenderSecondary2Title"
                      >
                        Defender Secondary 2 Title:
                      </label>
                      <input
                        id="t1DefenderSecondary2Title"
                        name="T1DefenderSecondary2Title"
                        placeholder="Defender Secondary 2 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T1DefenderSecondary2"
                      >
                        Defender Secondary 2 Score:
                      </label>
                      <input
                        id="t1DefenderSecondary2"
                        name="T1DefenderSecondary2"
                        placeholder="Defender Secondary 2 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            
            {/* TURN 2 */}
            <fieldset>
              <legend>Turn 2</legend>
              <div className="player">
                <div className="mb-3">
                  <label
                    htmlFor="T2AttackerPrimary"
                  >
                    Attacker Primary Points:
                  </label>
                  <input
                    id="t2AttackerPrimary"
                    name="T2AttackerPrimary"
                    placeholder="Attacker Primary Points"
                    type="number"
                    className="border p-2 w-full"
                    onChange={event => handleChange(event, true)}
                    min="0"
                    max="15"
                    required
                  />
                </div>

                <div className="secondaries">
                  <div className="secondary">
                    <div className="mb-3">
                      <label
                        htmlFor="T2AttackerSecondary1Title"
                      >
                        Attacker Secondary 1 Title:
                      </label>
                      <input
                        id="t2AttackerSecondary1Title"
                        name="T2AttackerSecondary1Title"
                        placeholder="Attacker Secondary 1 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T2AttackerSecondary1"
                      >
                        Attacker Secondary 1 Score:
                      </label>
                      <input
                        id="t2AttackerSecondary1"
                        name="T2AttackerSecondary1"
                        placeholder="Attacker Secondary 1 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T2AttackerSecondary2Title"
                      >
                        Attacker Secondary 2 Title:
                      </label>
                      <input
                        id="t2AttackerSecondary2Title"
                        name="T2AttackerSecondary2Title"
                        placeholder="Attacker Secondary 2 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T2AttackerSecondary2"
                      >
                        Attacker Secondary 2 Score:
                      </label>
                      <input
                        id="t2AttackerSecondary2"
                        name="T2AttackerSecondary2"
                        placeholder="Attacker Secondary 2 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="player">
                <div className="mb-3">
                  <label
                    htmlFor="T2DefenderPrimary"
                  >
                    Defender Primary Points:
                  </label>
                  <input
                    id="t2DefenderPrimary"
                    name="T2DefenderPrimary"
                    placeholder="Defender Primary Points"
                    type="number"
                    className="border p-2 w-full"
                    onChange={event => handleChange(event, true)}
                    min="0"
                    max="15"
                    required
                  />
                </div>

                <div className="secondaries">
                  <div className="secondary">
                    <div className="mb-3">
                      <label
                        htmlFor="T2DefenderSecondary1Title"
                      >
                        Defender Secondary 1 Title:
                      </label>
                      <input
                        id="t2DefenderSecondary1Title"
                        name="T2DefenderSecondary1Title"
                        placeholder="Defender Secondary 1 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T2DefenderSecondary1"
                      >
                        Defender Secondary 1 Score:
                      </label>
                      <input
                        id="t2DefenderSecondary1"
                        name="T2DefenderSecondary1"
                        placeholder="Defender Secondary 1 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T2DefenderSecondary2Title"
                      >
                        Defender Secondary 2 Title:
                      </label>
                      <input
                        id="t2DefenderSecondary2Title"
                        name="T2DefenderSecondary2Title"
                        placeholder="Defender Secondary 2 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T2DefenderSecondary2"
                      >
                        Defender Secondary 2 Score:
                      </label>
                      <input
                        id="t2DefenderSecondary2"
                        name="T2DefenderSecondary2"
                        placeholder="Defender Secondary 2 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* TURN 3 */}
            <fieldset>
              <legend>Turn 3</legend>
              <div className="player">
                <div className="mb-3">
                  <label
                    htmlFor="T3AttackerPrimary"
                  >
                    Attacker Primary Points:
                  </label>
                  <input
                    id="t3AttackerPrimary"
                    name="T3AttackerPrimary"
                    placeholder="Attacker Primary Points"
                    type="number"
                    className="border p-2 w-full"
                    onChange={event => handleChange(event, true)}
                    min="0"
                    max="15"
                    required
                  />
                </div>

                <div className="secondaries">
                  <div className="secondary">
                    <div className="mb-3">
                      <label
                        htmlFor="T3AttackerSecondary1Title"
                      >
                        Attacker Secondary 1 Title:
                      </label>
                      <input
                        id="t3AttackerSecondary1Title"
                        name="T3AttackerSecondary1Title"
                        placeholder="Attacker Secondary 1 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T3AttackerSecondary1"
                      >
                        Attacker Secondary 1 Score:
                      </label>
                      <input
                        id="t3AttackerSecondary1"
                        name="T3AttackerSecondary1"
                        placeholder="Attacker Secondary 1 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T3AttackerSecondary2Title"
                      >
                        Attacker Secondary 2 Title:
                      </label>
                      <input
                        id="t3AttackerSecondary2Title"
                        name="T3AttackerSecondary2Title"
                        placeholder="Attacker Secondary 2 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T3AttackerSecondary2"
                      >
                        Attacker Secondary 2 Score:
                      </label>
                      <input
                        id="t3AttackerSecondary2"
                        name="T3AttackerSecondary2"
                        placeholder="Attacker Secondary 2 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="player">
                <div className="mb-3">
                  <label
                    htmlFor="T3DefenderPrimary"
                  >
                    Defender Primary Points:
                  </label>
                  <input
                    id="primary"
                    name="T3DefenderPrimary"
                    placeholder="Defender Primary Points"
                    type="number"
                    className="border p-2 w-full"
                    onChange={event => handleChange(event, true)}
                    min="0"
                    max="15"
                    required
                  />
                </div>

                <div className="secondaries">
                  <div className="secondary">
                    <div className="mb-3">
                      <label
                        htmlFor="T3DefenderSecondary1Title"
                      >
                        Defender Secondary 1 Title:
                      </label>
                      <input
                        id="t3DefenderSecondary1Title"
                        name="T3DefenderSecondary1Title"
                        placeholder="Defender Secondary 1 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T3DefenderSecondary1"
                      >
                        Defender Secondary 1 Score:
                      </label>
                      <input
                        id="t3DefenderSecondary1"
                        name="T3DefenderSecondary1"
                        placeholder="Defender Secondary 1 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T3DefenderSecondary2Title"
                      >
                        Defender Secondary 2 Title:
                      </label>
                      <input
                        id="t3DefenderSecondary2Title"
                        name="T3DefenderSecondary2Title"
                        placeholder="Defender Secondary 2 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T3DefenderSecondary2"
                      >
                        Defender Secondary 2 Score:
                      </label>
                      <input
                        id="t3DefenderSecondary2"
                        name="T3DefenderSecondary2"
                        placeholder="Defender Secondary 2 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            
            {/* TURN 4 */}
            <fieldset>
              <legend>Turn 4</legend>
              <div className="player">
                <div className="mb-3">
                  <label
                    htmlFor="T4AttackerPrimary"
                  >
                    Attacker Primary Points:
                  </label>
                  <input
                    id="primary"
                    name="T4AttackerPrimary"
                    placeholder="Attacker Primary Points"
                    type="number"
                    className="border p-2 w-full"
                    onChange={event => handleChange(event, true)}
                    min="0"
                    max="15"
                    required
                  />
                </div>

                <div className="secondaries">
                  <div className="secondary">
                    <div className="mb-3">
                      <label
                        htmlFor="T4AttackerSecondary1Title"
                      >
                        Attacker Secondary 1 Title:
                      </label>
                      <input
                        id="t4AttackerSecondary1Title"
                        name="T4AttackerSecondary1Title"
                        placeholder="Attacker Secondary 1 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T4AttackerSecondary1"
                      >
                        Attacker Secondary 1 Score:
                      </label>
                      <input
                        id="t4AttackerSecondary1"
                        name="T4AttackerSecondary1"
                        placeholder="Attacker Secondary 1 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T4AttackerSecondary2Title"
                      >
                        Attacker Secondary 2 Title:
                      </label>
                      <input
                        id="t4AttackerSecondary2Title"
                        name="T4AttackerSecondary2Title"
                        placeholder="Attacker Secondary 2 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T4AttackerSecondary2"
                      >
                        Attacker Secondary 2 Score:
                      </label>
                      <input
                        id="t4AttackerSecondary2"
                        name="T4AttackerSecondary2"
                        placeholder="Attacker Secondary 2 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="player">
                <div className="mb-3">
                  <label
                    htmlFor="T4DefenderPrimary"
                  >
                    Defender Primary Points:
                  </label>
                  <input
                    id="primary"
                    name="T4DefenderPrimary"
                    placeholder="Defender Primary Points"
                    type="number"
                    className="border p-2 w-full"
                    onChange={event => handleChange(event, true)}
                    min="0"
                    max="15"
                    required
                  />
                </div>

                <div className="secondaries">
                  <div className="secondary">
                    <div className="mb-3">
                      <label
                        htmlFor="T4DefenderSecondary1Title"
                      >
                        Defender Secondary 1 Title:
                      </label>
                      <input
                        id="t4DefenderSecondary1Title"
                        name="T4DefenderSecondary1Title"
                        placeholder="Defender Secondary 1 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T4DefenderSecondary1"
                      >
                        Defender Secondary 1 Score:
                      </label>
                      <input
                        id="t4DefenderSecondary1"
                        name="T4DefenderSecondary1"
                        placeholder="Defender Secondary 1 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T4DefenderSecondary2Title"
                      >
                        Defender Secondary 2 Title:
                      </label>
                      <input
                        id="t4DefenderSecondary2Title"
                        name="T4DefenderSecondary2Title"
                        placeholder="Defender Secondary 2 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T4DefenderSecondary2"
                      >
                        Defender Secondary 2 Score:
                      </label>
                      <input
                        id="t4DefenderSecondary2"
                        name="T4DefenderSecondary2"
                        placeholder="Defender Secondary 2 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* TURN 5 */}
            <fieldset>
              <legend>Turn 5</legend>
              <div className="player">
                <div className="mb-3">
                  <label
                    htmlFor="T5AttackerPrimary"
                  >
                    Attacker Primary Points:
                  </label>
                  <input
                    id="t5AttackerPrimary"
                    name="T5AttackerPrimary"
                    placeholder="Attacker Primary Points"
                    type="number"
                    className="border p-2 w-full"
                    onChange={event => handleChange(event, true)}
                    min="0"
                    max="15"
                    required
                  />
                </div>

                <div className="secondaries">
                  <div className="secondary">
                    <div className="mb-3">
                      <label
                        htmlFor="T5AttackerSecondary1Title"
                      >
                        Attacker Secondary 1 Title:
                      </label>
                      <input
                        id="t5AttackerSecondary1Title"
                        name="T5AttackerSecondary1Title"
                        placeholder="Attacker Secondary 1 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T5AttackerSecondary1"
                      >
                        Attacker Secondary 1 Score:
                      </label>
                      <input
                        id="t5AttackerSecondary1"
                        name="T5AttackerSecondary1"
                        placeholder="Attacker Secondary 1 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T5AttackerSecondary2Title"
                      >
                        Attacker Secondary 2 Title:
                      </label>
                      <input
                        id="t5AttackerSecondary2Title"
                        name="T5AttackerSecondary2Title"
                        placeholder="Attacker Secondary 2 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T5AttackerSecondary2"
                      >
                        Attacker Secondary 2 Score:
                      </label>
                      <input
                        id="t5AttackerSecondary2"
                        name="T5AttackerSecondary2"
                        placeholder="Attacker Secondary 2 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="player">
                <div className="mb-3">
                  <label
                    htmlFor="T5DefenderPrimary"
                  >
                    Defender Primary Points:
                  </label>
                  <input
                    id="primary"
                    name="T5DefenderPrimary"
                    placeholder="Defender Primary Points"
                    type="number"
                    className="border p-2 w-full"
                    onChange={event => handleChange(event, true)}
                    min="0"
                    max="15"
                    required
                  />
                </div>

                <div className="secondaries">
                  <div className="secondary">
                    <div className="mb-3">
                      <label
                        htmlFor="T5DefenderSecondary1Title"
                      >
                        Defender Secondary 1 Title:
                      </label>
                      <input
                        id="t5DefenderSecondary1Title"
                        name="T5DefenderSecondary1Title"
                        placeholder="Defender Secondary 1 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T5DefenderSecondary1"
                      >
                        Defender Secondary 1 Score:
                      </label>
                      <input
                        id="t5DefenderSecondary1"
                        name="T5DefenderSecondary1"
                        placeholder="Defender Secondary 1 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T5DefenderSecondary2Title"
                      >
                        Defender Secondary 2 Title:
                      </label>
                      <input
                        id="t5DefenderSecondary2Title"
                        name="T5DefenderSecondary2Title"
                        placeholder="Defender Secondary 2 Title"
                        type="text"
                        className="border p-2 w-full"
                        onChange={handleChange}
                        min="0"
                        max="15"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="T5DefenderSecondary2"
                      >
                        Defender Secondary 2 Score:
                      </label>
                      <input
                        id="t5DefenderSecondary2"
                        name="T5DefenderSecondary2"
                        placeholder="Defender Secondary 2 Score"
                        type="number"
                        className="border p-2 w-full"
                        onChange={event => handleChange(event, true)}
                        min="0"
                        max="15"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>


            

            {/* POST GAME */}
            <fieldset>
              <legend>Post Game</legend>
              <div className="mb-3">
                <label
                  htmlFor="Victor"
                >
                  Victor:
                </label>
                <select id="victor"
                  name="Victor"
                  className="border p-2 w-full"
                  onChange={handleChange}
                  placeholder="Select the Victor"
                  required
                >
                  <option value="">-- Select the Victor --</option>
                  <option>JSmooth</option>
                  <option>Spoonz</option>
                  <option>Sir Sibot</option>
                </select>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="VictoryType"
                >
                  Victory Type:
                </label>
                <select id="victoryType"
                  name="VictoryType"
                  className="border p-2 w-full"
                  onChange={handleChange}
                  placeholder="Select the Victory Type"
                  required
                >
                  <option value="">-- Select the Victory Type --</option>
                  <option>Points Victory</option>
                  <option>Points Draw</option>
                  <option>Tabling</option>
                  <option>Crushing Victory</option>
                </select>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="TurnEnded"
                >
                  Turn Ended:
                </label>
                <select id="turnEnded"
                  name="TurnEnded"
                  className="border p-2 w-full"
                  onChange={handleChange}
                  placeholder="Select the Turn"
                  required
                >
                  <option value="">-- Select the Turn --</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="AttackerMVP"
                >
                  Attacker MVP:
                </label>
                <input
                  id="attackerMVP"
                  name="AttackerMVP"
                  placeholder="Attacker MVP"
                  type="text"
                  className="border p-2 w-full"
                  onChange={event => handleChange(event)}
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="DefenderMVP"
                >
                  Defender MVP:
                </label>
                <input
                  id="defenderMVP"
                  name="DefenderMVP"
                  placeholder="Attacker MVP"
                  type="text"
                  className="border p-2 w-full"
                  onChange={event => handleChange(event)}
                  required
                />
              </div>


              <div className="mb-3">
                <label
                  htmlFor="notes"
                >
                  Battle Notes:
                </label>
                <textarea
                  id="notes"
                  name="BatteNotes"
                  placeholder="Battle Notes"
                  className="border p-2  w-full"
                  onChange={event => handleChange(event)}
                  required
                ></textarea>
              </div>

            </fieldset>

            <button
              className="mx-auto text-2xl"
              type="submit"
              onClick={event => handleSubmit(event)}
            >
              Save Report
            </button>
          </form>
        </div>
      </section>

      <section id="results" className="lg:w-96 lg:flex-none">
        <h2>Results</h2>
        <BattleItemList battleItemList={report} />
      </section>
    </div>

  );
};

export default FormBattleReport;
