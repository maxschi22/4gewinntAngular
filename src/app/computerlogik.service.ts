import { Injectable } from '@angular/core';
import { SpiellogikService } from './spiellogik.service';

@Injectable({
  providedIn: 'root',
})
export class ComputerlogikService {
  bestMove: number[] = [];
  maxDepth: number = 3; // Maximale Suchtiefe

  constructor(public spielService: SpiellogikService) {}

  makeComputerMove() {
    this.bestMove = [];
    let evaluation = this.maximize(0);
    let [bestRow, bestColumn] = this.bestMove;
    this.spielService.makeMove(bestRow, bestColumn);
    console.log(`evaluation: ${evaluation}`);
  }

  maximize(depth: number) {
    if (this.spielService.checkWinner()) {
      // Minimierender Spieler hat letzte Runde gewonnen
      return -1;
    }
    if (this.spielService.isBoardFull()) {
      // Unentschieden
      return 0;
    }
    if (depth >= this.maxDepth) {
      // Wenn die maximale Tiefe erreicht ist, bewerten
      return this.evaluateBoard();
    }

    let maxValue = -Infinity;
    const legalMoves = this.spielService.findLegalMoves();

    for (const [moveRow, moveColumn] of legalMoves) {
      this.spielService.makeMove(moveRow, moveColumn);
      let value = this.minimize(depth + 1);
      this.spielService.undoMove(moveRow, moveColumn);
      if (value > maxValue) {
        maxValue = value;
        if (depth === 0) {
          this.bestMove = [moveRow, moveColumn];
        }
      }
    }
    return maxValue;
  }

  minimize(depth: number) {
    if (this.spielService.checkWinner()) {
      // Minimierender Spieler hat letzte Runde gewonnen
      return 1;
    }
    if (this.spielService.isBoardFull()) {
      // Unentschieden
      return 0;
    }
    if (depth >= this.maxDepth) {
      // Wenn die maximale Tiefe erreicht ist, bewerten
      return this.evaluateBoard();
    }

    let minValue = +Infinity;
    const legalMoves = this.spielService.findLegalMoves();

    for (const [moveRow, moveColumn] of legalMoves) {
      this.spielService.makeMove(moveRow, moveColumn);
      let value = this.maximize(depth + 1);
      this.spielService.undoMove(moveRow, moveColumn);
      if (value < minValue) {
        minValue = value;
      }
    }
    return minValue;
  }

  // Beispielhafte Bewertungsfunktion
  evaluateBoard(): number {
    let score = 0;

    // Boardgröße
    const board = this.spielService.gameBoard; // 2D-Array des Spiels
    const rows = board.length;
    const cols = board[0].length;

    // Bewertungsfunktion für eine Reihe
    const evaluateLine = (line: string[]): number => {
      let score = 0;
      let playerCount = 0;
      let opponentCount = 0;
      let emptyCount = 0;

      for (let i = 0; i < line.length; i++) {
        if (line[i] === 'Computer') {
          playerCount++;
        } else if (line[i] === 'Gegner') {
          opponentCount++;
        } else {
          emptyCount++;
        }
      }

      // Bewertung für den Computer: +10 für jeden eigenen Stein in einer Reihe
      // Bewertung für den Gegner: -10 für jeden gegnerischen Stein in einer Reihe
      if (playerCount > 0 && opponentCount === 0) {
        score += playerCount * 10;
        if (emptyCount > 0) {
          score += emptyCount * 2; // Offene Zellen, die dem Computer helfen können
        }
      }

      // Bewertung für den Gegner: Negativ für die gleiche Logik
      if (opponentCount > 0 && playerCount === 0) {
        score -= opponentCount * 10;
        if (emptyCount > 0) {
          score -= emptyCount * 2; // Offene Zellen, die dem Gegner helfen können
        }
      }

      return score;
    };

    // Horizontale Bewertungen
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col <= cols - 4; col++) {
        let line = board[row].slice(col, col + 4); // Holt eine horizontale Linie
        score += evaluateLine(line);
      }
    }

    // Vertikale Bewertungen
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row <= rows - 4; row++) {
        let line = [];
        for (let i = 0; i < 4; i++) {
          line.push(board[row + i][col]); // Holt eine vertikale Linie
        }
        score += evaluateLine(line);
      }
    }

    // Diagonale Bewertungen (von links oben nach rechts unten)
    for (let row = 0; row <= rows - 4; row++) {
      for (let col = 0; col <= cols - 4; col++) {
        let line = [];
        for (let i = 0; i < 4; i++) {
          line.push(board[row + i][col + i]); // Diagonale von oben links nach unten rechts
        }
        score += evaluateLine(line);
      }
    }

    // Diagonale Bewertungen (von rechts oben nach links unten)
    for (let row = 0; row <= rows - 4; row++) {
      for (let col = 3; col < cols; col++) {
        let line = [];
        for (let i = 0; i < 4; i++) {
          line.push(board[row + i][col - i]); // Diagonale von oben rechts nach unten links
        }
        score += evaluateLine(line);
      }
    }

    return score;
  }
}
