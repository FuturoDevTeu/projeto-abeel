import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute } from '@angular/router';
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
  predio: Predio = { id: '', nome: '', bairro: ''};
  estaCarregando: boolean = false;
  mensagem: string = "";
  idEmpresa: string = '';
  predioRequest: PredioRequest = {nome: "", bairro: "", idEmpresa: ""};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private predioService: PredioService
  ) { }

  ngOnInit(): void {
    // Obtém o idEmpresa da rota
    this.route.paramMap.subscribe(params => {
      const id = params.get('idEmpresa');
      console.log("O id chegou no onInit: "+ id);
      if (id) {
        this.idEmpresa = id;
        this.carregarPredios();
      } else {
        this.mensagem = "ID da empresa não informado na rota";
      }
    });
  }

  abrirModalParaCadastro(): void {
    this.predio = { id: '', nome: '', bairro: '' };
    this.isModalOpen = true;
  }

  abrirModalParaEdicao(predio: Predio): void {
    this.predio = { ...predio };
    this.isModalOpen = true;
  }

  fecharModal(): void {
    this.isModalOpen = false;
    this.predio = { id: '', nome: '', bairro: '' };
  }

  submitForm(): void {
    if (this.predio.nome && this.predio.bairro) {
      if (this.predio.id) {
        console.log("Peguei o id", this.predio.id)
        this.editarPredio(this.predio.id, {
          nome: this.predio.nome,
          bairro: this.predio.bairro,
        });
      } else {
        this.cadastrarPredio({ nome: this.predio.nome, bairro: this.predio.bairro, idEmpresa: this.idEmpresa });
      }
      this.fecharModal();
    }
  }

  carregarPredios(): void {
    this.estaCarregando = true;
    this.mensagem = "Carregando prédios, por favor espere...";
    this.predioService.obterPredios(this.idEmpresa)
      .subscribe({
        next: (predios) => {
          this.predios = Array.from(predios);
          this.mensagem = this.predios.length === 0 ? "Nenhum prédio encontrado" : '';
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
        next: () => {
          this.carregarPredios();
          this.cdr.detectChanges();
        },
        error: (err) => {
          window.alert(typeof err.error === 'string' ? err.error : "Ocorreu um erro inesperado");
          this.cdr.detectChanges();
        }
      });
  }

  buscarPredio(event: Event): void {
    const input = event.target as HTMLInputElement;
    const nomePredio = input.value;
    if (!nomePredio) {
      this.carregarPredios();
      return;
    }
    this.estaCarregando = true;
    this.mensagem = "Carregando prédios, por favor espere...";
    this.predioService.buscarPredio(nomePredio)
      .subscribe({
        next: (predios) => {
          this.predios = Array.from(predios);
          this.mensagem = this.predios.length === 0 ? "Nenhum prédio encontrado" : '';
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
          next: () => {
            this.carregarPredios();
            this.cdr.detectChanges();
          },
          error: (err) => {
            window.alert(typeof err.error === 'string' ? err.error : "Ocorreu um erro inesperado");
            this.cdr.detectChanges();
          }
        });
    }
  }

  editarPredio(idPredio: string, predio: PredioRequest): void {
    this.predioService.editarPredio(idPredio, predio)
      .subscribe({
        next: () => {
          this.carregarPredios();
          this.cdr.detectChanges();
        },
        error: (err) => {
          window.alert(typeof err.error === 'string' ? err.error : "Ocorreu um erro inesperado");
          this.cdr.detectChanges();
        }
      });
  }

  selecionarPredio(id: string): void {
    this.selectedPredioId = id;
    this.router.navigate(['/elevadores', id]);
  }

  voltarEmpresa(){
    this.router.navigate(["/empresa"])
  }
}
