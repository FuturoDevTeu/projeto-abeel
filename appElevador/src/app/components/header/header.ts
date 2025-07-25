import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatToolbar } from "@angular/material/toolbar";

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  imports: [MatToolbar]
})
export class Header {
  @Input() tipo: 'predio' | 'elevador' = 'predio';
  @Output() cadastrar = new EventEmitter<void>();

  abrirCadastro() {
    this.cadastrar.emit();
  }
}
