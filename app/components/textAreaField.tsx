import React from "react";

const TextAreaField = (props: {
  label: string|null;
  id: string;
  name: string;
  value: string;
  emptyValue: string;
  required?: boolean;
  changeFunction: React.ChangeEventHandler<HTMLTextAreaElement>;
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
        <textarea
          id={props.id}
          name={props.name}
          placeholder={props.emptyValue}
          onChange={props.changeFunction}
          value={props.value}
        />
      </div>
    </>
  );
};

export default TextAreaField;
