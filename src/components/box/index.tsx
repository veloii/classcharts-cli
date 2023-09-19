import {
  DOMElement,
  Box as InkBox,
  BoxProps as InkBoxProps,
  useFocus,
} from "ink";
import React, { useMemo, useState } from "react";
import useDimensions from "../../hooks/use-dimensions.js";
import Scrollable, { ScrollableProps } from "./scrollable.js";
import Selectable, { SelectableProps } from "./selectable.js";

const WrapperContext = React.createContext({
  props: {} as Partial<InkBoxProps>,
  setProps: (_props: Partial<InkBoxProps>) => {},
});

export const useParentProps = () => React.useContext(WrapperContext);

export type BoxProps = InkBoxProps & {
  showFocusBorders?: boolean;
  isFocused?: boolean;
  scrollable?: boolean;
  children?: React.ReactNode;
  rowsOffset?: number;
  selectable?: {
    onSelect?: (index: number) => void;
    onHighlight?: (index: number) => void;
    selectedProps?: any;
  };
};

const Box = React.forwardRef<DOMElement, BoxProps>(
  (
    {
      isFocused: isFocusedProp,
      rowsOffset,
      children,
      showFocusBorders: focusable,
      scrollable,
      selectable,
      ...props
    },
    refProp
  ) => {
    const [addtionalProps, setAdditionalProps] = useState<Partial<InkBoxProps>>(
      {}
    );

    const isFocused =
      focusable && isFocusedProp === undefined
        ? useFocus().isFocused
        : isFocusedProp;

    const rows = scrollable ? useDimensions()[1] + (rowsOffset || 0) : 0;

    const wrappers = useMemo(
      () => [
        {
          component: Selectable,
          props: {
            isFocused,
            onSelect: selectable?.onSelect,
            selectedProps: selectable?.selectedProps,
            onHighlight: selectable?.onHighlight,
          } satisfies Omit<SelectableProps, "children">,
          enabled: selectable !== undefined,
        },
        {
          component: Scrollable,
          props: {
            rows,
            isFocused,
          } satisfies Omit<ScrollableProps, "children">,
          enabled: scrollable,
        },
      ],
      [rows, isFocused, scrollable]
    );

    const boxProps = useMemo(() => {
      let modifiedProps: BoxProps = {};

      if (focusable) {
        props = {
          ...props,
          borderColor: isFocused ? "yellow" : "gray",
          borderBottom: true,
          borderRight: true,
          paddingX: props.paddingX ?? 1,
          borderLeft: true,
          borderStyle: "round",
        };
      }

      return {
        ...props,
        ...modifiedProps,
      };
    }, [focusable, isFocused, rows, props]);

    return (
      <WrapperContext.Provider
        value={{ props: addtionalProps, setProps: setAdditionalProps }}
      >
        <InkBox ref={refProp} {...boxProps} {...addtionalProps}>
          {wrappers.reduce((acc, { component: Component, props, enabled }) => {
            if (enabled)
              return <Component {...(props as any)}>{acc}</Component>;
            return acc;
          }, children)}
        </InkBox>
      </WrapperContext.Provider>
    );
  }
);

export default Box;
