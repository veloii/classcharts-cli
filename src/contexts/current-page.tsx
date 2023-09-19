import React, { createContext } from "react";

export const pages = ["Home", "My Homework"] as const;
export type Page = (typeof pages)[number];

const CurrentPageContext = createContext({
  currentPage: pages[0] as Page,
  setCurrentPage: (page: Page) => {},
});

export const CurrentPageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentPage, setCurrentPage] = React.useState<Page>(pages[0]);

  return (
    <CurrentPageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </CurrentPageContext.Provider>
  );
};

export const useCurrentPage = () => React.useContext(CurrentPageContext);
