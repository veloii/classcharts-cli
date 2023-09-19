import { Text } from "ink";
import React from "react";
import { HomeworkInstance } from "../store/homework.js";
import Box from "./box.js";

export type Homework = HomeworkInstance["list"][number];

const homeworkFieldsToDisplay: { field: keyof Homework; label: string }[] = [
  {
    field: "title",
    label: "Name",
  },
  {
    field: "teacher",
    label: "Teacher",
  },
  {
    field: "lesson",
    label: "Lesson",
  },
  {
    field: "subject",
    label: "Subject",
  },
  {
    field: "issue_date",
    label: "Issue Date",
  },
  {
    field: "due_date",
    label: "Due Date",
  },
  {
    field: "completion_time_value",
    label: "Estimated Time",
  },
  {
    field: "homework_type",
    label: "Homework Type",
  },
];

export default function SelectedHomework({
  homework,
  goBack,
  isFocused,
}: {
  homework: Homework;
  goBack: () => void;
  isFocused?: boolean;
}) {
  const [highlighted, setHighlighted] = React.useState(0);

  return (
    <Box
      paddingX={1}
      flexGrow={1}
      showFocusBorders
      isFocused={isFocused}
      scrollable
      selectable={{
        onSelect: (i) => {
          if (i === 0) goBack();
        },
        onHighlight: setHighlighted,
        selectedProps: {
          color: "yellow",
        },
      }}
    >
      <Text bold>← Back</Text>

      {homeworkFieldsToDisplay.map(({ label, field }, index) => (
        <Box key={label} gap={2}>
          <Box minWidth={15}>
            <Text color={highlighted - 1 === index ? "yellow" : undefined} bold>
              {label}
            </Text>
          </Box>
          <Text key={field as string}>{homework[field]}</Text>
        </Box>
      ))}
    </Box>
  );
}
