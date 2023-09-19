import { useFocus, Text } from "ink";
import React from "react";
import Box from "./box.js";

export default function Home() {
  const { isFocused } = useFocus();

  return (
    <Box flexGrow={1} showFocusBorders scrollable isFocused={isFocused}>
      <Text>Home page, hi!</Text>
    </Box>
  );
}
