import { Suspense, useState } from 'react';
import { examples } from './registry.js';

export default function App() {
  const [activeId, setActiveId] = useState(examples[0].id);
  const active = examples.find((e) => e.id === activeId);

  return (
    <div className="shell">
      <aside className="sidebar">
        <h1>React Patterns</h1>
        <p className="tagline">Ten patterns, each its own runnable example.</p>
        <nav>
          {examples.map((ex, i) => (
            <button
              key={ex.id}
              className={'nav-btn' + (ex.id === activeId ? ' active' : '')}
              onClick={() => setActiveId(ex.id)}
            >
              <span className="nav-num">{String(i + 1).padStart(2, '0')}</span>
              {ex.title}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        <span className="pattern-label">{active.useCase}</span>
        <h2>{active.title}</h2>
        <p className="desc">{active.summary}</p>

        <section className="block">
          <Suspense fallback={<p className="small">Loading example…</p>}>
            <active.Demo />
          </Suspense>
        </section>

        <p className="small" style={{ opacity: 0.7 }}>
          Source: <code>src/examples/{String(examples.findIndex(e=>e.id===activeId)+1).padStart(2,'0')}-{activeId}/Demo.jsx</code>
          {' '}— fully self-contained, no imports from other examples.
        </p>
      </main>
    </div>
  );
}
