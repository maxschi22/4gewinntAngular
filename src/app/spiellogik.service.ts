import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class SpiellogikService {
  readonly HUMAN_PLAYER: string = '1';
  readonly COMPUTER_PLAYER: string = '2';

  currentPlayer: string = '1'; //Initialisierung Startspieler
  gameBoard: string[][] = []; //Initialisierung des Spielbretts
  matchResult: string[][] = []; //Initialisierung Zustand des Spielergebnisses
  gameOver: boolean = false; //Initialisierung Flag gameOver

  //DI
  constructor(private toastr: ToastrService) {
    // Erstelle ein leeres Spielbrett mit 6 Zeilen und 7 Spalten
    const rows = 6;
    const cols = 7;

    for (let r = 0; r < rows; r++) {
      const row = []; // neue zeile erstellen
      for (let c = 0; c < cols; c++) {
        row.push(''); // leeren Wert zur zelle hinzufügen
      }
      console.log(row);
      this.gameBoard.push(row); // Füge die Zeile zum Spielbrett hinzu, Zeile ist hier jeweils ein Array mit 7 Werten
    }
    //Gameboard wird zu einem Array welches 6 Arrays enthält
    console.log(this.gameBoard);
    //Test um zu schauen ob die DrawFunction funktioniert
    // this.testDrawFunction();
  }
  // Methode, um den Spielstatus zu aktualisieren, wenn auf das Spielfeld geklickt wird
  handleClick(columnIndex: number) {
    if (this.gameOver) {
      this.toastr.warning(
        'Das Spiel ist vorbei! Starte ein neues Spiel.',
        'Spiel beendet'
      );
      return;
    }

    let columnFull = false; //Flag für Toast

    // Reihen durchlaufen von unten nach oben
    for (let row = 5; row >= 0; row--) {
      //Wenn eine leere Reihe gefunden wird
      if (!this.gameBoard[row][columnIndex]) {
        this.makeMove(row, columnIndex); // Setze den aktuellen Spieler
        console.log(this.findLegalMoves());
        //TODO- Hier muss geprüft werden ob es einen Gewinner gibt und dann das Spiel nach einem bestätigen Button zurückgesetzt werden
        const winner = this.checkWinner();
        if (winner) {
          this.handleWinner(winner);
        } else if (!winner && this.isBoardFull()) {
          this.handleDraw();
        }
        //IDEE- Eventuell ein Playback des Spiels einbauen
        this.switchPlayer();
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

  switchPlayer() {
    this.currentPlayer =
      this.currentPlayer === this.HUMAN_PLAYER
        ? this.COMPUTER_PLAYER
        : this.HUMAN_PLAYER;
  }

  handleWinner(winner: string) {
    if (winner === this.HUMAN_PLAYER) {
      this.toastr.success(`Rot hat das Spiel gewonnen!`, 'GEWONNEN', {
        timeOut: 5000, // Verhindert das automatische Schließen
        closeButton: true,
      });
    } else if (winner === this.COMPUTER_PLAYER) {
      this.toastr.success(`Gelb hat das Spiel gewonnen!`, 'GEWONNEN', {
        timeOut: 5000, // Verhindert das automatische Schließen
        closeButton: true,
      });
    }
    this.matchResult = this.gameBoard.map((row) => [...row]);
    //Game Reset Bestätigung TODO- Timer einbauen
    this.gameOver = true;
    this.gameReset();
  }

  handleDraw() {
    this.matchResult = this.gameBoard.map((row) => [...row]);
    this.toastr.error(
      `Das Spiel wurde mit einem Unentschieden beendet`,
      'UNENTSCHIEDEN',
      {
        timeOut: 5000, // Verhindert das automatische Schließen
        closeButton: true,
      }
    );
    this.gameOver = true;
    this.gameReset();
  }

  makeMove(rowIndex: number, columnIndex: number) {
    this.gameBoard[rowIndex][columnIndex] = this.currentPlayer; // Setze den aktuellen Spieler
  }

  undoMove(rowIndex: number, columnIndex: number) {
    this.gameBoard[rowIndex][columnIndex] = '';
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
    return cell === this.HUMAN_PLAYER
      ? 'red'
      : cell === this.COMPUTER_PLAYER
      ? 'yellow'
      : '';
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

  instantGameReset() {
    this.toastr.success('Spiel wurde zurückgesetzt.', 'NEUES SPIEL');
    this.gameOver = false;

    // Spielfeld zurücksetzen
    this.gameBoard.forEach((element) => {
      element.fill('');
    });
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

        this.gameOver = false;
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

  //Endzustand des letzten Spiels anzeigen
  showLastMatchResult() {
    this.gameBoard = this.matchResult;
    this.gameOver = true;
  }

  testDrawFunction() {
    let rot = '1';
    let gelb = '2';
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
