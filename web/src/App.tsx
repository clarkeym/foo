import { useEffect, useMemo, useState } from "react";
import "./App.css";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const isObject = (value: JsonValue): value is { [key: string]: JsonValue } => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const renderJsonValue = (
  value: JsonValue,
  label?: string,
  nodeKey = "root",
): React.ReactNode => {
  const displayLabel = label ? (
    <span className="json-key">{label}: </span>
  ) : null;

  if (Array.isArray(value)) {
    return (
      <li key={nodeKey}>
        {displayLabel}
        <details open>
          <summary>[{value.length}]</summary>
          <ul className="json-tree">
            {value.map((item, index) =>
              renderJsonValue(item, String(index), `${nodeKey}-${index}`),
            )}
          </ul>
        </details>
      </li>
    );
  }

  if (isObject(value)) {
    const entries = Object.entries(value);
    return (
      <li key={nodeKey}>
        {displayLabel}
        <details open>
          <summary>{`{${entries.length}}`}</summary>
          <ul className="json-tree">
            {entries.map(([key, nestedValue]) =>
              renderJsonValue(nestedValue, key, `${nodeKey}-${key}`),
            )}
          </ul>
        </details>
      </li>
    );
  }

  return (
    <li key={nodeKey}>
      {displayLabel}
      <span className="json-primitive">{String(value)}</span>
    </li>
  );
};

function App() {
  const [count, setCount] = useState(0);
  const [helloMessage, setHelloMessage] = useState("Loading...");
  const [facts, setFacts] = useState("Loading...");

  useEffect(() => {
    const fetchHello = async () => {
      try {
        const response = await fetch("/.netlify/functions/hello");
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const text = await response.text();
        setHelloMessage(text);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unexpected error occurred";
        setHelloMessage(`Error: ${message}`);
      }
    };

    void fetchHello();
  }, []);

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        const response = await fetch("/.netlify/functions/facts");
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const value = await response.text();
        setFacts(value);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unexpected error occurred";
        setFacts(`Error: ${message}`);
      }
    };
    void fetchFacts();
  }, []);

  const parsedFacts = useMemo(() => {
    try {
      return JSON.parse(facts) as JsonValue;
    } catch {
      return null;
    }
  }, [facts]);

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
          <p>Function response: {helloMessage}</p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      {parsedFacts !== null ? (
        <section className="facts-panel" aria-live="polite">
          <h2>Facts</h2>
          <ul className="json-tree">{renderJsonValue(parsedFacts)}</ul>
        </section>
      ) : (
        <pre>{facts}</pre>
      )}

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default App;
