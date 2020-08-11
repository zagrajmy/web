import { Children, ComponentPropsWithoutRef } from "react";
import { ThemeUICSSProperties, ThemeUIStyleObject } from "theme-ui";
import { FunctionKeys } from "utility-types";

type OmitFunctions<T extends object> = Omit<T, FunctionKeys<T>>;

export interface StackProps
  extends OmitFunctions<ComponentPropsWithoutRef<"div">> {
  as?: "div" | "section" | "article" | "ol" | "ul" | "fieldset";
  row?: boolean;
  justify?: ThemeUICSSProperties["alignItems"];
  align?: ThemeUICSSProperties["alignItems"];
  gap?: number | [number, number?, number?, number?];
  // use whenever children are heterogenous
  wrapChildren?: boolean;
}
export const Stack = ({
  as: Root = "div",
  gap = 0,
  row: isRow,
  children,
  justify: justifyContent,
  align: alignItems,
  wrapChildren,
  sx,
  ...rest
}: StackProps) => {
  const marginOrientation = isRow ? "marginInlineStart" : "marginBlockStart";

  const childMargin: ThemeUIStyleObject = {
    [marginOrientation]: gap,
  };

  const containerStyle: ThemeUIStyleObject = {
    display: "flex",
    flexDirection: isRow ? "row" : "column",
    justifyContent,
    alignItems,
  };

  if (wrapChildren) {
    return (
      <Root sx={{ ...containerStyle, ...sx }} {...rest}>
        {Children.map(children, (child, i) => (
          <div key={i} sx={i === 0 ? {} : childMargin}>
            {child}
          </div>
        ))}
      </Root>
    );
  }

  return (
    <Root
      sx={{
        ...containerStyle,
        "& > *:not(:first-of-type)": childMargin,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Root>
  );
};
