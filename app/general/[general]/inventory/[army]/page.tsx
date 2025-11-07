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
import { unitBuiltOptions } from '../../../../../data/unit-built-options';
import { unitPaintOptions } from '../../../../../data/unit-paint-options';
import { unitTypes } from '../../../../../data/unit-types';

/*
import Link from "next/link";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import firebase_app from "../../../../firebase/config";
import { Label } from 'recharts';
*/


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

  /*
  //To add: Hide Inventory from user. Keep in Firebase.
  const handleInventoryHide = (e) => {
    e.preventDefault();

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
  };
  */

  // Load and parse XML data on component mount
  // To Do:
    // - Do not hardode to Custodes
    // - Decide if we keep using the XML Data files... more effort than they are worth? Maybe just get the data separately.
    // Split out XML data retrieve to Util?
  useEffect(() => {
    const loadXMLData = async () => {
      try {
        const data = await parseXML('/data/army/Imperium - Adeptus Custodes.cat');
        if (data) {
          setXmlData(data);
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
  // To Do - as above.
  useEffect(() => {
    //console.log('Current xmlData:', xmlData); // Debugging line
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

  // Sort XML units alphabetically by name
  const sortedUnits = [...unitList].sort((a, b) => {
    const nameA = a.name?.toLowerCase() || '';
    const nameB = b.name?.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  });

  // Map sorted units to Select options
  let selectOptions: selectOption[] = sortedUnits.map(unit => ({
    Label: unit.name || '',
    Value: unit.id || '',
    Active: true // or set to false based on your logic
  }));
  selectOptions.push({ Label: "- Other Unit -", Value: "", Active: true })


  // Required for the Title
  // To update: Avoid returniing everything if I only need a few fields?
  const generalId = use(params).general;
  const armyId = use(params).army;
  const generalDetails = getDocSnapshot("Generals", generalId);
  const armyDetails = getDocSnapshot("Armies", armyId);

  //Triggered after Unit selected from the dropdown.
  const handleUnitSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const unitName = e.target.options[e.target.selectedIndex].text;    

    //Add the new unit to inventory
    setSelectedUnit({ name: unitName, points: null, wargear: null, built: null, painted: null, character: null, battleline: null, type: null });

    //Reset Editing Index
    setEditingIndex(null);

    //Show the modal
    setShowSelectedUnit({ show: true, action: "add" })

  };

  //Triggered when unit saved - either Updates or Adds.
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

  //To Do: UI
  return armyDetails["Name"] ? (
    <>
      <header className="section-header">
        <h1>
          {generalDetails["Emoji"]} {generalDetails["Alias"]}'s {armyDetails["Name"]} {armyDetails["Emoji"]}
        </h1>
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

      {/*
        To Do:
          - Break up by unit type?
          - Emoji's for built and painted cols?
          - Change buttons for Update and Delete
          - Add tfoot with totals.
          - Remove leading zero in Points Col
          - Painted and Built should be per model, not per unit (but maybe calculated for the unit)
      */}

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

      {/*
      <a className="a-delete" type="submit" onClick={(e) => handleInventoryHide(e)}>
        Delete Inventory
      </a>
      */}

      {/*
        - UI...
        - Hanlde 1-Many model units
        - Add "Legends" checkbox
        - Paint/Built status should be per model
        - Add custom Names, notes, etc...
      */}
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
                    options={unitTypes}
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
                    options={unitPaintOptions}
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
              type="submit" onClick={(id) => handleInventoryItemSave()}>Save Unit</button>
          </footer>
        </Modal>
      )}


    </>
  ) : (
    <Spinner />
  );
}

