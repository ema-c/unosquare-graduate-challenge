
const gameController = require("../game");
const {isLetterIncludedInWord} = require("../game")

const mockId = 'fda56100-0ddb-4f06-9ea4-7c1919ff6d2f';
jest.mock("uuid", () => ({ v4: () => mockId }));


describe("game controller", () => {
  describe("createGame", () => {
    it("Should return identifier when game created", () => {
      const id = uuid();
      const req = {
      };
      const res = {
        send: jest.fn()
      };

      gameController.createGame(req, res);

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith(id);
    });
  });


  

  describe("createGuess", () => {
    it("Should reveal the letter if the guess was true", () => {

      const unmaskedWord = "Banana";
      const word = unmaskedWord.replaceAll(/[a-zA-Z0-9]/g, "_");
      const status = "In Progress"; //have lives 
      let incorrectGuesses= [];
      const req = {
        params: {
          gameId: mockId
        },
        body:
          { letter: "a" }
      };
      const res = {
        send: jest.fn()
      };

      req.body.letter="a";
      gameController.createGuess(req, res);

      expect(res.send).body.word.toBeEqual("_a_a_a")

      req.body.letter="B";
      gameController.createGuess(req, res);

      expect(res.send).body.word.toBeEqual("Ba_a_a")

      

    });
    it("Should return true if letter is included in the word", () => {
      const word = "Banana";
      const letter = "e";
      const result = isLetterIncludedInWord(letter,word);
      expect(result).toBe(false)

       expect(res.send).toHaveBeenCalledTimes(1);
       expect(res.send).toHaveBeenCalledWith(id);
     });
  });
});