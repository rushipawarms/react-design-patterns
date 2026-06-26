# React Design Patterns — One Example Per Pattern

Ten React patterns, each as its own **fully self-contained** example —
no example imports from another. A sidebar lets you switch between them;
each panel shows the pattern's name, its use case, a one-line summary,
and the live demo.

## Run it

```bash
npm install
npm run dev
```

## Structure

```
src/
  registry.js              ← list of all 10 examples + their summaries
  App.jsx                  ← sidebar shell that lazy-loads whichever is selected
  examples/
    01-compound-components/Demo.jsx
    02-composition/Demo.jsx
    03-hoc/Demo.jsx
    04-custom-hook/Demo.jsx
    05-container-presentational/Demo.jsx
    06-render-props/Demo.jsx
    07-provider/Demo.jsx
    08-use-reducer/Demo.jsx
    09-redux-pattern/Demo.jsx
    10-controlled-uncontrolled/Demo.jsx
```

Each `Demo.jsx` is a **standalone single file** you can copy into any
other project verbatim — it has zero dependency on the rest of this repo.

## Adding an 11th pattern

1. Create `src/examples/11-your-pattern/Demo.jsx` with a default export.
2. Add one entry to the array in `src/registry.js`.

Nothing else needs to change — the sidebar and content area pick it up
automatically.

---

# Code Walkthrough & Real-World Use Cases

## 1. Compound Components — `01-compound-components/Demo.jsx`

**How it's implemented:**
```jsx
const AccordionContext = createContext(null);

function Accordion({ children, allowMultiple }) {
  const [openIds, setOpenIds] = useState([]);
  return (
    <AccordionContext.Provider value={{ openIds, toggle }}>
      {children}
    </AccordionContext.Provider>
  );
}

function AccordionItem({ id, title, children }) {
  const { openIds, toggle } = useContext(AccordionContext); // reads parent's state
  const isOpen = openIds.includes(id);
  return (/* header + conditionally rendered body */);
}

Accordion.Item = AccordionItem; // <- the defining move
```
The trick is `Accordion.Item = AccordionItem`. Nothing forces this —
it's a convention that tells the consumer "these are meant to be nested
together," the same way `<select>` and `<option>` are. The **state**
(which panel is open) lives only inside `Accordion`; `AccordionItem`
never receives it as a prop — it pulls it from context. That's what
makes this "compound" rather than just "a component that takes
children." Toggling `allowMultiple` only changes the parent's update
logic; `AccordionItem` doesn't change at all.

**Real use cases:** Radix UI / Headless UI / Reach UI's `Tabs`, `Menu`,
`Accordion`, `Dialog` are all built exactly this way
(`<Tabs.Root><Tabs.List><Tabs.Trigger>`). Reach for this whenever you
want flexible, arbitrary markup per item while one piece of state
(active tab/step/panel) stays centralized in a single parent.

---

## 2. Component Composition — `02-composition/Demo.jsx`

**How it's implemented:**
```jsx
function Panel({ header, footer, children }) {
  return (
    <div className="card">
      {header && <div>{header}</div>}
      <div>{children}</div>
      {footer && <div>{footer}</div>}
    </div>
  );
}
```
`Panel` takes `header`, `footer`, `children` — that's it. No `variant`
prop, no `showHeader` boolean. Each call site decides what goes inside:
```jsx
<Panel header="Account stats" footer={<span>Updated now</span>}>
  <StatRow .../>
</Panel>

<Panel header="Quick feedback" footer={<button>Send</button>}>
  <textarea />
</Panel>
```
The pattern is really an anti-pattern *avoided*: instead of
`<Panel type="stats" showFooter items={...} />`, you hand it real JSX.
`Panel` doesn't know or care what's inside — even nesting
`<Panel><Panel>...</Panel></Panel>` just works, because composition
doesn't require components to know their context.

**Real use cases:** Every design-system `Card`, `Modal`, `Layout`
component. `react-modal`, MUI's `Dialog`, Chakra's `Box`/`Stack` — all
let you compose arbitrary children rather than configuring fixed slots
through flags.

---

## 3. Higher-Order Component — `03-hoc/Demo.jsx`

**How it's implemented:**
```jsx
function withAuthGuard(WrappedComponent) {
  return function Guarded({ isLoggedIn, onLogin, ...rest }) {
    if (!isLoggedIn) return <LoginPrompt onLogin={onLogin} />;
    return <WrappedComponent {...rest} />; // pass-through
  };
}

const GuardedProfile = withLogging(withAuthGuard(Profile), 'GuardedProfile');
```
A HOC is just a function that takes a component and returns a *new*
component wrapping it. `Profile` itself has zero auth code —
`withAuthGuard` intercepts the render and decides whether `Profile`
even mounts. Stacking two HOCs
(`withLogging(withAuthGuard(Profile))`) works like function
composition — the outer one runs first, the inner one renders only if
the outer allows it.

**Real use cases:** `react-redux`'s older `connect()`, React Router
v5/v6-style route guards (`<PrivateRoute>`), Next.js page-level
`withAuth` wrappers, Sentry's `withErrorBoundary`. Less common now that
hooks cover most of this, but still standard in routing/auth
middleware-style code.

---

## 4. Custom Hook — `04-custom-hook/Demo.jsx`

**How it's implemented:**
```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    // read from localStorage once, on mount
  });
  useEffect(() => {
    // write to localStorage whenever value changes
  }, [key, value]);
  return [value, setValue]; // same shape as useState
}
```
It composes `useState` + `useEffect` and returns the same
`[value, setter]` tuple `useState` would — so it's a drop-in
replacement. `Counter` and `Notes` call it with different keys and get
fully independent, persisted state with no shared logic duplicated
between them.

**Real use cases:** `useDebounce`, `useFetch`, `useWindowSize`,
`useForm` (react-hook-form is essentially one big custom hook),
`useMediaQuery`. Any time you catch yourself copy-pasting a
`useState`+`useEffect` combo into a second component, that's the
signal to extract a custom hook.

---

## 5. Container / Presentational — `05-container-presentational/Demo.jsx`

**How it's implemented:**
```jsx
function WeatherView({ loading, error, data }) {
  // pure — only reads props, no hooks of its own
}

function WeatherContainer({ city }) {
  const [state, setState] = useState(/* loading/error/data */);
  useEffect(() => {
    // simulated fetch here — swap for a real one and WeatherView never changes
  }, [city]);
  return <WeatherView {...state} />;
}
```
`WeatherView` has no `useEffect` and no idea where `data` came from —
you could render it in Storybook with hardcoded props and it would look
identical. `WeatherContainer` is the only place that knows about
fetching/loading/error handling.

**Real use cases:** Classic Redux-era React (`connect()`-wrapped
containers feeding dumb components), GraphQL apps where a container
runs `useQuery` and passes data to a presentational chart/table. Useful
whenever you want a component visually testable/reviewable in isolation
from its data source.

---

## 6. Render Props — `06-render-props/Demo.jsx`

**How it's implemented:**
```jsx
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return <div onMouseMove={...}>{render(pos)}</div>; // hands state to a function
}

<MouseTracker render={(pos) => <span>{pos.x}, {pos.y}</span>} />
<MouseTracker render={(pos) => <Dot style={{ left: pos.x }} />} />
```
`MouseTracker` owns *behavior* (tracking the cursor) and, instead of
rendering fixed JSX itself, calls a function prop with its internal
state and renders whatever that function returns. Same tracking logic,
two completely different visuals, with zero changes to `MouseTracker`.

**Real use cases:** React Router v5's `<Route render={...}>`,
`react-virtualized`'s list renderers, Formik's `<Field>` render prop for
custom field UI. Largely replaced by custom hooks today
(`useMousePosition()` does the same job with less nesting) — still
worth recognizing in older codebases and libraries.

---

## 7. Provider Pattern — `07-provider/Demo.jsx`

**How it's implemented:**
```jsx
const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext);
}
```
`Toolbar` and `FooterNote` sit several layers deep
(`SomeDeeplyNestedWrapper` in between, doing nothing). Neither receives
`theme` as a prop — they call `useTheme()` directly. That's the whole
point: anything inside `<ThemeProvider>` can read or update the value
regardless of nesting depth.

**Real use cases:** Theme switching (light/dark), i18n/locale,
auth/session (`useUser()`), feature flags, React Query's
`QueryClientProvider`, react-router's `<BrowserRouter>`. Use anywhere a
value is "global to a screen/app" rather than local to one branch of
the tree.

---

## 8. `useReducer` — `08-use-reducer/Demo.jsx`

**How it's implemented:**
```jsx
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { items: [...state.items, newItem], total: state.total + action.price };
    case 'REMOVE_LAST':
      return { items: state.items.slice(0, -1), total: state.total - removedPrice };
    default:
      return state;
  }
}

const [cart, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
```
`items` and `total` always change *together* — with two separate
`useState` calls, every handler would need to update both, and it's
easy to forget one. The reducer guarantees every valid transition keeps
them in sync, in one place. Note this state is **local** — only this
one component owns it, unlike pattern 9 below.

**Real use cases:** Multi-step forms/wizards (`step`, `formData`,
`errors` changing together), any widget with several "this combo of
fields only changes via these specific actions" transitions, undo/redo
logic.

---

## 9. Redux Pattern (Global State) — `09-redux-pattern/Demo.jsx`

**How it's implemented:** the identical reducer shape from pattern 8,
lifted into Context:
```jsx
const StoreContext = createContext(null);

function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { count: 0, total: 0 });
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

function useStore() {
  return useContext(StoreContext);
}
```
`CartBadge` and `ProductGrid` are unrelated siblings — no parent passes
data between them. Both call `useStore()` and hit the *same*
dispatcher. Click "Add" in `ProductGrid`, `CartBadge` updates instantly
with no props connecting them — that's the proof this is genuinely
global, not just "shared via a common parent."

**Real use cases:** Shopping carts, notification/toast systems,
current-user session, and real Redux/Zustand/Jotai apps — this pattern
is literally what those libraries formalize, adding devtools,
middleware, and performance optimizations for large state trees. When
plain Context + useReducer starts feeling unwieldy across a big app,
that's the moment to reach for one of those libraries.

---

## 10. Controlled vs Uncontrolled — `10-controlled-uncontrolled/Demo.jsx`

**How it's implemented:**
```jsx
// controlled — React state is the source of truth
const [value, setValue] = useState('');
<input value={value} onChange={(e) => setValue(e.target.value)} />

// uncontrolled — the DOM owns the value
const inputRef = useRef(null);
<input ref={inputRef} defaultValue="" />
// read only when needed: inputRef.current.value
```
Controlled: React re-renders on every keystroke because `value` is
state — that's why the live character count in the demo works.
Uncontrolled: the input manages its own value silently; React only
looks at it once, via `ref`, when you choose to (here, on submit) —
fewer re-renders, less code, but no live access while typing.

**Real use cases:** Controlled — live validation, search-as-you-type,
password-strength meters, anything needing the current value before
submit. Uncontrolled — simple one-shot forms, and **file inputs**,
which React cannot control at all (`<input type="file">`'s value is
always DOM-owned) — the one case where uncontrolled isn't optional.
