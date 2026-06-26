import { createContext, useContext, useState } from 'react';

/**
 * PROVIDER PATTERN
 * ----------------------------------------------------------------
 * WHAT: A component (ThemeProvider) wraps part of the tree and exposes
 * shared values via React Context. Any descendant — no matter how deep —
 * can read those values with useContext, with zero prop-drilling.
 *
 * WHY: Toolbar and FooterNote below are siblings, several levels removed
 * from where the theme actually lives — neither receives it as a prop,
 * yet both read and (one of them) update it directly.
 *
 * USE CASES: theme, auth/session, localization, feature flags, any value
 * truly "global" to a subtree rather than local to one component.
 * ----------------------------------------------------------------
 */
const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside a ThemeProvider');
  return ctx;
}

// Deeply nested consumer #1 — toggles the value
function Toolbar() {
  const { theme, toggle } = useTheme();
  return (
    <div className="row">
      <span className="small">current theme: <b>{theme}</b></span>
      <button onClick={toggle}>Toggle theme</button>
    </div>
  );
}

// Deeply nested consumer #2 — just reads the value, no prop passed to it
function FooterNote() {
  const { theme } = useTheme();
  return (
    <p className="small" style={{ marginTop: 10 }}>
      FooterNote rendering with theme = <b>{theme}</b> — it received this
      from context, not from a parent prop.
    </p>
  );
}

function SomeDeeplyNestedWrapper({ children }) {
  // intentionally does nothing with theme — proves it's not being
  // passed down manually through this layer
  return <div style={{ padding: 4 }}>{children}</div>;
}

export default function ProviderDemo() {
  return (
    <ThemeProvider>
      <div className="card">
        <Toolbar />
        <SomeDeeplyNestedWrapper>
          <SomeDeeplyNestedWrapper>
            <FooterNote />
          </SomeDeeplyNestedWrapper>
        </SomeDeeplyNestedWrapper>
      </div>
    </ThemeProvider>
  );
}
