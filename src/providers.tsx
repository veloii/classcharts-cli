import React from "react";
import { StudentClientProvider } from "./contexts/student-client.js";
import { HomeworkProvider } from "./store/homework.js";
import { CurrentPageProvider } from "./contexts/current-page.js";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StudentClientProvider>
      <CurrentPageProvider>
        <HomeworkProvider>{children}</HomeworkProvider>
      </CurrentPageProvider>
    </StudentClientProvider>
  );
}
