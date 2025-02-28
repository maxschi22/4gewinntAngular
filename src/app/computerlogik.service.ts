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

    // besten Move der gefunden wurde X/Y durchführen
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
    // Gewinner prüfen
    if (this.spielService.checkWinner()) {
      return isMaximizing ? -1000 : 1000;
    }

    if (this.spielService.isBoardFull()) {
      return 0; // Unentschieden
    }

    // Wenn maximale Tiefe erreicht ist, bewerte das Board
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

        // Move ausführen
        this.spielService.currentPlayer = this.spielService.COMPUTER_PLAYER;
        this.spielService.makeMove(moveRow, moveColumn);

        // Move bewerten
        const evaluation = this.minimax(depth + 1, false);

        // Move Rückgängig machen
        this.spielService.undoMove(moveRow, moveColumn);
        this.spielService.currentPlayer = originalPlayer;

        // Besten Move updaten
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
        // Aktuellen Status speichern
        const originalPlayer = this.spielService.currentPlayer;

        // Move ausführen
        this.spielService.currentPlayer = this.spielService.HUMAN_PLAYER;
        this.spielService.makeMove(moveRow, moveColumn);

        // Move bewerten
        const evaluation = this.minimax(depth + 1, true);

        // Move Rückgängig machen
        this.spielService.undoMove(moveRow, moveColumn);
        this.spielService.currentPlayer = originalPlayer;

        // Besten Move updaten
        minEval = Math.min(minEval, evaluation);
      }

      return minEval;
    }
  }

  //Durchsucht das Spielfeld nach möglichen 4er Reihen und bewertet diese
  evaluateBoard(): number {
    let score = 0; //gesamtpunktestand für das Spielfeld
    const board = this.spielService.gameBoard; //aktuelles Spielfeld
    const rows = board.length; // Reihen im Spielfeld
    const cols = board[0].length; // Spalten im Spielfeld

    // Helferfunktion, um den Wert eines Spielers zu bestimmen
    const getPlayerValue = (cell: any): number => {
      if (cell === this.spielService.COMPUTER_PLAYER) return 1; // Der Computer wird mit +1 bewertet
      if (cell === this.spielService.HUMAN_PLAYER) return -1; // Der menschliche Spieler wird mit -1 bewertet
      return 0; // Leere Felder = 0
    };

    // Bewertet Teilsequenzen des Spielfelds
    const evaluateWindow = (window: any[]): number => {
      let computerCount = 0; // felder die der computer belegt hat
      let opponentCount = 0; // felder die der spieler belegt hat
      let emptyCount = 0;

      // Zähle die Spielsteine im aktuellen Fenster
      window.forEach((cell) => {
        const value = getPlayerValue(cell);
        if (value === 1) computerCount++;
        else if (value === -1) opponentCount++;
        else emptyCount++;
      });

      // Bewertung des Fensters je nach Anzahl der Spielsteine
      if (computerCount === 4) return 1000; // Computer gewinnt
      if (opponentCount === 4) return -100; // Spieler gewinnt
      if (computerCount === 3 && emptyCount === 1) return 10; // gute Position für den Computer
      if (opponentCount === 3 && emptyCount === 1) return -10; // gefährlich für den Computer
      if (computerCount === 2 && emptyCount === 2) return 2; // leichte Chance
      if (opponentCount === 2 && emptyCount === 2) return -2; // kleine Gefahr
      return 0; // Keine relevante Sequenz
    };

    // horizontale bewertung
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= cols - 4; c++) {
        const window = board[r].slice(c, c + 4);
        score += evaluateWindow(window);
      }
    }

    // vertikale bewertung
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

    // Diagonal links nach rechts
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

    // diagonal rechts nach links
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

    return score; //Gesamtbewertung ausgeben
  }
}
