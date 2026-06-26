import { createContext, useContext, useReducer } from 'react';

/**
 * REDUX PATTERN (Global State Management) — useReducer + Context
 * ----------------------------------------------------------------
 * WHAT: Take the same reducer idea from the previous example, but lift
 * it into Context so ANY component in the tree can dispatch actions or
 * read state — not just the one component that called useReducer.
 * This is exactly the shape Redux popularized (store, actions, reducer,
 * dispatch), built from plain React with no extra library.
 *
 * WHY: Below, `CartBadge` and `ProductGrid` are siblings with no direct
 * relationship — yet adding a product in ProductGrid instantly updates
 * the count in CartBadge. Neither passes props to the other; both talk
 * to the same store.
 *
 * USE CASES: shopping cart, notifications, current user/session, any
 * state genuinely needed across distant, unrelated parts of the app.
 * For very large apps, this is also exactly when reaching for the real
 * Redux Toolkit library starts to pay off (devtools, middleware, etc).
 * ----------------------------------------------------------------
 */

// 1. reducer — pure function, no React
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, count: state.count + 1, total: state.total + action.price };
    case 'RESET':
      return { count: 0, total: 0 };
    default:
      return state;
  }
}

// 2. the "store" — Context + useReducer, provided once at the top
const StoreContext = createContext(null);

function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { count: 0, total: 0 });
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside a StoreProvider');
  return ctx;
}

// 3. components that are NOT related to each other, both touching the store
function CartBadge() {
  const { state, dispatch } = useStore();
  return (
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <span>
        🛒 Cart: <b>{state.count}</b> items (${state.total})
      </span>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}

function ProductGrid() {
  const { dispatch } = useStore();
  const products = [
    { name: 'Sticker pack', price: 5 },
    { name: 'Mug', price: 12 },
    { name: 'T-shirt', price: 20 },
  ];
  return (
    <div className="row" style={{ marginTop: 10 }}>
      {products.map((p) => (
        <button key={p.name} onClick={() => dispatch({ type: 'ADD', price: p.price })}>
          Add {p.name} (${p.price})
        </button>
      ))}
    </div>
  );
}

export default function ReduxPatternDemo() {
  return (
    <StoreProvider>
      <div className="card">
        <CartBadge />
        <ProductGrid />
        <p className="small" style={{ marginTop: 10, marginBottom: 0 }}>
          CartBadge and ProductGrid are unrelated siblings. Clicking "Add"
          in ProductGrid updates CartBadge instantly — both dispatch into /
          read from the same dispatcher, never through each other.
        </p>
      </div>
    </StoreProvider>
  );
}
