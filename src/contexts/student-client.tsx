import { StudentClient } from "classcharts-api";
import React, { createContext, useContext, useEffect, useState } from "react";

const StudentClientContext = createContext({
  client: null as null | StudentClient,
  loggedIn: false,
  hydrateClient: async (_: { accessCode: string; dob: string }) => {},
});

export const StudentClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [client, setClient] = useState(null as null | StudentClient);
  const [loggedIn, setLoggedIn] = useState(false);

  const hydrateClient = async ({
    accessCode,
    dob,
  }: {
    accessCode: string;
    dob: string;
  }) => {
    const client = new StudentClient(accessCode, dob);
    await client.login();
    setLoggedIn(true);
    setClient(client);
  };

  return (
    <StudentClientContext.Provider value={{ client, loggedIn, hydrateClient }}>
      {children}
    </StudentClientContext.Provider>
  );
};

export const useStudentClient = () => {
  return useContext(StudentClientContext);
};
