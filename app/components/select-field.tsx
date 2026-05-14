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
  async function handleRandomise(selectId) {
    const select = document.getElementById(selectId);
    const selectInputElement = select as HTMLInputElement;

    if (!select || !selectInputElement) {
      console.log("Select field not found.");
      return false;
    }

    //Randomly select.
    selectInputElement.value =
      props.options[Math.floor(Math.random() * props.options.length)].Value;

    //Trigger onChange event.
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
        {props.options.length > 0 ? (
          <select
            id={props.id}
            name={props.name}
            onChange={props.changeFunction}
            value={props.value}
          >

            {!props.hideEmpty && (
              <option value="">-- {props.emptyValue} --</option>
            )}
            {props.options.map((option, index) => (
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
