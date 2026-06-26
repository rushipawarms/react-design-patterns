import { useState } from 'react';

/**
 * RENDER PROPS PATTERN
 * ----------------------------------------------------------------
 * WHAT: A component takes a function as a prop (often called `render`
 * or passed as `children`) and calls it with internal state, letting the
 * caller decide what to actually render.
 *
 * WHY: `MouseTracker` only knows how to track a mouse position — it has
 * zero opinion on what that position should look like. Two completely
 * different visuals reuse the exact same tracking logic below.
 *
 * USE CASES: Headless UI logic (tracking, drag-and-drop, form state)
 * shared across very different visuals. Largely superseded by custom
 * hooks today, but still common in libraries like React Router
 * (<Route render={...}/> in v5) and react-virtualized.
 * ----------------------------------------------------------------
 */
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div
      className="mouse-area"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
    >
      {render(pos)}
    </div>
  );
}

export default function RenderPropsDemo() {
  return (
    <div className="row" style={{ alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
      {/* Usage 1: show raw coordinates as text */}
      <div style={{ flex: '1 1 220px' }}>
        <p className="small" style={{ marginTop: 0 }}>Coordinates view</p>
        <MouseTracker render={(pos) => (
          <span>x: {Math.round(pos.x)}, y: {Math.round(pos.y)}</span>
        )} />
      </div>

      {/* Usage 2: same component, render a tiny dot that follows the cursor */}
      <div style={{ flex: '1 1 220px' }}>
        <p className="small" style={{ marginTop: 0 }}>Dot-follow view</p>
        <MouseTracker render={(pos) => (
          <div
            style={{
              position: 'absolute',
              left: pos.x - 5,
              top: pos.y - 5,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--accent)',
            }}
          />
        )} />
      </div>

      <p className="small" style={{ flexBasis: '100%' }}>
        Same <code>MouseTracker</code> component, same tracking logic — only
        the function passed to <code>render</code> changed between the two
        boxes above.
      </p>
    </div>
  );
}
