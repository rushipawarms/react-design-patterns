/**
 * COMPONENT COMPOSITION PATTERN
 * ----------------------------------------------------------------
 * WHAT: Build generic "shell" components that accept `children` (and
 * named slots like `header`/`footer`) instead of components with many
 * boolean/config props trying to anticipate every layout.
 *
 * WHY: `Panel` below knows nothing about forms, lists, or stats — it just
 * arranges whatever you hand it. Each usage below passes wildly different
 * content into the exact same shell, with zero changes to Panel itself.
 *
 * USE CASES: Card/Panel/Modal shells, page layouts (Sidebar+Content),
 * any "frame" component reused across a dozen different features.
 * ----------------------------------------------------------------
 */

function Panel({ header, footer, children }) {
  return (
    <div className="card">
      {header && (
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '.9rem' }}>{header}</div>
      )}
      <div>{children}</div>
      {footer && (
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
          {footer}
        </div>
      )}
    </div>
  );
}

// Small composable pieces, also used as children rather than props:
function StatRow({ label, value }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between', padding: '4px 0' }}>
      <span className="small">{label}</span>
      <b>{value}</b>
    </div>
  );
}

export default function CompositionDemo() {
  return (
    <div className="row" style={{ alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
      {/* Usage 1: Panel wraps a small stats block */}
      <div style={{ flex: '1 1 220px' }}>
        <Panel header="Account stats" footer={<span className="small">Updated just now</span>}>
          <StatRow label="Storage used" value="42 GB" />
          <StatRow label="Active sessions" value="3" />
          <StatRow label="Plan" value="Pro" />
        </Panel>
      </div>

      {/* Usage 2: same Panel, completely different children — a form */}
      <div style={{ flex: '1 1 220px' }}>
        <Panel
          header="Quick feedback"
          footer={<button className="primary">Send</button>}
        >
          <textarea
            placeholder="What's on your mind?"
            rows={3}
            style={{ width: '100%', resize: 'vertical' }}
          />
        </Panel>
      </div>

      {/* Usage 3: nesting Panels inside Panels — composition all the way down */}
      <div style={{ flex: '1 1 220px' }}>
        <Panel header="Nested panels">
          <StatRow label="Storage used" value="42 GB" />
          <Panel header="Inner panel">
            <p className="small" style={{ margin: 0 }}>
              Panel doesn't care that it's inside another Panel — composition
              means components don't need to know their context.
              
            </p>
          </Panel>
        </Panel>
      </div>
    </div>
  );
}
