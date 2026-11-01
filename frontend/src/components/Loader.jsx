import { useState, useEffect } from "react";
import { Bouncy } from "ldrs/react";
import "ldrs/react/Bouncy.css";

const MESSAGES = [
  "Reading your documents...",
  "Comparing sentences...",
  "Calculating similarity scores...",
  "Preparing your report...",
];

export default function Loader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loader-overlay">
      <Bouncy size="55" speed="1.75" color="#56b473" />
      <h2 className="loader-title">Analyzing Documents</h2>
      <p className="loader-message">{MESSAGES[index]}</p>
      <span className="loader-hint">This may take a few moments. Please don't close this page.</span>
    </div>
  );
}