import { Accordion } from "./Accordion";
import { createContext, useContext, useState } from "react";
import {AccordionContext} from "./Accordion";
export const AccordionItem = ({ id, title, children }) => {
  const { openIds, setOpenIds } = useContext(AccordionContext);
  const isOpen = openIds.includes(id);
  return (
    <div className="acc-item">
      <div className="acc-header" onClick={() => setOpenIds(id)}>
        <span>{title}</span>
        <span>{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && <div className="acc-body">{children}</div>}
    </div>
  );
};

Accordion.item = AccordionItem;