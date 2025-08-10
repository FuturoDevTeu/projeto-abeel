import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbar } from "@angular/material/toolbar";

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  imports: [MatToolbar, MatButtonModule, MatIconModule]
})
export class Header {
  @Input() tipo: 'predio' | 'elevador' = 'predio';
  @Output() cadastrar = new EventEmitter<void>();

  abrirCadastro() {
    this.cadastrar.emit();
  }
}
