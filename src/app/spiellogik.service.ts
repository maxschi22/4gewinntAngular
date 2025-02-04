import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpiellogikService {
  currentPlayer: string = 'Rot'; // Startspieler
  gameBoard: string[][]; // Deklaration des Spielbretts

  constructor() {
    // Erstelle ein leeres Spielbrett mit 6 Zeilen und 7 Spalten
    const rows = 6;
    const cols = 7;
    this.gameBoard = []; // Initialisiere das Spielbrett als leeres Array

    for (let r = 0; r < rows; r++) {
      const row = []; // Erstelle eine neue Zeile
      for (let c = 0; c < cols; c++) {
        row.push(''); // Füge einen leeren String zur Zeile hinzu
      }
      this.gameBoard.push(row); // Füge die Zeile zum Spielbrett hinzu
    }
  }

  // Methode, um den Spielstatus zu aktualisieren, wenn auf das Spielfeld geklickt wird
  handleClick(columnIndex: number) {
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
  getCellClass(rowIndex: number, columnIndex: number) {
    const cell = this.gameBoard[rowIndex][columnIndex];
    return cell === 'Rot' ? 'red' : cell === 'Gelb' ? 'yellow' : '';
  }

  checkWinner() {
    //TODO- Hier kommt der Check für den Winner rein
  }
}
