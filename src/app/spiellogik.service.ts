import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class SpiellogikService {
  currentPlayer: string = 'Rot'; // Deklaration Startspieler
  gameBoard: string[][]; // Deklaration des Spielbretts

  constructor(private toastr: ToastrService) {
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
    // //Test um zu schauen ob die DrawFunction funktioniert
    this.testDrawFunction();
  }

  // Methode, um den Spielstatus zu aktualisieren, wenn auf das Spielfeld geklickt wird
  handleClick(columnIndex: number) {
    let columnFull = false; //Flag für Toast

    // Reihen durchlaufen von unten nach oben
    for (let row = 5; row >= 0; row--) {
      //Wenn eine leere Reihe gefunden wird
      if (!this.gameBoard[row][columnIndex]) {
        this.gameBoard[row][columnIndex] = this.currentPlayer; // Setze den aktuellen Spieler
        console.log(this.findLegalMoves());
        //TODO- Hier muss geprüft werden ob es einen Gewinner gibt und dann das Spiel nach einem bestätigen Button zurückgesetzt werden
        const winner = this.checkWinner();
        if (winner) {
          this.toastr.success(`${winner} hat das Spiel gewonnen!`, 'GEWONNEN', {
            timeOut: 5000, // Verhindert das automatische Schließen
            closeButton: true,
          });
          //Game Reset Bestätigung TODO- Timer einbauen
          this.gameReset();
        } else if (!winner && this.isBoardFull()) {
          this.toastr.error(
            `Das Spiel wurde mit einem Unentschieden beendet`,
            'UNENTSCHIEDEN',
            {
              timeOut: 5000, // Verhindert das automatische Schließen
              closeButton: true,
            }
          );
          this.gameReset();
        }
        //IDEE- Eventuell ein Playback des Spiels einbauen
        this.currentPlayer = this.currentPlayer === 'Rot' ? 'Gelb' : 'Rot'; // Wechsel den Spieler
        break;
      }
      if (row === 0) {
        columnFull = true;
      }
    }
    if (columnFull) {
      this.toastr.error('Spalte ist bereits voll!');
    }
  }

  isBoardFull() {
    //Schleife durch alle Columns
    for (let col = 0; col < this.gameBoard[0].length; col++) {
      //Wenn oberste Reihe nicht voll
      if (!this.gameBoard[0][col]) {
        //return false
        return false;
      }
    }
    //Wenn voll dann return true
    return true;
  }

  // Methode, um die Klasse für jede Zelle zu setzen
  setCellClass(rowIndex: number, columnIndex: number) {
    const cell = this.gameBoard[rowIndex][columnIndex];
    return cell === 'Rot' ? 'red' : cell === 'Gelb' ? 'yellow' : '';
  }

  checkWinner() {
    const rows = this.gameBoard.length;
    const cols = this.gameBoard[0].length;
    // Überprüfungen:
    // 1. Horizontal,
    //Schleife von 0 - 5, da 6 Reihen
    //Schleife von 0-4, da 4 zum Überlauf in Spalte 8 führen würde
    //Überprüfung ob die Zelle und die 3 darauffolgenden Zellen dem Spieler entsprechen
    //return Spieler wenn das der fall
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= cols - 4; c++) {
        if (
          this.gameBoard[r][c] &&
          this.gameBoard[r][c] === this.gameBoard[r][c + 1] &&
          this.gameBoard[r][c] === this.gameBoard[r][c + 2] &&
          this.gameBoard[r][c] === this.gameBoard[r][c + 3]
        ) {
          return this.gameBoard[r][c]; //Gewinner ausgeben
        }
      }
    }

    // 2. Vertikal,
    //Schleife von 0 - 6, da 7 Spalten
    //Schleife von 0-2, da 2 zum Überlauf führt in der Reihe 7
    //Überprüfung ob die Zelle und die 3 darauffolgenden Zellen dem Spieler entsprechen
    //return spieler wenn das der fall
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r <= rows - 4; r++) {
        if (
          this.gameBoard[r][c] &&
          this.gameBoard[r][c] === this.gameBoard[r + 1][c] &&
          this.gameBoard[r][c] === this.gameBoard[r + 2][c] &&
          this.gameBoard[r][c] === this.gameBoard[r + 3][c]
        ) {
          return this.gameBoard[r][c]; //Gewinner ausgeben
        }
      }
    }

    // 3. Diagonal von links oben nach rechts unten
    //Schleife von 0 - 2, da 2 zum Überlauf führt in der Reihe 7
    //Schleife von 0-4, da 4 zum Überlauf in Spalte 8 führen würde
    //Überprüfung ob die Zelle und die 3 darauffolgenden Zellen jeweils row+1 und col +1 und so weiter dem Spieler entsprechen
    //return spieler wenn das der fall
    for (let r = 0; r <= rows - 4; r++) {
      for (let c = 0; c <= cols - 4; c++) {
        if (
          this.gameBoard[r][c] &&
          this.gameBoard[r][c] === this.gameBoard[r + 1][c + 1] &&
          this.gameBoard[r][c] === this.gameBoard[r + 2][c + 2] &&
          this.gameBoard[r][c] === this.gameBoard[r + 3][c + 3]
        ) {
          return this.gameBoard[r][c]; //Gewinner ausgeben
        }
      }
    }

    // 4. Diagonal von rechts oben nach links unten
    //Schleife von 0 - 2, da 2 zum Überlauf führt in der Reihe 7
    //Schleife von 3 - 6, um keinen Überlauf zu verursachen
    //Überprüfung ob die Zelle und die 3 darauffolgenden Zellen jeweils row+1 und col -1 und so weiter dem Spieler entsprechen
    //return spieler wenn das der fall
    for (let r = 0; r <= rows - 4; r++) {
      for (let c = 3; c < cols; c++) {
        if (
          this.gameBoard[r][c] &&
          this.gameBoard[r][c] === this.gameBoard[r + 1][c - 1] &&
          this.gameBoard[r][c] === this.gameBoard[r + 2][c - 2] &&
          this.gameBoard[r][c] === this.gameBoard[r + 3][c - 3]
        ) {
          return this.gameBoard[r][c]; //Gewinner ausgeben
        }
      }
    }

    //Wenn nichts zutrifft return null
    return null;
  }

  gameReset() {
    let remainingTime = 5; // Sekundenwert für den Countdown

    const interval = setInterval(() => {
      this.toastr.info(
        `Neues Spiel startet in ${remainingTime} Sekunden...`,
        'NEUSTART',
        {
          timeOut: 700, // Jeder TimerToast bleibt für 700ms sichtbar
        }
      );

      remainingTime--;

      if (remainingTime < 0) {
        clearInterval(interval); // Countdown stoppen
        this.toastr.success('Spiel wurde zurückgesetzt.', 'NEUES SPIEL');

        // Spielfeld zurücksetzen
        this.gameBoard.forEach((element) => {
          element.fill('');
        });
      }
    }, 1000);
  }

  findLegalMoves() {
    let legalMoves: number[][] = [];

    //schleife columns
    for (let col = 0; col < this.gameBoard[0].length; col++) {
      //schleife rows
      for (let row = 5; row >= 0; row--) {
        //Wenn Zelle leer
        if (!this.gameBoard[row][col]) {
          legalMoves.push([row, col]); // Position der legalen Zelle speichern
          break; // schleife beenden, da wir die unterste leere Zelle gefunden haben
        }
      }
    }
    return legalMoves;
  }

  testDrawFunction() {
    let rot = 'Rot';
    let gelb = 'Gelb';
    this.currentPlayer = rot;
    const testMoves = [
      { row: 1, col: 0, player: gelb },
      { row: 2, col: 0, player: rot },
      { row: 3, col: 0, player: gelb },
      { row: 4, col: 0, player: rot },
      { row: 5, col: 0, player: gelb },
      { row: 0, col: 1, player: rot },
      { row: 1, col: 1, player: gelb },
      { row: 2, col: 1, player: rot },
      { row: 3, col: 1, player: gelb },
      { row: 4, col: 1, player: rot },
      { row: 5, col: 1, player: rot },
      { row: 0, col: 2, player: gelb },
      { row: 1, col: 2, player: rot },
      { row: 2, col: 2, player: rot },
      { row: 3, col: 2, player: rot },
      { row: 4, col: 2, player: gelb },
      { row: 5, col: 2, player: rot },
      { row: 0, col: 3, player: rot },
      { row: 1, col: 3, player: gelb },
      { row: 2, col: 3, player: gelb },
      { row: 3, col: 3, player: gelb },
      { row: 4, col: 3, player: rot },
      { row: 5, col: 3, player: gelb },
      { row: 0, col: 4, player: gelb },
      { row: 1, col: 4, player: rot },
      { row: 2, col: 4, player: gelb },
      { row: 3, col: 4, player: gelb },
      { row: 4, col: 4, player: rot },
      { row: 5, col: 4, player: gelb },
      { row: 0, col: 5, player: gelb },
      { row: 1, col: 5, player: rot },
      { row: 2, col: 5, player: gelb },
      { row: 3, col: 5, player: rot },
      { row: 4, col: 5, player: rot },
      { row: 5, col: 5, player: rot },
      { row: 0, col: 6, player: rot },
      { row: 1, col: 6, player: gelb },
      { row: 2, col: 6, player: rot },
      { row: 3, col: 6, player: gelb },
      { row: 4, col: 6, player: gelb },
      { row: 5, col: 6, player: gelb },
    ];

    // Zuweisungen durchführen
    testMoves.forEach((move) => {
      this.gameBoard[move.row][move.col] = move.player;
    });
  }
}
