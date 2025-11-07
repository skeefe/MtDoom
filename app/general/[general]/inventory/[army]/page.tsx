"use client";
import { use, useEffect, useState, ChangeEvent } from 'react';
import { parseXML } from "../../../../../utils/parse-xml";
import getDocSnapshot from "../../../../firebase/getDocSnapshot";
import Spinner from "../../../../components/spinner";
import { selectOption } from "../../../../types/select-option";
import SelectField from "../../../../components/select-field";
import Modal from '../../../../components/modal';
import TextField from "../../../../components/textField";
import CheckboxField from "../../../../components/checkboxField";

import Link from "next/link";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import firebase_app from "../../../../firebase/config";
import { Label } from 'recharts';


export default function Inventory({ params }: { params: Promise<{ general: string; army: string }> }) {

  interface Unit {
    name: string | null;
    points: number | null;
    wargear: string[] | null;
    built: "Completed" | "In Progress" | "Not Started" | null;
    painted: "Completed" | "In Progress" | "Not Started" | null;
    character: boolean | null;
    battleline: boolean | null;
    type: "Vehicle" | "Monster" | "Infantry" | "Mounted" | null;
  }

  //State
  const [xmlData, setXmlData] = useState<any | null>(null);
  const [unitList, setUnitList] = useState<{ name: string | null; id: string | null }[]>([]);
  const [inventory, setInventory] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [showSelectedUnit, setShowSelectedUnit] = useState({ show: false, action: "add" });
  const [totalInventoryPoints, setTotalInventoryPoints] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  /*
  //Configure Firebase
  //const router = useRouter();
  //const db = getFirestore(firebase_app);
  */

  //Required for the Title
  //To update: Avoid returniing everything if I only need a few fields?
  const generalId = use(params).general;
  const armyId = use(params).army;
  const generalDetails = getDocSnapshot("Generals", generalId);
  const armyDetails = getDocSnapshot("Armies", armyId);


  const handleUnitSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const unitName = e.target.options[e.target.selectedIndex].text;    

    //Add the new unit to inventory
    setSelectedUnit({ name: unitName, points: null, wargear: null, built: null, painted: null, character: null, battleline: null, type: null });

    //Reset Editing Index
    setEditingIndex(null);

    //Show the modal
    setShowSelectedUnit({ show: true, action: "add" })

  };

  const handleInventoryItemSave = () => {
    if (!selectedUnit) return;

    if (showSelectedUnit.action === "update" && editingIndex !== null) {
      // Update existing unit
      setInventory(prev => prev.map((unit, i) =>
        i === editingIndex ? selectedUnit : unit
      ));
    } else {
      // Add new unit
      setInventory([...inventory, selectedUnit]);
    }

    // Reset and close
    setShowSelectedUnit({ show: false, action: "" });
    setEditingIndex(null);
  };


  const handleInventoryHide = (e) => {
    e.preventDefault();
    alert("Inventory deletion is not yet implemented.");
    /*
    //Update Firestore
    updateDoc(doc(db, "Armies", armyId), { ["Show"]: false })
      .then(() => {
        console.log("Army hidden.");
      })
      .catch((error) => {
        console.log(error);
      });

    //Redirect back to the Armies list.
    router.push("/armies");
    */
  };

  //Load and parse XML data on component mount
  useEffect(() => {
    const loadXMLData = async () => {
      try {
        const data = await parseXML('/data/army/Imperium - Adeptus Custodes.cat');
        if (data) {
          setXmlData(data);
          console.log('XML Data Loaded:', data);
        } else {
          console.error('No data returned from parseXML.');
        }
      } catch (error) {
        console.error('Error loading XML data:', error);
      }
    };

    loadXMLData();
  }, []);

  //Extract unit list from XML data when xmlData
  useEffect(() => {
    console.log('Current xmlData:', xmlData); // Debugging line
    if (xmlData && xmlData.catalogue?.categoryEntries) {
      const entries = xmlData.catalogue.categoryEntries.categoryEntry;
      const entriesArray = Array.isArray(entries) ? entries : [entries];


      const fetchedUnits = entriesArray
        .filter(entry => entry.hidden === 'false')
        .map(entry => ({
          name: entry.name || null,
          id: entry.targetId || null
        }));

      setUnitList(fetchedUnits);
    }

  }, [xmlData]);

  // Sort units alphabetically by name
  const sortedUnits = [...unitList].sort((a, b) => {
    const nameA = a.name?.toLowerCase() || '';
    const nameB = b.name?.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  });

  // Map sorted units to select options
  let selectOptions: selectOption[] = sortedUnits.map(unit => ({
    Label: unit.name || '',
    Value: unit.id || '',
    Active: true // or set to false based on your logic
  }));
  selectOptions.push({ Label: "- Other Unit -", Value: "", Active: true })

  //List of Unit Type select options
  //Don't store this hear long term.
  const unitTypeOptions: selectOption[] = [{
    Label: "Infantry 💂‍♂️",
    Value: "Infantry",
    Active: true
  }, {
    Label: "Monster 👾",
    Value: "Monster",
    Active: true
  }, {
    Label: "Vehicle 🚜",
    Value: "Vehicle",
    Active: true
  }, {
    Label: "Mounted 🏇",
    Value: "Mounted",
    Active: true
  }, {
    Label: "Other ❓",
    Value: "Other",
    Active: true
  }];

  const unitPaintedOptions: selectOption[] = [{
    Label: "Not Started 🩶",
    Value: "Not Started",
    Active: true
  }, {
    Label: "In Progress 🎨",
    Value: "In Progress",
    Active: true
  }, {
    Label: "Completed 🖼️",
    Value: "Completed",
    Active: true
  }];

  const unitBuiltOptions: selectOption[] = [{
    Label: "Not Started ☢️",
    Value: "Not Started",
    Active: true
  }, {
    Label: "In Progress 🏗️",
    Value: "In Progress",
    Active: true
  }, {
    Label: "Completed 🏨",
    Value: "Completed",
    Active: true
  }];

  //Calculate total points
  useEffect(() => {
    setTotalInventoryPoints(inventory.reduce((accumulator, object) => {
      return +accumulator + +(object.points ?? 0);
    }, 0));
  }, [inventory]);

  //Handle update unit.
  const handleUpdateUnit = (index: number) => {
    setSelectedUnit(inventory[index]); // Load the existing unit data
    setEditingIndex(index); // Track which unit we're editing
    setShowSelectedUnit({ show: true, action: "update" });
  };

  //Handle remove unit.
  const handleRemoveUnit = (index: number) => {
    //Remove from FB - same as update?
    setInventory(prevInventory => prevInventory.filter((_, i) => i !== index));
  };

  const handleSelectedUnitFieldChange = (e) => {
    const name: string = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    console.log('Field changed:', name, value);

    if (selectedUnit && name && value !== undefined) {
      setSelectedUnit((prev) => {
        if (!prev) return null; // Add this null check
        return {
          ...prev,
          [name]: value || null
        } as Unit; // Type assertion to ensure Unit type
      });
    }
  };

  return armyDetails["Name"] ? (
    <>
      <header className="section-header">
        <h1>
          {generalDetails["Emoji"]} {generalDetails["Alias"]}'s {armyDetails["Name"]} {armyDetails["Emoji"]}
        </h1>
        {/*}
        <Link
          href={`/army/${armyId}/edit`}
          className="button section-header-button" 
        >
          Edit
        </Link>
        */}
      </header>


      <section className="section inventory">
        <SelectField
          label="Select a Unit to Add"
          required={true}
          id="selectUnit"
          name="SelectUnit"
          changeFunction={handleUnitSelect}
          value=""
          options={selectOptions}
          emptyValue="Select a Unit"
          randomise={false}
        />
      </section>


      {inventory.length > 0 && (
        <section className="section">
          <header className="section-header">
            <h2>Inventory</h2>
          </header>
          <table className="primary-table ">
            <thead>
              <tr>
                <th>Unit Name</th>
                <th>Points</th>
                <th>Built</th>
                <th>Painted</th>
                <th>Update</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((unit, index) => (
                <tr key={index}>
                  <td>{unit.name}
                    <ul className="inventory-wargear">
                      {Array.isArray(unit.wargear) ? unit.wargear.map((weapon, index) => (
                        <li key={index}>{weapon}</li>
                      )) : null}
                    </ul>
                  </td>
                  <td>{unit.points}</td>
                  <td>{unit.built}</td>
                  <td>{unit.painted}</td>
                  <td>
                    <button onClick={() => handleUpdateUnit(index)}>Update</button>
                  </td>
                  <td>
                    <button onClick={() => handleRemoveUnit(index)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div><h4>Total Points: {totalInventoryPoints}</h4></div>
        </section>
      )}

      <a className="a-delete" type="submit" onClick={(e) => handleInventoryHide(e)}>
        Delete Inventory
      </a>

      {showSelectedUnit.show && (
        <Modal
          onClose={() => setShowSelectedUnit({ show: false, action: "" })}
          title={`Unit: ${selectedUnit?.name}`}
          className="inventory-modal"
        >
          <form>
            <div className="col-2">
              <div>
                <fieldset>
                  <TextField
                    label="Points"
                    type="number"
                    id="points"
                    name="points"
                    value={selectedUnit?.points ?? 0}
                    emptyValue="Enter unit points"
                    required={false}
                    changeFunction={handleSelectedUnitFieldChange}
                  />
                </fieldset>
                <div>WARGEAR</div>
                <div>Options for full customisation - Chip Chip Lumber</div>
                <div>How to handle multi model squads with different wargear- Ask for number of models first, then have a row for each model with a repeating component taking a single wargear each.</div>
              </div>
              <div>
                <fieldset>
                  <SelectField
                    label="Select the Unit Type"
                    id="unitType"
                    name="type"
                    value={selectedUnit?.type ?? ""}
                    options={unitTypeOptions}
                    changeFunction={handleSelectedUnitFieldChange}
                    randomise={false}
                    emptyValue="Select the Unit Type"
                  />
                  <CheckboxField
                    label="Character"
                    id="character"
                    name="character"
                    value={selectedUnit?.character ?? false}
                    required={false}
                    changeFunction={handleSelectedUnitFieldChange}
                  />
                  <CheckboxField
                    label="Battleline"
                    id="battleline"
                    name="battleline"
                    value={selectedUnit?.battleline ?? false}
                    required={false}
                    changeFunction={handleSelectedUnitFieldChange}
                  />
                  <SelectField
                    label="Painted?"
                    id="painted"
                    name="painted"
                    value={selectedUnit?.painted ?? ""}
                    options={unitPaintedOptions}
                    changeFunction={handleSelectedUnitFieldChange}
                    randomise={false}
                    emptyValue="Select the Paint Status"
                  />
                  <SelectField
                    label="Built?"
                    id="built"
                    name="built"
                    value={selectedUnit?.built ?? ""}
                    options={unitBuiltOptions}
                    changeFunction={handleSelectedUnitFieldChange}
                    randomise={false}
                    emptyValue="Select the Build Status"
                  />
                </fieldset>
              </div>
            </div>

          </form>
          <footer>
            <button className="button button-right"
              type="submit" onClick={(id) => handleInventoryItemSave(id)}>Save Unit</button>
          </footer>
        </Modal>
      )}


    </>
  ) : (
    <Spinner />
  );
}

