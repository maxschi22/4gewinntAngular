import { Component } from '@angular/core';
import { SpiellogikService } from '../spiellogik.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spielfeld',
  imports: [CommonModule],
  templateUrl: './spielfeld.component.html',
  styleUrls: ['./spielfeld.component.css'],
})
export class SpielfeldComponent {
  rows = Array(6).fill(0); // Erstellt ein Array mit 6 Einträgen
  columns = Array(7).fill(0); // Erstellt ein Array mit 7 Einträgen

  // Den GameService injizieren
  constructor(public spielService: SpiellogikService) {}

  // Methode, um die Klasse für jede Zelle zu setzen (z. B. 'red' oder 'yellow')
  getCellClass(rowIndex: number, columnIndex: number) {
    return this.spielService.getCellClass(rowIndex, columnIndex); // Verwende die Methode des Services
  }

  // Methode, die beim Klicken auf das Spielfeld aufgerufen wird
  handleClick(columnIndex: number) {
    this.spielService.handleClick(columnIndex); // Aufruf der Methode im Service
  }

  getWinner() {}
}
