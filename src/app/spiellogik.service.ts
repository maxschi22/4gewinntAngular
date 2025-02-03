import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpiellogikService {
  gameBoard: string[][] = Array.from({ length: 6 }, () => Array(7).fill(''));
  currentPlayer: string = 'Rot'; // Startspieler

  // Methode, um den Spielstatus zu aktualisieren, wenn auf das Spielfeld geklickt wird
  handleClick(columnIndex: number): void {
    for (let row = 5; row >= 0; row--) {
      if (!this.gameBoard[row][columnIndex]) {
        this.gameBoard[row][columnIndex] = this.currentPlayer; // Setze den aktuellen Spieler
        //TODO- Hier muss geprüft werden ob es einen Gewinner gibt und dann das Spiel nach einem bestätigen Button zurückgesetzt werden
        //IDEE- Eventuell ein Playback des Spiels einbauen
        this.currentPlayer = this.currentPlayer === 'Rot' ? 'Gelb' : 'Rot'; // Wechsel den Spieler
        break;
      }
    }
  }

  // Methode, um die Klasse für jede Zelle zu setzen (z. B. 'red' oder 'yellow')
  getCellClass(rowIndex: number, columnIndex: number): string {
    const cell = this.gameBoard[rowIndex][columnIndex];
    return cell === 'Rot' ? 'red' : cell === 'Gelb' ? 'yellow' : '';
  }

  checkWinner() {
    //TODO- Hier kommt der Check für den Winner rein
  }
}
