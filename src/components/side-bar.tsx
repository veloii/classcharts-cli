import { Text, useFocus } from "ink";
import React from "react";
import { pages, useCurrentPage } from "../contexts/current-page.js";
import Box from "./box.js";

export default function Sidebar() {
  const { isFocused } = useFocus();
  const { setCurrentPage } = useCurrentPage();

  return (
    <Box
      showFocusBorders
      minWidth={20}
      isFocused={isFocused}
      flexDirection="column"
      selectable={{
        onSelect: (i) => {
          setCurrentPage(pages[i]);
        },
        selectedProps: {
          color: "yellow",
        },
      }}
    >
      {pages.map((page) => (
        <Text key={page}>{page}</Text>
      ))}
    </Box>
  );
}
