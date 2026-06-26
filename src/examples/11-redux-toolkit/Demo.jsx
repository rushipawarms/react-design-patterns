import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store.js';
import { add, reset } from './cartSlice.js';

function CartBadge() {
  const { count, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  return (
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <span>🛒 Cart: <b>{count}</b> items (${total})</span>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  );
}

function ProductGrid() {
  const dispatch = useDispatch();
  const products = [
    { name: 'Sticker pack', price: 5 },
    { name: 'Mug', price: 12 },
    { name: 'T-shirt', price: 20 },
  ];
  return (
    <div className="row" style={{ marginTop: 10 }}>
      {products.map((p) => (
        <button key={p.name} onClick={() => dispatch(add({ price: p.price }))}>
          Add {p.name} (${p.price})
        </button>
      ))}
    </div>
  );
}

export default function ReduxToolkitDemo() {
  return (
    <Provider store={store}>
      <div className="card">
        <CartBadge />
        <ProductGrid />
      </div>
    </Provider>
  );
}