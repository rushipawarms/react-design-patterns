import { useEffect, useState } from 'react';

/**
 * CUSTOM HOOK PATTERN
 * ----------------------------------------------------------------
 * WHAT: Extract stateful logic into a reusable `useXxx` function. It can
 * call other hooks internally (useState, useEffect...) and returns
 * whatever the consuming component needs.
 *
 * WHY: `useLocalStorage` below hides all the JSON.parse/try-catch
 * boilerplate. Two completely unrelated pieces of UI (a counter and a
 * notes field) reuse the exact same hook with zero duplication.
 *
 * USE CASES: useLocalStorage, useDebounce, useFetch, useWindowSize,
 * useForm — any stateful behavior more than one component needs.
 * ----------------------------------------------------------------
 */
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable — state still works in-memory */
    }
  }, [key, value]);

  return [value, setValue];
}

function Counter() {
  const [count, setCount] = useLocalStorage('demo_counter', 0);
  return (
    <div className="card">
      <p className="small" style={{ marginTop: 0 }}>Persisted counter</p>
      <div className="row">
        <button onClick={() => setCount((c) => c - 1)}>−</button>
        <b style={{ minWidth: 24, textAlign: 'center' }}>{count}</b>
        <button onClick={() => setCount((c) => c + 1)}>+</button>
      </div>
    </div>
  );
}

function Notes() {
  const [text, setText] = useLocalStorage('demo_notes', '');
  return (
    <div className="card">
      <p className="small" style={{ marginTop: 0 }}>Persisted notes</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        style={{ width: '100%', resize: 'vertical' }}
        placeholder="Type something, then reload the page…"
      />
    </div>
  );
}

export default function CustomHookDemo() {
  return (
    <div className="row" style={{ alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 200px' }}>
        <Counter />
      </div>
      <div style={{ flex: '1 1 200px' }}>
        <Notes />
      </div>
      <p className="small" style={{ flexBasis: '100%' }}>
        Both components call <code>useLocalStorage</code> independently with
        different keys. Reload the page — both values survive, and neither
        component had to write its own persistence logic.
      </p>
    </div>
  );
}
