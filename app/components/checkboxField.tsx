import React from "react";

const CheckboxField = (props: {
  label: string;
  id: string;
  name: string;
  checked: boolean; // Use checked instead of value for checkbox
  required?: boolean;
  changeFunction: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <div className="field-container field-container-checkbox">
      <input
        id={props.id}
        name={props.name}
        type="checkbox"
        checked={props.checked}
        onChange={props.changeFunction}
      />
      <label htmlFor={props.id}>
        {props.required ? "*" : null}
        {props.label}
      </label>
    </div>
  );
};

export default CheckboxField;
