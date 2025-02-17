import { Injectable } from '@angular/core';
import { SpiellogikService } from './spiellogik.service';

@Injectable({
  providedIn: 'root',
})
export class ComputerlogikService {
  bestMove: number[] = [];
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
      //minimierender Spieler hat letzte Runde gewonnen.
      return -1;
    }
    if (this.spielService.isBoardFull()) {
      //untentschieden
      return 0;
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
      //minimierender Spieler hat letzte Runde gewonnen.
      return 1;
    }
    if (this.spielService.isBoardFull()) {
      //untentschieden
      return 0;
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
}
