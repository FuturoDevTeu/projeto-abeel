import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Footer } from './components/footer/footer';
import { Router } from '@angular/router';
import { Header } from "./components/header/header";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    Footer,
    Header
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'appElevador';

  
}
