import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { PredioRequest } from "../../types/PredioRequest";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatToolbarModule, CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  isModalOpen = false;

  predio: PredioRequest = {nome: '', bairro: ''}

  @Output() cadastrarPredio = new EventEmitter;

  constructor(){}

  submitForm() {
    // Lógica para cadastrar
    console.log('Formulário enviado:', this.predio);
    this.cadastrarPredio.emit(this.predio);
    this.predio = {nome: '', bairro: ''}
    this.isModalOpen = false; // Fecha o modal após enviar
  }

}
