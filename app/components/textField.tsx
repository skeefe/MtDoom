import React from "react";

const TextField = (props: {
  label: string|null;
  type: string;
  id: string;
  name: string;
  value: any;
  emptyValue: string;
  required?: boolean;
  changeFunction: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <>
      <div className="field-container">
        {props.label !== null && (
        <label htmlFor={props.id}>
          {props.label}
          {props.required ? "*" : null}:
        </label>
        )}
        <input
          id={props.id}
          name={props.name}
          placeholder={props.emptyValue}
          type={props.type}
          onChange={props.changeFunction}
          //Required to stop number fields changing on scroll.
          onWheel={(event) => event.currentTarget.blur()}
          value={props.value}
        />
      </div>
    </>
  );
};

export default TextField;
