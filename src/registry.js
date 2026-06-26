import { lazy } from 'react';

/**
 * Central registry — each entry points at one self-contained pattern
 * example. Adding a new pattern means adding one entry here plus its
 * own folder; nothing else in the app needs to change.
 */
export const examples = [
  {
    id: 'compound-components',
    title: 'Compound Components',
    useCase: 'Accordion',
    summary:
      'A parent owns shared state; children, attached as properties of the parent, read it via context — composable like <select>/<option>.',
    Demo: lazy(() => import('./examples/01-compound-components/Demo.jsx')),
  },
  {
    id: 'composition',
    title: 'Component Composition',
    useCase: 'Generic Panel shell reused 3 ways',
    summary:
      'Build a generic shell that accepts children/slots, instead of one component with many boolean props for every layout.',
    Demo: lazy(() => import('./examples/02-composition/Demo.jsx')),
  },
  {
    id: 'hoc',
    title: 'Higher-Order Component',
    useCase: 'withAuthGuard + withLogging, stacked',
    summary:
      'A function that takes a component and returns an enhanced one — cross-cutting behavior added without the wrapped component knowing.',
    Demo: lazy(() => import('./examples/03-hoc/Demo.jsx')),
  },
  {
    id: 'custom-hook',
    title: 'Custom Hook',
    useCase: 'useLocalStorage shared by two widgets',
    summary:
      'Extract reusable stateful logic into a useXxx function; multiple unrelated components reuse it with zero duplication.',
    Demo: lazy(() => import('./examples/04-custom-hook/Demo.jsx')),
  },
  {
    id: 'container-presentational',
    title: 'Container / Presentational',
    useCase: 'Weather widget (simulated fetch)',
    summary:
      'Split a feature into a logic-owning Container and a pure, props-only Presentational view — swap data sources without touching the UI.',
    Demo: lazy(() => import('./examples/05-container-presentational/Demo.jsx')),
  },
  {
    id: 'render-props',
    title: 'Render Props',
    useCase: 'MouseTracker, rendered two different ways',
    summary:
      'A component accepts a function prop and calls it with internal state, letting the caller decide what to render.',
    Demo: lazy(() => import('./examples/06-render-props/Demo.jsx')),
  },
  {
    id: 'provider',
    title: 'Provider Pattern',
    useCase: 'ThemeContext read by deeply nested children',
    summary:
      'Wrap a subtree in a Provider and expose shared values via Context — no prop-drilling through intermediate layers.',
    Demo: lazy(() => import('./examples/07-provider/Demo.jsx')),
  },
  {
    id: 'use-reducer',
    title: 'useReducer',
    useCase: 'Local cart reducer (items + total + count)',
    summary:
      'Centralize several interdependent state updates into one pure (state, action) -> newState function, local to one component.',
    Demo: lazy(() => import('./examples/08-use-reducer/Demo.jsx')),
  },
  {
    id: 'redux-pattern',
    title: 'Redux Pattern (Global State)',
    useCase: 'Cart store shared by two unrelated siblings',
    summary:
      'Lift useReducer into Context so distant, unrelated components can dispatch into / read from one shared store — the shape Redux popularized.',
    Demo: lazy(() => import('./examples/09-redux-pattern/Demo.jsx')),
  },
  {
    id: 'controlled-uncontrolled',
    title: 'Controlled vs Uncontrolled',
    useCase: 'Two inputs, side by side',
    summary:
      'Controlled: React state drives the value (live access). Uncontrolled: the DOM owns the value, read once via ref.',
    Demo: lazy(() => import('./examples/10-controlled-uncontrolled/Demo.jsx')),
  },
];
