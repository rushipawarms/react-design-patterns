import { useState } from 'react';

/**
 * HIGHER-ORDER COMPONENT (HOC) PATTERN
 * ----------------------------------------------------------------
 * WHAT: A function that takes a component and returns a new component
 * with extra behavior layered on top:  withX(Component) -> EnhancedComponent
 *
 * WHY: Cross-cutting concerns (auth checks, logging, analytics, loading
 * states) get written once and applied to any component, without that
 * component ever knowing the concern exists.
 *
 * USE CASES: requireAuth(Page), withLogging(Component),
 * withErrorBoundary(Component), withTheme(Component, older-style).
 * Modern React often prefers hooks for this, but HOCs are still common,
 * especially around routing/auth in many production codebases.
 * ----------------------------------------------------------------
 */

// the HOC itself — generic, knows nothing about what it wraps
function withAuthGuard(WrappedComponent) {
  return function Guarded({ isLoggedIn, onLogin, ...rest }) {
    if (!isLoggedIn) {
      return (
        <div className="login-box">
          <p className="small" style={{ margin: 0 }}>
            🔒 You must be signed in to view this.
          </p>
          <button className="primary" onClick={onLogin}>
            Sign in
          </button>
        </div>
      );
    }
    return <WrappedComponent {...rest} />;
  };
}

// withLogging — a second HOC, to show they can be combined/stacked
function withLogging(WrappedComponent, label) {
  return function Logged(props) {
    console.log(`[render] ${label}`);
    return <WrappedComponent {...props} />;
  };
}

// a plain component with zero knowledge of auth or logging
function Profile({ name }) {
  return (
    <div className="card">
      <b>{name}</b>
      <p className="small" style={{ margin: '6px 0 0' }}>
        This component has no idea it's protected — that's entirely the
        HOC's job.
      </p>
    </div>
  );
}

// stack both HOCs — order matters: logging wraps the guarded component
//const GuardedProfile = withLogging(withAuthGuard(Profile), 'GuardedProfile');mutilple Component stacked or combined together.
const GuardedProfile = withAuthGuard(Profile);

export default function HOCDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <GuardedProfile isLoggedIn={isLoggedIn} onLogin={() => setIsLoggedIn(true)} name="Asha Patel" />
      {isLoggedIn && (
        <p className="small" style={{ marginTop: 10 }}>
          <button onClick={() => setIsLoggedIn(false)}>Log out</button>{' '}
          (open the console — withLogging fires on every render)
        </p>
      )}
    </div>
  );
}
