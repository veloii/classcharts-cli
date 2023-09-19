import { DOMElement, Box as InkBox, measureElement, useInput } from "ink";
import React, { useEffect, useState } from "react";
import { useParentProps } from "./index.js";

export type ScrollableProps = {
  children: React.ReactNode;
  isFocused?: boolean;
  rows: number;
};

const Scrollable = ({ children, isFocused, rows }: ScrollableProps) => {
  const [ref, setRef] = useState<DOMElement | null>(null);
  const [height, setHeight] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { setProps } = useParentProps();

  useInput((_, key) => {
    if (isFocused === false) return;

    if (key.upArrow && scrollPosition < 0) {
      setScrollPosition((prev) => prev + 1);
    }

    if (key.downArrow && scrollPosition > -height + rows - 2) {
      setScrollPosition((prev) => prev - 1);
    }
  });

  useEffect(() => {
    if (ref) {
      setHeight(measureElement(ref).height);
      setProps({ height: rows, overflowY: "hidden" });
    }
  }, [ref]);

  return (
    <InkBox
      ref={(ref) => setRef(ref)}
      height={height || undefined}
      marginTop={scrollPosition}
      flexDirection="column"
    >
      {children}
    </InkBox>
  );
};

export default Scrollable;
