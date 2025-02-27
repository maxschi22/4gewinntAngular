import { Component } from '@angular/core';
import { SpiellogikService } from '../spiellogik.service';
import { CommonModule } from '@angular/common';
import { ComputerlogikService } from '../computerlogik.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-spielfeld',
  imports: [CommonModule],
  templateUrl: './spielfeld.component.html',
  styleUrls: ['./spielfeld.component.css'],
})
export class SpielfeldComponent {
  rows = Array(6).fill(0); // Erstellt ein Array mit 6 Einträgen
  columns = Array(7).fill(0); // Erstellt ein Array mit 7 Einträgen
  ai = false;

  // Den spielService injizieren
  constructor(
    public spielService: SpiellogikService,
    public computerService: ComputerlogikService,
    public toastr: ToastrService
  ) {}

  // Methode, um die Klasse für jede Zelle zu setzen
  setCellClass(rowIndex: number, columnIndex: number) {
    return this.spielService.setCellClass(rowIndex, columnIndex); // Verwende die Methode des Services
  }

  startAIGame() {
    this.ai = true;
    this.toastr.info('Spiel gegen Computer gestartet!', 'Modus');
  }

  startTwoPlayerGame() {
    this.ai = false;
    this.toastr.info('Zwei Spieler Modus gestartet!', 'Modus');
  }

  // Methode, die beim Klicken auf das Spielfeld aufgerufen wird
  handleClick(columnIndex: number) {
    this.spielService.handleClick(columnIndex); // Aufruf der Methode im Service

    if (this.ai) {
      setTimeout(() => {
        this.computerMakeMove(); // Computer macht seinen Zug
      }, 500);
    }
  }

  showLastMatchResult() {
    this.spielService.showLastMatchResult();
  }

  instantGameReset() {
    this.spielService.instantGameReset();
    this.ai = false;
  }

  gameReset() {
    this.spielService.gameReset();
    this.ai = false;
  }

  computerMakeMove() {
    this.computerService.makeComputerMove();
  }
}
