import { useState, useRef } from "react";
import "./Game.css";
import Keyboard from "./Keyboard";

const Game = ({
  verifyLetter,
  pickedCategory,
  letters,
  guessedLetters,
  wrongLetters,
  guesses,
  score,
}) => {
  const [letter, setLetter] = useState("");
  const letterInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!letter) return;
    verifyLetter(letter);
    setLetter("");
    letterInputRef.current.focus();
  };

  return (
    <div className="game">
      <p className="points">
        <span>Pontuação</span>: {score}
      </p>
      <h2>Advinhe a palavra:</h2>
      <h3 className="tip">
        Dica: <span>{pickedCategory}</span>
      </h3>
      <p>Você ainda tem {guesses} tentativa(s).</p>

      <div className="wordContainer">
        {letters.map((ltr, i) =>
          guessedLetters.includes(ltr) ? (
            <span className="letter" key={i}>
              {ltr}
            </span>
          ) : (
            <span key={i} className="blankSquare"></span>
          )
        )}
      </div>

      <div className="letterContainer">
        <p>Tente adivinhar uma letra da palavra:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="letter"
            maxLength="1"
            onChange={(e) => setLetter(e.target.value)}
            required
            value={letter}
            ref={letterInputRef}
          />
          <button>Jogar!</button>
        </form>
      </div>

      <Keyboard
        onKeyPress={(k) => verifyLetter(k)}
        disabledKeys={[...guessedLetters, ...wrongLetters]}
      />

      <div className="wrongLettersContainer">
        <p>Letras já utilizadas:</p>
        {wrongLetters.map((ltr, i) => (
          <span key={i}>
            {ltr}
            {i < wrongLetters.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Game;
