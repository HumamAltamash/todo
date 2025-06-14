import React from "react";

const Filter = ({ current, onChange }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {["all", "completed", "pending"].map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            fontWeight: current === f ? "bold" : "normal",
            marginRight: "0.5rem",
          }}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default Filter;
