import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { PredioService } from '../../services/predio-service';
import { Predio } from '../../types/Predio';
import { Header } from "../header/header";
import { PredioRequest } from '../../types/PredioRequest';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-predios-list',
  standalone: true,
  imports: [MatCardModule, CommonModule, FormsModule, MatIconModule, MatButtonModule, Header, Footer],
  templateUrl: './predios-list.html',
  styleUrls: ['./predios-list.css']
})
export class PrediosList implements OnInit {

  predios: Predio[] = [];
  selectedPredioId: string | null = null;
  isModalOpen = false;
  // O objeto 'predio' agora é usado para cadastro e edição
  predio: Predio = { id: '', nome: '', bairro: '' };

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
    this.predioService.obterPredios()
      .subscribe({
        next: (predios) => {
          this.predios = Array.from(predios);
          this.selectedPredioId = null;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao carregar prédios', error);
          this.predios = [];
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

  buscarPredio(nomePredio: string): void {
    this.predioService.buscarPredio(nomePredio)
      .subscribe({
        next: (predios) => {
          this.predios = Array.from(predios);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
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
