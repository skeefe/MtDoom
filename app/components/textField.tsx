import React from "react";
import Spinner from "./spinner";
import { selectOption } from "../types/select-option";

const TextField = (props: {
  label: string;
  type: string;
  id: string;
  name: string;
  value: string;
  emptyValue: string;
  required?: boolean;
  changeFunction: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <>
      <div className="field-container">
        <label htmlFor={props.id}>
          {props.label}
          {props.required ? "*" : null}:
        </label>
        <input
          id={props.id}
          name={props.name}
          placeholder={props.emptyValue}
          type={props.type}
          onChange={props.changeFunction}
          value={props.value}
        />
      </div>
    </>
  );
};

export default TextField;
