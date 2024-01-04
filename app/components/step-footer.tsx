"use client";

import React, { useEffect } from "react";
import { useWizard } from "react-use-wizard";

/*
export const Actions = styled('div')`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  gap: 1rem;
  flex-direction: row;
`;

export const Info = styled('div')`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 0;

  & > p {
    margin: 0.25rem 0;
  }

  @media screen and (min-width: 768px) {
    flex-direction: row;
    gap: 1rem;

    & > p {
      margin: initial;
    }
  }
`;
*/

const StepFooter: React.FC = () => {
  const {
    nextStep,
    previousStep,
    isLoading,
    activeStep,
    stepCount,
    isLastStep,
    isFirstStep,
  } = useWizard();

  useEffect(() => {
    const keyDownHandler = (e) => {
      if (e.keyCode === 39) {
        nextStep();
      } else if (e.keyCode === 37) {
        previousStep();
      }
    };
    document.addEventListener("keydown", keyDownHandler);

    // clean up
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  return (
    <>
      <div className="step-nav">
        <div>
          {!isLoading && !isFirstStep && (
            <button
              type="button"
              onClick={() => previousStep()}
              className="button button-secondary"
            >
              Previous
            </button>
          )}
        </div>
        <div>
          {!isLoading && !isLastStep && (
            <button type="button" onClick={() => nextStep()} className="button">
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default StepFooter;
