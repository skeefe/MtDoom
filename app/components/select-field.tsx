import React from "react";
import Spinner from "./spinner";
import { selectOption } from "../types/select-option";

const SelectField = (props: {
  label?: string;
  id: string;
  name: string;
  value: string;
  emptyValue: string;
  options: selectOption[];
  hideEmpty?: boolean;
  noOptionsMessage?: string;
  required?: boolean;
  randomise?: boolean;
  changeFunction: React.ChangeEventHandler<HTMLSelectElement>;
}) => {
  const activeOptions = props.options.filter(o => o.Active);

  async function handleRandomise(selectId) {
    const select = document.getElementById(selectId);
    const selectInputElement = select as HTMLInputElement;

    if (!select || !selectInputElement) {
      console.log("Select field not found.");
      return false;
    }

    selectInputElement.value =
      activeOptions[Math.floor(Math.random() * activeOptions.length)].Value;

    var event = new MouseEvent("change", {
      view: window,
      bubbles: true,
      cancelable: false,
    });
    select.dispatchEvent(event);
    return;
  }

  return (
    <>
      <div className="field-container">
        {props.label && (
          <label htmlFor={props.id}>
            {props.label}
            {props.required ? "*" : null}:
          </label>
        )}
        {activeOptions.length > 0 ? (
          <select
            id={props.id}
            name={props.name}
            onChange={props.changeFunction}
            value={props.value}
          >
            {!props.hideEmpty && (
              <option value="">-- {props.emptyValue} --</option>
            )}
            {activeOptions.map((option, index) => (
              <option value={option.Value} key={index}>
                {option.Label}
              </option>
            ))}
          </select>
        ) : (
          <span className="alert">{props.noOptionsMessage}</span>
        )}
        {props.randomise ? (
          <button
            className="button button-randomise"
            type="button"
            onClick={(event) => handleRandomise(props.id)}
          >
            🎲
          </button>
        ) : null}
      </div>
    </>
  );
};

export default SelectField;