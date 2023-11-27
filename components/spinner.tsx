import React from "react";

export default function Spinner(visible) {
  console.log(visible);
  return (
    <>
      {visible.visible ? (
        <div className="my-40 text-center text-white text-6xl font-bold">
          Spinner Baby!
        </div>
      ) : null}
      ;
    </>
  );
}
