import { Text, useFocus, useInput } from "ink";
import React, { useCallback } from "react";
import { useObservable } from "../hooks/use-observable.js";
import Table from "../lib/table.js";
import { useHomework } from "../store/homework.js";
import Box from "./box.js";
import SelectedHomework, { Homework } from "./selected-hw.js";

export default function Taboe() {
  const { list } = useObservable(useHomework());
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const { isFocused } = useFocus();
  const [selectedHw, setSelectedHw] = React.useState<Homework | null>(null);

  useInput((_, key) => {
    if (selectedHw) return;
    if (!isFocused) return;

    if (key.downArrow && selectedIndex < list.length - 1) {
      setSelectedIndex((prev) => prev + 1);
    } else if (key.upArrow && selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
    } else if (key.return) {
      setSelectedHw(list[selectedIndex]);
    }
  });

  const goBack = useCallback(() => {
    setSelectedHw(null);
  }, []);

  if (selectedHw) {
    return (
      <SelectedHomework
        goBack={goBack}
        homework={selectedHw}
        isFocused={isFocused}
      />
    );
  }

  return (
    <>
      <Box
        flexGrow={1}
        showFocusBorders
        scrollable
        isFocused={isFocused}
        key={list.length}
        paddingX={0}
      >
        <Table
          padding={0}
          selectedIndex={selectedIndex}
          skeleton={() => <Text />}
          data={list.map((list) => ({
            Title: list.title,
            Teacher: list.teacher,
            Lesson: list.lesson,
            Subject: list.subject,
            "Issue date": list.issue_date,
            "Due date": list.due_date,
            "Est. time": list.completion_time_value,
            Type: list.homework_type,
          }))}
        />
      </Box>
    </>
  );
}
