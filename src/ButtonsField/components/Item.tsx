import * as React from "react";
import { Button } from "reactstrap";

export type ItemProps = React.PropsWithChildren<{
  [key: string]: any;
}>;

const Item: React.FC<ItemProps> = ({ children, ...rest }) => {
  return <Button {...rest}>{children}</Button>;
};

export default Item;
