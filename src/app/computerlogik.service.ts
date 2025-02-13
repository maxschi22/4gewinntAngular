import { Injectable } from '@angular/core';
import { SpiellogikService } from './spiellogik.service';

@Injectable({
  providedIn: 'root',
})
export class ComputerlogikService {
  constructor(public spielService: SpiellogikService) {}
}
