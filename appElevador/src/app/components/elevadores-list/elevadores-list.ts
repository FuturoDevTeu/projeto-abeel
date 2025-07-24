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

  cadastrarElevadorNoPredio(idPredio: string, elevador: Elevador){
    this.elevadorService.cadastrarElevadorNoPredio(idPredio, elevador)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.cdr.detectChanges();
      },
      error: (err) =>{
        console.error(err);
      },
    })
  }
  buscarElevadorNoPredio(idPredio: string, modelo: string){
    this.elevadorService.buscarElevadorDoPredio(idPredio, modelo)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.cdr.detectChanges();
      },
      error: (err) =>{
        console.error(err);
      },
    })
  }
  removerElevadorNoPredio(idPredio: string, idElevador: string){
    this.elevadorService.removerElevadorDoPredio(idPredio, idElevador)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.cdr.detectChanges();
      },
      error: (err) =>{
        console.error(err);
      },
    })
  }
  editarElevadorNoPredio(idPredio: string, idElevador: string, elevador: Elevador){
    this.elevadorService.editarElevadorDoPredio(idPredio, idElevador, elevador)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.cdr.detectChanges();
      },
      error: (err) =>{
        console.error(err);
      },
    })
  }

  gerarRelatorio(idPredio: string, idElevador: string){
    this.elevadorService.gerarRelatorio(idPredio, idElevador)
    .subscribe({
      next: (blob) => {
        const fileUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'relatorio.pdf';
        link.click();
        URL.revokeObjectURL(fileUrl);
      },
      error: (err) =>{
        console.error(err);
      },
    })
  }
}