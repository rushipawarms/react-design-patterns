import { useReducer } from 'react';

/**
 * useReducer HOOK PATTERN
 * ----------------------------------------------------------------
 * WHAT: `const [state, dispatch] = useReducer(reducer, initialState)`.
 * Instead of many useState calls + scattered update logic, all updates
 * go through one pure function: (state, action) -> newState.
 *
 * WHY: This example has 3 related pieces of state (items, a running
 * total, a count) that always change together. useReducer keeps every
 * valid transition in one place, instead of risking them getting out of
 * sync across multiple setState calls.
 *
 * NOTE: this is LOCAL to one component — contrast with the next example
 * (Redux Pattern), which lifts the same idea into Context so many
 * components can share it.
 *
 * USE CASES: forms with interdependent fields, multi-step wizards, any
 * state with several "this changes only via these specific actions"
 * transitions.
 * ----------------------------------------------------------------
 */
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const items = [...state.items, { name: action.name, price: action.price }];
      return { items, total: state.total + action.price };
    }
    case 'REMOVE_LAST': {
      if (state.items.length === 0) return state;
      const items = state.items.slice(0, -1);
      const removed = state.items[state.items.length - 1];
      return { items, total: state.total - removed.price };
    }
    case 'CLEAR':
      return { items: [], total: 0 };
    default:
      return state;
  }
}

const catalogue = [
  { name: 'Coffee', price: 4 },
  { name: 'Croissant', price: 3 },
  { name: 'Sandwich', price: 7 },
];

export default function UseReducerDemo() {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  return (
    <div>
      <div className="row" style={{ marginBottom: 12 }}>
        {catalogue.map((item) => (
          <button key={item.name} onClick={() => dispatch({ type: 'ADD_ITEM', ...item })}>
            + {item.name} (${item.price})
          </button>
        ))}
      </div>

      <div className="card">
        {cart.items.length === 0 ? (
          <p className="small" style={{ margin: 0 }}>Cart is empty.</p>
        ) : (
          cart.items.map((it, i) => (
            <div key={i} className="row" style={{ justifyContent: 'space-between' }}>
              <span className="small">{it.name}</span>
              <span className="small">${it.price}</span>
            </div>
          ))
        )}
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
          <b>Total</b>
          <b>${cart.total}</b>
        </div>
      </div>

      <div className="row" style={{ marginTop: 10 }}>
        <button onClick={() => dispatch({ type: 'REMOVE_LAST' })}>Undo last</button>
        <button onClick={() => dispatch({ type: 'CLEAR' })}>Clear cart</button>
      </div>
    </div>
  );
}
