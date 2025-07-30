import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Elevador } from '../../types/Elevador';
import { ElevadorService } from '../../services/elevador-service';
import { Header } from "../header/header";
import { FormsModule } from '@angular/forms';
import { ElevadorRequest } from '../../types/ElevadorRequest';

@Component({
  selector: 'app-elevadores',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterLink,
    MatButtonModule,
    FormsModule,
    Header
],
  templateUrl: './elevadores-list.html',
  styleUrl: './elevadores-list.css'
})
export class ElevadoresComponent implements OnInit {
  
  predioId: string | null = null;
  elevadoresDoPredio: Elevador[] = [];
  isModalOpen = false;
  elevador: ElevadorRequest = {modelo: "", componente: []};
  idElevadorSelecionado = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private elevadorService: ElevadorService,
    private cdr: ChangeDetectorRef
  ) { }
 
  abrirModalElevador(){
    this.isModalOpen = true;
  }

  submitForm(){
    if(this.elevador.modelo){
      if(this.predioId != null){
        this.cadastrarElevadorNoPredio(this.predioId, this.elevador);
        this.elevador.modelo = "";
        this.isModalOpen = false;
      }
    }
  }

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

  cadastrarElevadorNoPredio(idPredio: string, elevador: ElevadorRequest){
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
  editarElevadorNoPredio(idPredio: string, idElevador: string, elevador: ElevadorRequest){
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

  gerarRelatorio(idElevador: string){
    this.elevadorService.gerarRelatorio(idElevador)
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
  selecionarElevador(idElevador: string){
    this.idElevadorSelecionado = idElevador;
    console.log(this.idElevadorSelecionado)
    this.router.navigate(['/componentes', this.idElevadorSelecionado]);
  }

}