import { useCallback, useEffect, useState } from "react";
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";
import "./App.css";
import { wordsList } from "./data/words";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return tmp.textContent || tmp.innerText || "";
}

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);

  const [difficulty, setDifficulty] = useState("medio"); // 'facil', 'medio', 'dificil'

  const pickFromLocal = useCallback(() => {
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];
    return { category, word, hint: category };
  }, [words]);

  const pickWordAndCategory = useCallback(async () => {
    // Try fetching from Dicionario Aberto (API em português) for a random entry
    try {
      const res = await fetch("https://api.dicionario-aberto.net/random");
      if (!res.ok) throw new Error("API falhou");
      const data = await res.json();
      // data is an array; pick the first entry if available
      const entry = Array.isArray(data) ? data[0] : data;
      const word = entry && entry.word ? entry.word.toLowerCase() : null;
      const sensePreview =
        entry && entry.preview ? stripHtml(entry.preview) : "";
      if (word) {
        return {
          category: "aleatória",
          word,
          hint: sensePreview || "Dica: palavra aleatória",
        };
      }
      throw new Error("Resposta inválida da API");
    } catch (err) {
      // fallback local
      return pickFromLocal();
    }
  }, [pickFromLocal]);

  const startGame = useCallback(
    async (chosenDifficulty) => {
      setGuessedLetters([]);
      setWrongLetters([]);

      const { category, word, hint } = await pickWordAndCategory();

      let wordLetters = word.split("");
      wordLetters = wordLetters.map((l) => l.toLowerCase());

      setPickedCategory(hint || category);
      setPickedWord(word);
      setLetters(wordLetters);

      setDifficulty(chosenDifficulty || "medio");
      const initialGuesses =
        chosenDifficulty === "facil"
          ? 5
          : chosenDifficulty === "dificil"
          ? 2
          : 3;
      setGuesses(initialGuesses);

      setGameStage(stages[1].name);
    },
    [pickWordAndCategory]
  );

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actual) => [...actual, normalizedLetter]);
    } else {
      setWrongLetters((actual) => [...actual, normalizedLetter]);
      setGuesses((actual) => actual - 1);
    }
  };

  const retry = () => {
    setScore(0);
    setGuesses(3);
    setGameStage(stages[0].name);
  };

  useEffect(() => {
    if (guesses === 0) {
      const currentHighScore = parseInt(localStorage.getItem("highscore")) || 0;
      if (score > currentHighScore) {
        localStorage.setItem("highscore", score);
      }
      setGuessedLetters([]);
      setWrongLetters([]);
      setGameStage(stages[2].name);
    }
  }, [guesses, score]);

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];
    if (letters.length > 0 && guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => (actualScore += 100));
      startGame(difficulty);
    }
  }, [guessedLetters, letters, startGame, difficulty]);

  return (
    <div className="App container">
      <div className="header">
      </div>

      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
