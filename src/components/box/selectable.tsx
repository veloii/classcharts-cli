import { BoxProps as InkBoxProps, useInput } from "ink";
import React, { useState } from "react";

export type SelectableProps = {
  children: React.ReactNode;
  isFocused?: boolean;
  onSelect?: (index: number) => void;
  onHighlight?: (index: number) => void;
  selectedProps?: Partial<InkBoxProps>;
};

const Selectable = ({
  children,
  selectedProps,
  isFocused,
  onHighlight,
  onSelect,
}: SelectableProps) => {
  const maxIndex = React.Children.count(children) - 1;
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((_, key) => {
    if (!isFocused) return;

    if (key.downArrow && selectedIndex < maxIndex) {
      setSelectedIndex((prev) => prev + 1);
      onHighlight?.(selectedIndex + 1);
    } else if (key.upArrow && selectedIndex > 0) {
      onHighlight?.(selectedIndex - 1);
      setSelectedIndex((prev) => prev - 1);
    }

    if (key.return && selectedIndex !== null) {
      onSelect?.(selectedIndex);
    }
  });

  return React.Children.map(children, (child, index) => {
    if (index === selectedIndex) {
      return React.cloneElement(child as React.ReactElement, {
        ...selectedProps,
      });
    }

    return child;
  });
};

export default Selectable;
