import React, { useState, useEffect } from "react";
import Container from "./container"
import BattleItemList from "../components/battle-item-list";

const FormBattleReport = () => {

  const [report, setReport] = useState({
    Date:getDate(),
    Mission: "",
    BattleNotes: "",
    Size:"3000pt",
    T1Primary: 0,
    T2Primary: 0,
    TotalPoints: 0,
  });

  useEffect(() => {
    calculateTotal();
  }, [report.T1Primary, report.T2Primary]);


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
    const total: number = report.T1Primary + report.T2Primary;

    setReport((prev) => {
      return { ...prev, ['TotalPoints']: total }
    },)
  }

  function getDate(){
      const date = new Date();
      return date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();
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

            <fieldset>
              <legend>Setup</legend>

              <div className="sm:flex mb-3">
                <label
                  className="w-28 py-2 pr-2 block sm:inline-block"
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

              <div className="sm:flex mb-3">
                <label
                  className="w-28 py-2 pr-2 block sm:inline-block"
                  htmlFor="Size"
                >
                  Battle Size:
                </label>
                <select id="size"
                  name="Size"
                  className="border p-2 w-full"
                  onChange={handleChange}
                  required
                >
                  <option>1000pts</option>
                  <option>1500pts</option>
                  <option>2000pts</option>
                  <option selected>3000pts</option>
                </select>
              </div>

              <div className="sm:flex mb-3">
                <label
                  className="w-28 py-2 pr-2 block sm:inline-block"
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
            </fieldset>

            <fieldset>
              <legend>Turn 1</legend>
              <div className="sm:flex mb-3">
                <label
                  className="w-28 py-2 pr-2 block sm:inline-block"
                  htmlFor="T1Primary"
                >
                  Primary Points:
                </label>
                <input
                  id="primary"
                  name="T1Primary"
                  placeholder="Primary Points"
                  type="number"
                  className="border p-2 w-full"
                  onChange={event => handleChange(event, true)}
                  min="0"
                  max="15"
                  required
                />
              </div>

            </fieldset>
            <fieldset>
              <legend>Turn 2</legend>
              <div className="sm:flex mb-3">
                <label
                  className="w-28 py-2 pr-2 block sm:inline-block"
                  htmlFor="T2Primary"
                >
                  Points:
                </label>
                <input
                  id="primary"
                  name="T2Primary"
                  placeholder="Primary Points"
                  type="number"
                  className="border p-2 w-full"
                  onChange={event => handleChange(event, true)}
                  min="0"
                  max="15"
                  required
                />
              </div>
            </fieldset>
            <fieldset>
              <legend>Post Game</legend>
              <div className="sm:flex mb-3">
                <label
                  className="w-28 py-2 pr-2 block sm:inline-block"
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
            {/* 
                        <button
                          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                          type="submit"
                        >
                          Save Report
                        </button>
                      */}
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
