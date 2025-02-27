import { Injectable } from '@angular/core';
import { SpiellogikService } from './spiellogik.service';

@Injectable({
  providedIn: 'root',
})
export class ComputerlogikService {
  bestMove: number[] = [];
  maxDepth: number = 7;

  constructor(public spielService: SpiellogikService) {}

  makeComputerMove() {
    console.log(this.maxDepth);
    this.bestMove = [];
    // den aktuellen Spieler für die Simulation nutzen
    const currentPlayer = this.spielService.currentPlayer;
    // Sicherstellen, dass der Computer der aktuelle Spieler für die Simulation ist
    this.spielService.currentPlayer = this.spielService.COMPUTER_PLAYER;

    let evaluation = this.minimax(0, true);

    // Original Spieler herstellen
    this.spielService.currentPlayer = currentPlayer;

    // besten Move der gefunden wurde durchführen
    if (this.bestMove.length === 2) {
      let [bestRow, bestColumn] = this.bestMove;
      this.spielService.makeMove(bestRow, bestColumn);
      this.spielService.switchPlayer();
      console.log(
        `Computer wählt: Feld [${bestColumn}, ${bestRow}] mit Bewertung: ${evaluation}`
      );
    } else {
      console.error('Kein Gültigen Zug für Computer gefunden!');
    }

    const winner = this.spielService.checkWinner();
    if (winner) {
      this.spielService.handleWinner(winner);
      console.log(`Spiel vorbei! Gewinner: ${winner}`);
    } else if (!winner && this.spielService.isBoardFull()) {
      this.spielService.handleDraw();
    }
  }

  minimax(depth: number, isMaximizing: boolean): number {
    // Check terminal states
    if (this.spielService.checkWinner()) {
      return isMaximizing ? -1000 : 1000; // If winner found, previous move caused it
    }

    if (this.spielService.isBoardFull()) {
      return 0; // Draw
    }

    if (depth >= this.maxDepth) {
      return this.evaluateBoard();
    }

    const legalMoves = this.spielService.findLegalMoves();

    if (isMaximizing) {
      // Computerzug (maximizing)
      let maxEval = -Infinity;

      for (const [moveRow, moveColumn] of legalMoves) {
        // Aktuellen Status speichern
        const originalPlayer = this.spielService.currentPlayer;

        // Make move as computer
        this.spielService.currentPlayer = this.spielService.COMPUTER_PLAYER;
        this.spielService.makeMove(moveRow, moveColumn);

        // Evaluate this move
        const evaluation = this.minimax(depth + 1, false);

        // Undo move
        this.spielService.undoMove(moveRow, moveColumn);
        this.spielService.currentPlayer = originalPlayer;

        // Update best move
        if (evaluation > maxEval) {
          maxEval = evaluation;
          if (depth === 0) {
            this.bestMove = [moveRow, moveColumn];
          }
        }
      }

      return maxEval;
    } else {
      // Spieler an der Reihe (minimizing)
      let minEval = Infinity;

      for (const [moveRow, moveColumn] of legalMoves) {
        // Save current state
        const originalPlayer = this.spielService.currentPlayer;

        // Make move as human
        this.spielService.currentPlayer = this.spielService.HUMAN_PLAYER;
        this.spielService.makeMove(moveRow, moveColumn);

        // Evaluate this move
        const evaluation = this.minimax(depth + 1, true);

        // Undo move
        this.spielService.undoMove(moveRow, moveColumn);
        this.spielService.currentPlayer = originalPlayer;

        // Update best value
        minEval = Math.min(minEval, evaluation);
      }

      return minEval;
    }
  }

  evaluateBoard(): number {
    let score = 0;
    const board = this.spielService.gameBoard;
    const rows = board.length;
    const cols = board[0].length;

    // Helferfunktion um Spielerwert zu erhalten
    const getPlayerValue = (cell: any): number => {
      if (cell === this.spielService.COMPUTER_PLAYER) return 1; // Computer
      if (cell === this.spielService.HUMAN_PLAYER) return -1; // Gegner
      return 0; //leer
    };

    // Bewertung
    const evaluateWindow = (window: any[]): number => {
      let computerCount = 0;
      let opponentCount = 0;
      let emptyCount = 0;

      window.forEach((cell) => {
        const value = getPlayerValue(cell);
        if (value === 1) computerCount++;
        else if (value === -1) opponentCount++;
        else emptyCount++;
      });

      if (computerCount === 4) return 1000;
      if (opponentCount === 4) return -100;
      if (computerCount === 3 && emptyCount === 1) return 5;
      if (opponentCount === 3 && emptyCount === 1) return -5;
      if (computerCount === 2 && emptyCount === 2) return 2;
      if (opponentCount === 2 && emptyCount === 2) return -2;
      return 0;
    };

    // Horizontal
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= cols - 4; c++) {
        const window = board[r].slice(c, c + 4);
        score += evaluateWindow(window);
      }
    }

    // Vertikal
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r <= rows - 4; r++) {
        const window = [
          board[r][c],
          board[r + 1][c],
          board[r + 2][c],
          board[r + 3][c],
        ];
        score += evaluateWindow(window);
      }
    }

    // Diagonal links oben nach rechts unten
    for (let r = 0; r <= rows - 4; r++) {
      for (let c = 0; c <= cols - 4; c++) {
        const window = [
          board[r][c],
          board[r + 1][c + 1],
          board[r + 2][c + 2],
          board[r + 3][c + 3],
        ];
        score += evaluateWindow(window);
      }
    }

    // Diagonal rechts oben nach links unten
    for (let r = 0; r <= rows - 4; r++) {
      for (let c = 3; c < cols; c++) {
        const window = [
          board[r][c],
          board[r + 1][c - 1],
          board[r + 2][c - 2],
          board[r + 3][c - 3],
        ];
        score += evaluateWindow(window);
      }
    }

    return score;
  }
}
