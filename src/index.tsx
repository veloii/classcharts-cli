import { Box, render, Text } from "ink";
import React, { useEffect } from "react";
import Sidebar from "./components/side-bar.js";
import Table from "./components/table.js";
import { useCurrentPage } from "./contexts/current-page.js";
import Providers from "./providers.js";
import Home from "./components/home.js";
import fs from "fs";
import TextInput from "./lib/input.js";
import { useStudentClient } from "./contexts/student-client.js";
import { createConfigDirectory } from "./lib/config.js";

const Index = () => {
  const { currentPage } = useCurrentPage();
  const [ready, setReady] = React.useState(false);
  const [setup, setSetup] = React.useState<"accessCode" | "dob" | false>(false);
  const [accessCode, setAccessCode] = React.useState("");
  const [dob, setDob] = React.useState("");
  const { hydrateClient } = useStudentClient();
  const configDirectory = createConfigDirectory();

  const tryLogin = async (options: { accessCode: string; dob: string }) => {
    try {
      await hydrateClient(options);

      setReady(true);
      setSetup(false);
    } catch (e) {
      console.error("Failed to login");
      setAccessCode("");
      setDob("");
      setSetup("accessCode");
    }
  };

  useEffect(() => {
    try {
      const account = fs.readFileSync(configDirectory + "/account.json");
      const { accessCode, dob } = JSON.parse(account.toString());

      if (!accessCode || !dob) {
        throw new Error("No account");
      }

      tryLogin({ accessCode, dob });
    } catch {
      setSetup("accessCode");
    }
  }, []);

  if (setup) {
    return (
      <Box flexDirection="column">
        <Box>
          <Text>Access Code:</Text>
          <TextInput
            onChange={setAccessCode}
            value={accessCode}
            focus={setup === "accessCode"}
            showCursor
            onSubmit={() => {
              setSetup("dob");
            }}
          />
        </Box>

        {setup === "dob" && (
          <Box>
            <Text>Date of Birth {"(DD/MM/YYYY)"}:</Text>
            <TextInput
              placeholder="04/06/2006"
              onChange={setDob}
              value={dob}
              showCursor
              onSubmit={() => {
                fs.writeFileSync(
                  configDirectory +
                    "/account.json",
                  JSON.stringify({
                    accessCode,
                    dob,
                  }),
                );

                tryLogin({ accessCode, dob });
              }}
            />
          </Box>
        )}
      </Box>
    );
  }
  if (!ready) return null;

  if (currentPage === "My Homework") {
    return (
      <Box flexDirection="row">
        <Sidebar />
        <Table />
      </Box>
    );
  } else {
    return (
      <Box flexDirection="row">
        <Sidebar />
        <Home />
      </Box>
    );
  }
};

render(
  <Providers>
    <Index />
  </Providers>,
);
