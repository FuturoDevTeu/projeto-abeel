import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Elevador } from '../../types/Elevador';
import { ElevadorService } from '../../services/elevador-service';

@Component({
  selector: 'app-elevadores',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './elevadores-list.html',
  styleUrl: './elevadores-list.css'
})
export class ElevadoresComponent implements OnInit {
  predioId: string | null = null;
  elevadoresDoPredio: Elevador[] = [];

  constructor(
    private route: ActivatedRoute,
    private elevadorService: ElevadorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.predioId = this.route.snapshot.paramMap.get('id');

    if (this.predioId) {
      this.carregarElevadoresDoPredio(this.predioId);
    } else {
      console.error('ID do prédio não encontrado na rota de elevadores. Verifique a URL.');
      this.elevadoresDoPredio = [];
      this.cdr.detectChanges();
    }
  }

  carregarElevadoresDoPredio(idPredio: string): void {
    console.log(sessionStorage.getItem('token'))
    this.elevadoresDoPredio = [];

    this.elevadorService.carregarElevadoresDoPredio(idPredio).subscribe({
      next: (elevador) => {
        this.elevadoresDoPredio = Array.from(elevador);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(`Erro ao carregar elevadores para o prédio ${idPredio}:`, error);
        this.elevadoresDoPredio = [];
        this.cdr.detectChanges();
      }
    });
  }
}