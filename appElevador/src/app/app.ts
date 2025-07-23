import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http'; // Essa linha é importante
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Adicione esta linha

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, MatButtonModule, MatToolbarModule, MatCardModule, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'appElevador';
}
