import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatToolbarModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

   isModalOpen = false;

  submitForm() {
    // Lógica para cadastrar
    console.log('Formulário enviado!');
    this.isModalOpen = false; // Fecha o modal após enviar
  }

}
