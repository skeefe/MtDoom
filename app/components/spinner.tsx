import React from "react";

const Spinner = (props: { size?: string }) => {
  return (
    <>
      <div className={`spinner-container spinner-size-${props.size}`}>
        <div className="loading-spinner"></div>
      </div>
    </>
  );
};

export default Spinner;
