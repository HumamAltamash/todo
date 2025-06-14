const Filter = ({ current, onChange }) => {
  return (
    <div className="filter-btns">
      {["all", "completed", "pending"].map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={current === f ? "active" : ""}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default Filter;
