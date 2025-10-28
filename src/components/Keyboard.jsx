import "./Keyboard.css";

const rows = [
  "qwertyuiop".split(""),
  "asdfghjkl".split(""),
  "zxcvbnm".split(""),
];

const Keyboard = ({ onKeyPress, disabledKeys = [] }) => {
  const handleClick = (k) => {
    if (disabledKeys.includes(k)) return;
    onKeyPress(k);
  };

  return (
    <div className="keyboard">
      {rows.map((row, i) => (
        <div key={i} className="kbd-row">
          {row.map((k) => (
            <button
              key={k}
              className="kbd-key"
              onClick={() => handleClick(k)}
              disabled={disabledKeys.includes(k)}
            >
              {k.toUpperCase()}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
