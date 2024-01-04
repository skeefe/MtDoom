import * as React from "react";
import { useWizard } from "react-use-wizard";
import Spinner from "./spinner";
import StepFooter from "./step-footer";

type Props = {
  withCallback?: boolean;
  children: any;
};
/*
const Container = styled("div")`
  background: var(--step);
  border: 1px solid #250b46;
  border-radius: 2px;
  padding: 2.75rem 0.35rem;
  display: flex;
  flex-direction: column;
  min-height: 15vh;
  justify-content: center;
  align-items: center;
`;

const P = styled("p")`
  color: var(--text);
`;
*/

const Step: React.FC<Props> = React.memo(
  ({ children, withCallback = true }) => {
    const { isLoading, handleStep } = useWizard();

    if (withCallback) {
      handleStep(() => {
        alert("Going to next step");
      });
    }

    return (
      <div className="content content-dark">
        {isLoading ? <Spinner /> : children}
        <StepFooter />
      </div>
    );
  }
);

export default Step;
