import React from "react";

const CheckboxField = (props: {
  label: string;
  id: string;
  name: string;
  value: any;
  required?: boolean;
  changeFunction: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <>
      <div className="field-container field-container-checkbox">
        <input
          id={props.id}
          name={props.name}
          type="checkbox"
          onChange={props.changeFunction}
          value={props.value}
        />
        <label htmlFor={props.id}>          
          {props.required ? "*" : null}
          {props.label}
        </label>
      </div>
    </>
  );
};

export default CheckboxField;
