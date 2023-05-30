const { v4: uuid } = require("uuid");

const words = ["Banana", "Canine", "Unosquare", "Airport"];
const games = {};

const retrieveWord = () => words[Math.floor(Math.random(words.length - 1))];

const clearUnmaskedWord = (game) => {
  const withoutUnmasked = {
    ...game,
  };
  delete withoutUnmasked.unmaskedWord;
  return withoutUnmasked;
};

function createGame(req, res) {
  const newGameWord = retrieveWord();
  const newGameId = uuid();
  const newGame = {
    remainingGuesses: 6,
    unmaskedWord: newGameWord,
    word: newGameWord.replaceAll(/[a-zA-Z0-9]/g, "_"),
    status: "In Progress",
    incorrectGuesses: [],
  };

  games[newGameId] = newGame;

  res.send(newGameId);
}

function getGame(req, res) {
  const { gameId } = req.params;
  if (!gameId) return res.sendStatus(404);

  var game = games[gameId];
  if (!game) {
    return res.sendStatus(404);
  }

  res.status(200).json(clearUnmaskedWord(game));
}

function createGuess(req, res) {
  const { gameId } = req.params;
  const { letter } = req.body;

  if (!gameId) return res.sendStatus(404);

  var game = games[gameId];
  if (!game) return res.sendStatus(404);

  if (!letter || letter.length != 1) {
    return res.status(400).json({
      Message: "Guess must be supplied with 1 letter",
    });
  }

  // todo: add logic for making a guess, modifying the game and updating the status

  const isLetterIncludedInWord = (letter, word) => {
    if (word.includes(letter)) {
      return true;
    }
    return false;
  };

  if (game.status !== "In Progress") {
    return res.status(400).json({
      Message: "Game already ended",
    });
  }

  //0. already guessed
  if (
    isLetterIncludedInWord(letter, game.word) ||
    isLetterIncludedInWord(letter, game.incorrectGuesses)
  ) {
    return res.status(400).json({
      Message: "Already used this letter",
    });
  }
  if (isLetterIncludedInWord(letter, game.unmaskedWord)) {
    for (let i = 0; i < game.word.length; i++) {
      //turn underscore into letter
      if (game.unmaskedWord[i] === letter) {
        game.word.replace("_", letter);
        console.log("corect letter ", letter);
      }
    }
  }
  //2. if letter wrong
  if (!isLetterIncludedInWord(letter, game.unmaskedWord)) {
    game.remainingGuesses -= 1;
    game.incorrectGuesses.push(letter);
  }

  // if status is LOST
  if (game.remainingGuesses <= 0) {
    return res.status(200).json({
      ...clearUnmaskedWord(game),
      status: "Lost",
    });
  }
  // if status is WIN ()
  if (game.unmaskedWord === game.word && game.remainingGuesses > 0) {
    //toUpperCase
    return res.status(200).json({
      ...clearUnmaskedWord(game),
      status: "WIN",
    });
  }

  return res.status(200).json(clearUnmaskedWord(game));
}

function deleteGame(req, res) {
  const { gameId } = req.params;
  if (!gameId) return res.sendStatus(204);

  var game = games[gameId];
  if (!game) {
    return res.sendStatus(204);
  }

  res.status(200).json(clearUnmaskedWord(game));
}

module.exports = {
  createGame,
  getGame,
  createGuess,
  deleteGame,
};
