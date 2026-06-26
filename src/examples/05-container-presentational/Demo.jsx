import { useEffect, useState } from 'react';

/**
 * CONTAINER / PRESENTATIONAL PATTERN
 * ----------------------------------------------------------------
 * WHAT: Split a feature into two components:
 *  - Container: owns data fetching/state/logic, has no markup of its own.
 *  - Presentational: pure render function of its props, no idea where
 *    the data came from.
 *
 * WHY: The presentational half can be reused with any data source (real
 * API, mock, websocket) and is trivial to visually test in isolation.
 * The container can change its data source without touching the UI.
 *
 * USE CASES: any "smart widget" — weather, stock ticker, user list —
 * where you want to swap data sources without touching the view, or
 * reuse the view with multiple different containers.
 * ----------------------------------------------------------------
 */

// --- Presentational: pure, only knows about props ---
function WeatherView({ loading, error, data }) {
  if (loading) return <p className="small">Loading weather…</p>;
  if (error) return <p className="small" style={{ color: 'var(--danger)' }}>{error}</p>;
  return (
    <div className="card">
      <div style={{ fontSize: '2rem' }}>{data.icon}</div>
      <b>{data.city}</b>
      <p className="small" style={{ margin: '4px 0 0' }}>
        {data.tempC}°C, {data.condition}
      </p>
    </div>
  );
}

// --- Container: owns the "fetch" (simulated here), passes plain props down ---
function WeatherContainer({ city }) {
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    setState({ loading: true, error: null, data: null });
    const timer = setTimeout(() => {
      // simulated API response — swap this block for a real fetch() and
      // WeatherView would never need to change.
      const mock = {
        Tokyo: { tempC: 27, condition: 'Clear', icon: '☀️' },
        London: { tempC: 16, condition: 'Drizzle', icon: '🌦️' },
        Nairobi: { tempC: 22, condition: 'Partly cloudy', icon: '⛅' },
      }[city];

      if (!mock) {
        setState({ loading: false, error: 'City not found', data: null });
      } else {
        setState({ loading: false, error: null, data: { city, ...mock } });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [city]);

  return <WeatherView {...state} />;
}

export default function ContainerPresentationalDemo() {
  const [city, setCity] = useState('Tokyo');

  return (
    <div>
      <div className="row" style={{ marginBottom: 12 }}>
        {['Tokyo', 'London', 'Nairobi'].map((c) => (
          <button
            key={c}
            onClick={() => setCity(c)}
            style={{ borderColor: city === c ? 'var(--accent)' : 'var(--line)' }}
          >
            {c}
          </button>
        ))}
      </div>
      <WeatherContainer city={city} />
      <p className="small" style={{ marginTop: 10 }}>
        WeatherContainer simulates an API call and owns loading/error state.
        WeatherView has no idea data is fake — it would render identically
        with a real fetch() call swapped in.
      </p>
    </div>
  );
}
