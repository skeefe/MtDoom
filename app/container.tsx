import { ReactNode, FunctionComponent } from "react";

type Props = {
  children: ReactNode;
};

const Container = (props: Props) => {
  return <div className="container">{props.children}</div>;
};

export default Container;
