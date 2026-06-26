import { useRef, useState } from 'react';

/**
 * CONTROLLED VS UNCONTROLLED COMPONENTS
 * ----------------------------------------------------------------
 * WHAT:
 *  - Controlled: the input's value comes from React state
 *    (`value={state}` + `onChange`). React is the single source of truth.
 *  - Uncontrolled: the input manages its own value internally in the
 *    DOM; React only reads it on demand via a `ref` (e.g. on submit).
 *
 * WHY: Controlled gives you live access for validation, character
 * counts, or conditionally disabling a button. Uncontrolled means fewer
 * re-renders and less code when you only need the value once.
 *
 * USE CASES: Controlled — live search, password-strength meters, forms
 * needing field-level validation as you type. Uncontrolled — simple
 * forms, file inputs (which MUST be uncontrolled), quick one-shot reads.
 * ----------------------------------------------------------------
 */

function ControlledExample() {
  const [value, setValue] = useState('');
  return (
    <div className="card">
      <p className="small" style={{ marginTop: 0 }}>Controlled input</p>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type here…"
        style={{ width: '100%' }}
      />
      <p className="small" style={{ marginTop: 8 }}>
        Live character count: <b>{value.length}</b> — only possible because
        React re-renders on every keystroke with the current value.
      </p>
    </div>
  );
}

function UncontrolledExample() {
  const inputRef = useRef(null);
  const [lastSubmitted, setLastSubmitted] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLastSubmitted(inputRef.current.value); // read the DOM only on submit
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <p className="small" style={{ marginTop: 0 }}>Uncontrolled input</p>
      <input
        ref={inputRef}
        defaultValue=""
        placeholder="Type here…"
        style={{ width: '100%' }}
      />
      <button className="primary" type="submit" style={{ marginTop: 8 }}>
        Submit
      </button>
      {lastSubmitted !== null && (
        <p className="small" style={{ marginTop: 8 }}>
          Last submitted value: <b>{lastSubmitted}</b> — React had no idea
          what was typed until this exact moment.
        </p>
      )}
    </form>
  );
}

export default function ControlledUncontrolledDemo() {
  return (
    <div className="row" style={{ alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 240px' }}>
        <ControlledExample />
      </div>
      <div style={{ flex: '1 1 240px' }}>
        <UncontrolledExample />
      </div>
    </div>
  );
}
