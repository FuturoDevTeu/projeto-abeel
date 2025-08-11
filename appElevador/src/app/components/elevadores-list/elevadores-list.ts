import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Elevador } from '../../types/Elevador';
import { ElevadorService } from '../../services/elevador-service';
import { FormsModule } from '@angular/forms';
import { ElevadorRequest } from '../../types/ElevadorRequest';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-elevadores',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterLink,
    MatButtonModule,
    FormsModule,
    MatIconModule,
],
  templateUrl: './elevadores-list.html',
  styleUrl: './elevadores-list.css'
})
export class ElevadoresComponent implements OnInit {
  
  predioId: string | null = null;
  elevadoresDoPredio: Elevador[] = [];
  isModalOpen = false;
  elevador: Elevador | ElevadorRequest = {modelo: "", componente: []};
  selectedElevadorId = "";
  estaCarregando: boolean = false;
  messagem: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private elevadorService: ElevadorService,
    private cdr: ChangeDetectorRef
  ) { }
  
  // Abre o modal para cadastrar um novo elevador.
  abrirModalParaCadastro(): void {
    this.elevador = { modelo: "", componente: [] };
    this.isModalOpen = true;
  }
  
  // Abre o modal para editar um elevador existente.
  abrirModalParaEdicao(elevador: Elevador): void {
    this.elevador = { ...elevador };
    this.isModalOpen = true;
  }

  // Fecha o modal e limpa o formulário.
  fecharModal(): void {
    this.isModalOpen = false;
    this.elevador = { modelo: "", componente: [] };
  }

  // Submete o formulário, criando ou atualizando um elevador.
  submitForm(): void {
    if (!this.elevador.modelo) {
      console.error("O modelo do elevador é obrigatório.");
      return;
    }
    
    if (this.predioId) {
      if ('id' in this.elevador) {
        this.editarElevadorNoPredio(this.predioId, this.elevador.id, this.elevador);
      } else {
        this.cadastrarElevadorNoPredio(this.predioId, this.elevador as ElevadorRequest);
      }
      this.fecharModal();
    } else {
      console.error('ID do prédio não está disponível.');
    }
  }

  // Inicializa o componente ao carregar a página.
  ngOnInit(): void {
    this.predioId = this.route.snapshot.paramMap.get('id');
    console.log("Id do predio: "+ this.predioId);

    if (this.predioId) {
      this.carregarElevadoresDoPredio(this.predioId);
    } else {
      console.error('ID do prédio não encontrado na rota de elevadores. Verifique a URL.');
      this.elevadoresDoPredio = [];
      this.cdr.detectChanges();
    }
  }

  // Carrega a lista de elevadores para um prédio específico.
  carregarElevadoresDoPredio(idPredio: string): void {
    this.elevadoresDoPredio = [];
    this.estaCarregando = true;
    this.messagem = "Carregando elevadores, por favor espere...";
    
    this.elevadorService.carregarElevadoresDoPredio(idPredio).subscribe({
      next: (elevadores) => {
        if(elevadores.length === 0){
          this.messagem = "Nenhum elevador encontrado";
          this.estaCarregando = false;
        }else{
          this.messagem = "";
          this.estaCarregando = false;
        }
        this.elevadoresDoPredio = elevadores;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Erro ao carregar elevador: "+ error.error);
        this.elevadoresDoPredio = [];
        this.messagem = "Ocorreu um erro ao carregar elevadores";
        this.estaCarregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Envia uma requisição para cadastrar um novo elevador.
  cadastrarElevadorNoPredio(idPredio: string, elevador: ElevadorRequest): void {
    this.elevadorService.cadastrarElevadorNoPredio(idPredio, elevador)
    .subscribe({
      next: (res) => {
        console.log('Elevador cadastrado com sucesso:', res);
        this.carregarElevadoresDoPredio(idPredio);
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

  // Envia uma requisição para editar um elevador existente.
  editarElevadorNoPredio(idPredio: string, idElevador: string, elevador: Elevador | ElevadorRequest): void {
    this.elevadorService.editarElevadorDoPredio(idPredio, idElevador, elevador)
    .subscribe({
      next: (res) => {
        console.log('Elevador editado com sucesso:', res);
        this.carregarElevadoresDoPredio(idPredio);
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

  // Envia uma requisição para deletar um elevador.
  deletarElevador(idElevador: string): void {
    if (this.predioId) {
      if (window.confirm('Tem certeza que deseja deletar este elevador?')) {
        this.elevadorService.removerElevadorDoPredio(this.predioId, idElevador)
        .subscribe({
          next: () => {
            console.log('Elevador removido com sucesso.');
            this.carregarElevadoresDoPredio(this.predioId!);
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
  }

  // Busca um elevador pelo seu modelo.
  buscarElevadorNoPredio(evento: Event){
    const input = evento.target as HTMLInputElement;
    const modelo = input.value
    if(!modelo){
      this.carregarElevadoresDoPredio(this.predioId!);
      return;
    }
    this.messagem = "Carregando elevadores, por favor espere...";
    this.estaCarregando = true;
    this.elevadorService.buscarElevadorDoPredio(this.predioId!, modelo)
    .subscribe({
      next: (res) => {
        if(res.length === 0){
          this.messagem = "Nenhum elevador encontrado";
          this.estaCarregando = false;
        }else{
          this.messagem = "";
          this.estaCarregando = false
        }
        this.elevadoresDoPredio = Array.from(res);
        this.cdr.detectChanges();
      },
      error: (err) =>{
        console.error(err.error);
        this.cdr.detectChanges();
        this.messagem = "Erro ao carregar elevadores";
        this.estaCarregando = false;
      },
    })
  }
  // Envia uma requisição para gerar um relatório em PDF.
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

  // Navega para a tela de componentes de um elevador selecionado.
  selecionarElevador(idElevador: string){
    this.selectedElevadorId = idElevador;
    console.log(this.selectedElevadorId)
    this.router.navigate(['/componentes', this.selectedElevadorId]);
  }
}
