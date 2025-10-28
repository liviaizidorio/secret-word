import "./StartScreen.css";

const StartScreen = ({ startGame }) => {
  const handleStart = (difficulty) => {
    startGame(difficulty);
  };

  return (
    <div className="start">
      <h2>Secret Word</h2>
      <p>Escolha a dificuldade antes de começar:</p>
      <div className="diffs">
        <button onClick={() => handleStart("facil")}>Fácil (5 vidas)</button>
        <button onClick={() => handleStart("medio")}>Médio (3 vidas)</button>
        <button onClick={() => handleStart("dificil")}>
          Difícil (2 vidas)
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
