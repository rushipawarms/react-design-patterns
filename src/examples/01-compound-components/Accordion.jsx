import { createContext, useContext, useState } from "react";

export const AccordionContext = createContext(null);
export const Accordion = ({ children }) => {
    const [openIds, setOpenIds] = useState([]);
  return (
    <AccordionContext.Provider value={{ openIds, setOpenIds }}>
      <div className="acc">{children}</div>
    </AccordionContext.Provider>
  );
};
