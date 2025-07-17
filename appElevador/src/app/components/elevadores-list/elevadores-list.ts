import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-elevadores-list',
  templateUrl: './elevadores-list.html',
  imports: [MatCardModule, CommonModule],
  styleUrls: ['./elevadores-list.css'] // Correção do nome para styleUrls
})
export class ElevadoresList implements OnInit { // Implementa OnInit
  predioId: number | null = null;
  selectedElevadorId: number | null = null;

  elevadores = [
  {
    id: 1,
    nome: 'Elevador A',
    status: 'Em operação',
    capacidade: 8,
    ultimaManutencao: new Date('2025-06-10')
  },
  {
    id: 2,
    nome: 'Elevador B',
    status: 'Em manutenção',
    capacidade: 6,
    ultimaManutencao: new Date('2025-06-01')
  },
  {
    id: 3,
    nome: 'Elevador C',
    status: 'Inativo',
    capacidade: 10,
    ultimaManutencao: new Date('2025-05-15')
  },
  {
    id: 4,
    nome: 'Elevador D',
    status: 'Em operação',
    capacidade: 9,
    ultimaManutencao: new Date('2025-07-01')
  },
  {
    id: 5,
    nome: 'Elevador E',
    status: 'Inspeção pendente',
    capacidade: 7,
    ultimaManutencao: new Date('2025-04-20')
  },
  {
    id: 6,
    nome: 'Elevador F',
    status: 'Desativado',
    capacidade: 5,
    ultimaManutencao: new Date('2024-12-12')
  },
  {
    id: 7,
    nome: 'Elevador G',
    status: 'Em operação',
    capacidade: 11,
    ultimaManutencao: new Date('2025-06-25')
  }
];


  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.predioId = +params.get('id')!;
    });
  }

  selecionarElevador(id: number): void {
    this.selectedElevadorId = id;
  }
}