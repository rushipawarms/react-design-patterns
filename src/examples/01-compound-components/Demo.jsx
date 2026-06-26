import { createContext, useContext, useState } from "react";
import { Accordion } from "./Accordion";
import { AccordionItem } from "./AccordionItem";

/**
 * COMPOUND COMPONENTS PATTERN
 * ----------------------------------------------------------------
 * WHAT: A parent component (Accordion) owns shared state. Its child
 * components (Accordion.Item) are exposed as properties on the parent
 * and silently read/write that shared state via context — the consumer
 * just nests JSX, never passing state through props manually.
 *
 * WHY: Compare the two usages below. Without this pattern you'd pass a
 * single `items` array prop and lose the ability to freely mix in custom
 * markup per item. With it, consumers compose freely, the way native
 * <select>/<option> or <table>/<tr>/<td> work together.
 *
 * USE CASES: Accordions, Tabs, Menus/Dropdowns, Steppers/Wizards,
 * anything with "one parent state, many flexible children".
 * ----------------------------------------------------------------
 */

//const AccordionContext = createContext(null);

// function Accordion({ children, allowMultiple = false }) {
//   const [openIds, setOpenIds] = useState([]);

//   const toggle = (id) => {
//     setOpenIds((prev) => {
//       const isOpen = prev.includes(id);
//       if (allowMultiple) {
//         return isOpen ? prev.filter((x) => x !== id) : [...prev, id];
//       }
//       return isOpen ? [] : [id];
//     });
//   };

//   return (
//     <AccordionContext.Provider value={{ openIds, toggle }}>
//       <div className="acc">{children}</div>
//     </AccordionContext.Provider>
//   );
// }

// function AccordionItem({ id, title, children }) {
//   const { openIds, toggle } = useContext(AccordionContext);
//   const isOpen = openIds.includes(id);
//   return (
//     <div className="acc-item">
//       <div className="acc-header" onClick={() => toggle(id)}>
//         <span>{title}</span>
//         <span>{isOpen ? "−" : "+"}</span>
//       </div>
//       {isOpen && <div className="acc-body">{children}</div>}
//     </div>
//   );
// }

// Attaching the child as a property of the parent is the defining trait
// of this pattern — it signals "these two are meant to be used together".
// Accordion.Item = AccordionItem;

export default function CompoundComponentsDemo() {
  // return (
  //   <div>
  //     <h3 style={{ marginTop: 0 }}>Single-open accordion (default)</h3>
  //     <Accordion>
  //       <Accordion.Item id="a" title="What is a compound component?">
  //         A parent manages shared state internally; children declared as
  //         properties of the parent (Accordion.Item) read that state through
  //         context, with no props passed manually by the consumer.
  //       </Accordion.Item>
  //       <Accordion.Item id="b" title="Why not just pass an items array?">
  //         An array prop forces every item to look the same. Composing JSX
  //         children lets each item render arbitrary, different content —
  //         forms, images, nested components — while state stays centralized.
  //       </Accordion.Item>
  //       <Accordion.Item id="c" title="Real-world examples?">
  //         Radix UI and Headless UI's Tabs/Accordion/Menu components are all
  //         built this way — that's why you write &lt;Tabs.Root&gt;,
  //         &lt;Tabs.List&gt;, &lt;Tabs.Trigger&gt; etc.
  //       </Accordion.Item>
  //     </Accordion>

  //     <h3>Multi-open accordion (same component, one prop changed)</h3>
  //     <Accordion allowMultiple>
  //       <Accordion.Item id="x" title="Can multiple panels stay open?">
  //         Yes — the allowMultiple prop changes only the parent's toggle
  //         logic. Accordion.Item didn't change at all.
  //       </Accordion.Item>
  //       <Accordion.Item id="y" title="Does this scale to deeply nested UI?">
  //         Yes, because each item only needs its own id; the parent context
  //         handles bookkeeping no matter how many items you nest.
  //       </Accordion.Item>
  //     </Accordion>
  //   </div>
  // );
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Single-open accordion (default)</h3>
      <Accordion>
        <AccordionItem id="a" title="What is a compound component?">
          {" "}
          A parent manages shared state internally; children declared as
          properties of the parent (Accordion.Item) read that state through
          context, with no props passed manually by the consumer.
        </AccordionItem>
        <AccordionItem id="b" title="Why not just pass an items array?">
          An array prop forces every item to look the same. Composing JSX
          children lets each item render arbitrary, different content — forms,
          images, nested components — while state stays centralized.
        </AccordionItem>
        <AccordionItem id="c" title="Real-world examples?">
          Yes, because each item only needs its own id; the parent context
          handles bookkeeping no matter how many items you nest.
        </AccordionItem>
      </Accordion>
    </div>
  );
}
