import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

interface Predio {
  id: number;
  nome: string;
  endereco: string;
  cidade: string;
  qtdElevadores: number;
}

@Component({
  selector: 'app-predios-list',
  imports: [MatCardModule, CommonModule],
  templateUrl: './predios-list.html',
  styleUrls: ['./predios-list.css']
})
export class PrediosList implements OnInit {
  predios: Predio[] = [];
  selectedPredioId: number | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Dados fakes para desenvolvimento
    this.predios = [
      {
        id: 1,
        nome: 'Edifício Central',
        endereco: 'Rua das Flores, 123',
        cidade: 'São Paulo',
        qtdElevadores: 4
      },
      {
        id: 2,
        nome: 'Torre Sul',
        endereco: 'Av. Paulista, 456',
        cidade: 'São Paulo',
        qtdElevadores: 3
      },
      {
        id: 3,
        nome: 'Residencial Norte',
        endereco: 'Av. das Nações, 789',
        cidade: 'Campinas',
        qtdElevadores: 2
      }
    ];
  }

  selecionarPredio(id: number) {
    this.router.navigate(['/elevadores', id]); // Navega para a rota de elevadores
  }
}