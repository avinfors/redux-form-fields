import * as React from "react";
import { Tooltip, TooltipProps as ReactstrapTooltipProps } from "reactstrap";

import styles from "./styles.module.scss";

export type ErrorTooltipProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement> & {
    alwaysHidden?: boolean;
    [key: string]: any;
    error: any;
    target?: ReactstrapTooltipProps["target"];
  }
>;

const ErrorTooltip: React.FC<ErrorTooltipProps> = ({
  alwaysHidden,
  error,
  target,
  children,
  ...rest
}) => {
  const [hoverState, setHoverState] = React.useState(false);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ref = React.useRef<HTMLDivElement>(null!);

  const mouseEnterHandler = () => setHoverState(true);

  const mouseLeaveHandler = () => setHoverState(false);

  return (
    <div
      {...rest}
      ref={ref}
      tabIndex={-1}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      onTouchStart={mouseEnterHandler}
      onBlur={mouseLeaveHandler}
    >
      {children}
      <Tooltip
        fade={false}
        innerClassName={styles.inner}
        isOpen={!alwaysHidden && hoverState && !!error}
        modifiers={{ computeStyle: { x: "top" } }}
        placement="top"
        target={target || ref}
      >
        {error}
      </Tooltip>
    </div>
  );
};

export default ErrorTooltip;
