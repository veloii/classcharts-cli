import { StudentClient } from "classcharts-api";
import { Instance, flow, types } from "mobx-state-tree";
import React, { createContext, useContext, useEffect } from "react";
import { useStudentClient } from "../contexts/student-client.js";

export const Homework = types.model({
  lesson: types.string,
  subject: types.string,
  teacher: types.string,
  homework_type: types.string,
  id: types.number,
  title: types.string,
  meta_title: types.string,
  description: types.string,
  issue_date: types.string,
  due_date: types.string,
  completion_time_unit: types.string,
  completion_time_value: types.string,
  publish_time: types.string,
  status: types.model({
    id: types.number,
    state: types.maybeNull(
      types.enumeration("HomeworkState", ["not_completed", "late", "completed"])
    ),
    mark_relative: types.number,
    ticked: types.enumeration("HomeworkTicked", ["yes", "no"]),
    allow_attachments: types.boolean,
    first_seen_date: types.maybeNull(types.string),
    last_seen_date: types.maybeNull(types.string),
    has_feedback: types.boolean,
  }),
  validated_attachments: types.array(
    types.model({
      id: types.number,
      file_name: types.string,
      file: types.string,
      validated_file: types.string,
    })
  ),
});

export type DisplayDate = "due_date" | "issue_date";

export interface HomeworksResponseMeta {
  start_date: string;
  end_date: string;
  display_type: DisplayDate;
  max_files_allowed: number;
  allowed_file_types: string[];
  this_week_due_count: number;
  this_week_outstanding_count: number;
  this_week_completed_count: number;
  allow_attachments: boolean;
  display_marks: boolean;
}

const HomeworkStore = types
  .model({
    loaded: types.boolean,
    list: types.array(Homework),
    meta: types.maybeNull(
      types.model({
        start_date: types.string,
        end_date: types.string,
        display_type: types.enumeration("DisplayDate", [
          "due_date",
          "issue_date",
        ]),
        max_files_allowed: types.number,
        allowed_file_types: types.array(types.string),
        this_week_due_count: types.number,
        this_week_outstanding_count: types.number,
        this_week_completed_count: types.number,
        allow_attachments: types.boolean,
        display_marks: types.boolean,
      })
    ),
  })
  .views((self) => {
    return {
      get submitted() {
        return self.list.filter(
          (homework) => homework.status.state === "completed"
        );
      },
      get outstanding() {
        return self.list.filter(
          (homework) => homework.status.state === "not_completed"
        );
      },
      get late() {
        return self.list.filter((homework) => homework.status.state === "late");
      },
      get completed() {
        return self.list.filter((homework) => homework.status.ticked === "yes");
      },
    };
  })
  .actions((self) => {
    return {
      hydrate: flow(function* hydrate(
        client: StudentClient,
        from?: string,
        to?: string
      ) {
        const homeworks = yield client.getHomeworks({ from, to });
        self.list = homeworks.data;
        self.meta = homeworks.meta;
        self.loaded = true;
      }),
    };
  });

let initalState = HomeworkStore.create({
  loaded: false,
  list: [],
  meta: null,
});

export type HomeworkInstance = Instance<typeof HomeworkStore>;
const HomeworkStoreContext = createContext<null | HomeworkInstance>(null);

export const HomeworkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { client, loggedIn } = useStudentClient();

  useEffect(() => {
    if (client && loggedIn) {
      initalState.hydrate(client);
    }
  }, [client]);

  return (
    <HomeworkStoreContext.Provider value={initalState}>
      {children}
    </HomeworkStoreContext.Provider>
  );
};

export function useHomework() {
  const store = useContext(HomeworkStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
