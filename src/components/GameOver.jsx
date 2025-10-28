import "./GameOver.css";

const GameOver = ({ retry, score }) => {
  const highScore = localStorage.getItem("highscore") || 0;

  return (
    <div className="gameover">
      <h1>Fim de jogo!</h1>
      <h2>
        A sua pontuação foi: <span>{score}</span>!
      </h2>
      <h3>
        Pontuação Máxima: <span>{highScore}</span>
      </h3>
      <button onClick={retry}>Tentar Novamente</button>
    </div>
  );
};

export default GameOver;
