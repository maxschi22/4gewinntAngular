import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpielfeldComponent } from './spielfeld/spielfeld.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpielfeldComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = '4gewinntAngular';
}
