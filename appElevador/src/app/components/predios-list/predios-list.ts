import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { PredioService } from '../../services/predio-service';
import { Predio } from '../../types/Predio';
import { PredioRequest } from '../../types/PredioRequest';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-predios-list',
  standalone: true,
  imports: [MatCardModule, CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './predios-list.html',
  styleUrls: ['./predios-list.css']
})
export class PrediosList implements OnInit {

  predios: Predio[] = [];
  selectedPredioId: string | null = null;
  isModalOpen = false;
  // O objeto 'predio' agora é usado para cadastro e edição
  predio: Predio = { id: '', nome: '', bairro: '' };
  estaCarregando: boolean = false;
  mensagem: string = "";

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private predioService: PredioService
  ) { }

  ngOnInit(): void {
    this.carregarPredios();
  }

  // Abre o modal para cadastrar um novo prédio
  abrirModalParaCadastro(): void {
    this.predio = { id: '', nome: '', bairro: '' }; // Limpa o formulário
    this.isModalOpen = true;
  }

  // Abre o modal para editar um prédio existente
  abrirModalParaEdicao(predio: Predio): void {
    this.predio = { ...predio }; // Preenche o formulário com os dados do prédio
    this.isModalOpen = true;
  }

  // Fecha o modal e limpa o formulário
  fecharModal(): void {
    this.isModalOpen = false;
    this.predio = { id: '', nome: '', bairro: '' };
  }

  // Método de submissão unificado
  submitForm(): void {
    if (this.predio.nome && this.predio.bairro) {
      if (this.predio.id) {
        // Se o id existe, chama o método de atualização
        this.editarPredio(this.predio);
      } else {
        // Se o id não existe, chama o método de cadastro
        this.cadastrarPredio({ nome: this.predio.nome, bairro: this.predio.bairro });
        this.carregarPredios();
      }
      this.fecharModal();
    }
  }

  carregarPredios(): void {
    this.estaCarregando = true;
    this.mensagem = "Carregando predios, por favor espere...";
    this.predioService.obterPredios()
      .subscribe({
        next: (predios) => {
          this.predios = Array.from(predios);
          if(this.predios.length === 0){
            this.mensagem = "Nenhum predio encontrado";
          }else{
            this.mensagem = '';
          }
          this.estaCarregando = false;
          this.selectedPredioId = null;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao carregar prédios', error);
          this.predios = [];
          this.estaCarregando = false;
          this.mensagem = 'Erro ao carregar prédios';
          this.cdr.detectChanges();
        }
      });
  }

  cadastrarPredio(predio: PredioRequest): void {
    this.predioService.cadastrarPredio(predio)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.cdr.detectChanges();
          this.carregarPredios();
        },
        error: (err) => {
          if(typeof err.error === 'string'){
            window.alert(err.error);
            this.cdr.detectChanges();
          }else{
            window.alert("Ocorreu um erro inesperado ");
          } 
        }
      });
  }

  buscarPredio(event: Event): void {
    const input = event.target as HTMLInputElement;
    const nomePredio = input.value
    if(!nomePredio){
      this.carregarPredios();
      return;
    }
    this.estaCarregando = true;
    this.mensagem = "Carregando prédios, por favor espere..."
    
    this.predioService.buscarPredio(nomePredio)
    .subscribe({
        next: (predios) => {
          this.predios = Array.from(predios);
          if(this.predios.length === 0){
            this.mensagem = "Nenhum prédio encontrado";
          }else{
            this.mensagem = '';
          }
          this.estaCarregando = false;
          this.selectedPredioId = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.mensagem = "Erro ao buscar prédios";
          this.estaCarregando = false;
          this.cdr.detectChanges();
        }
      });
  }

  deletarPredio(idPredio: string): void {
    if (confirm('Tem certeza que deseja deletar este prédio?')) {
      this.predioService.deletarPredio(idPredio)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.carregarPredios();
            this.cdr.detectChanges();            
          },
          error: (err) => {
            if(typeof err.error === 'string'){
              window.alert(err.error);
              this.cdr.detectChanges();
            }else{
              window.alert("Ocorreu um erro inesperado ");
            } 
          }
        });
    }
  }

  editarPredio(predio: Predio): void {
    this.predioService.editarPredio(predio)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.cdr.detectChanges();
          this.carregarPredios();
        },
        error: (err) => {
          if(typeof err.error === 'string'){
            window.alert(err.error);
            this.cdr.detectChanges();
          }else{
            window.alert("Ocorreu um erro inesperado ");
          } 
        }
      });
  }

  selecionarPredio(id: string): void {
    this.selectedPredioId = id;
    this.router.navigate(['/elevadores', id]);
  }
}
