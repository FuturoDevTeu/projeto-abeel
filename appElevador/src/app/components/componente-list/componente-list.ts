import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Componente } from '../../types/Componente';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponenteService } from '../../services/componente-service';
import { FormsModule } from '@angular/forms';
import { ComponenteRequest } from '../../types/ComponenteRequest';
import { ElevadorService } from '../../services/elevador-service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PredioService } from '../../services/predio-service';

@Component({
  selector: 'app-componente-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './componente-list.html',
  styleUrls: ['./componente-list.css']
})
export class ComponenteList implements OnInit {
  elevadorId: string | null = null;
  componentes: Componente[] = [];

  // Modal e edição
  isModalOpen = false;
  isEditingMode = false;
  idComponenteEmEdicao: string | null = null;

  // Situações disponíveis (id + nome)
 situacoesDisponiveis: Componente['situacao'][] = [
  'APROVADO',
  'REPROVADO',
  'SIM',
  'NAO',
  'NAO_SE_APLICA'
];

  // Modelo do formulário
  componenteRequest: ComponenteRequest = {
    nome: '',
    situacao: 'APROVADO',
    observacao: '',
    hePadrao: false
  };

  situacoesLabels: Record<string, string> = {
    "APROVADO": "Aprovado",
    "REPROVADO": "Reprovado",
    "SIM": "Sim",
    "NAO": "Não",
    "NAO_SE_APLICA": "Não se aplica"
  };

  currentImageBase64?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private componenteService: ComponenteService,
    private cdr: ChangeDetectorRef,
    private elevadorService: ElevadorService,
    private predioService: PredioService
  ) {}

  ngOnInit(): void {
    this.elevadorId = this.route.snapshot.paramMap.get('id');
    if (this.elevadorId) {
      this.carregarListaComponentes(this.elevadorId);
    }
  }

  carregarListaComponentes(idElevador: string) {
    this.componenteService.carregarComponentesDoElevador(idElevador)
      .subscribe({
        next: (res) => {
          this.componentes = [...res];
          this.cdr.detectChanges();
          console.log(this.componentes);
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao carregar componentes.');
        }
      });
  }

  abrirModalParaCadastro() {
    this.isModalOpen = true;
    this.isEditingMode = false;
    this.idComponenteEmEdicao = null;
    this.componenteRequest = {
      nome: '',
      situacao: "APROVADO",
      observacao: '',
      hePadrao: false
    };
    this.currentImageBase64 = undefined;
  }

  abrirModalParaEdicao(componente: Componente) {
    this.isModalOpen = true;
    this.isEditingMode = true;
    this.idComponenteEmEdicao = componente.id;
    this.componenteRequest = {
      nome: componente.nome,
      situacao: componente.situacao, 
      observacao: componente.observacao || '',
      hePadrao: componente.hePadrao
    };
    this.currentImageBase64 = componente.imagemBase64;
  }

  fecharModal() {
    this.isModalOpen = false;
    this.isEditingMode = false;
    this.idComponenteEmEdicao = null;
    this.componenteRequest = {
      nome: '',
      situacao: "APROVADO",
      observacao: '',
      hePadrao: false
    };
    this.currentImageBase64 = undefined;
  }

  salvarFormulario() {
    if (!this.elevadorId) {
      alert('ID do elevador não definido.');
      return;
    }

    if (this.isEditingMode) {
      if (!this.idComponenteEmEdicao) return;
      this.editarComponente(this.elevadorId, this.idComponenteEmEdicao, this.componenteRequest);
    } else {
      this.cadastrarComponente(this.elevadorId, this.componenteRequest);
    }
  }

  cadastrarComponente(idElevador: string, componente: ComponenteRequest) {
    this.componenteService.cadastrarComponenteNoElevador(idElevador, componente)
      .subscribe({
        next: () => {
          alert('Componente cadastrado!');
          this.fecharModal();
          this.carregarListaComponentes(idElevador);
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao cadastrar.');
        }
      });
  }

  editarComponente(idElevador: string, idComponente: string, componente: ComponenteRequest) {
    this.componenteService.editarComponenteDoElevador(idElevador, idComponente, componente)
      .subscribe({
        next: () => {
          alert('Componente editado!');
          this.fecharModal();
          this.carregarListaComponentes(idElevador);
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao editar.');
        }
      });
  }

  deletarComponente(idComponente: string) {
    if (!this.elevadorId) return;
    if (!confirm('Deseja realmente deletar?')) return;

    this.componenteService.deletarComponenteDoElevador(this.elevadorId, idComponente)
      .subscribe({
        next: () => this.carregarListaComponentes(this.elevadorId!),
        error: (err) => {
          console.error(err);
          alert('Erro ao deletar.');
        }
      });
  }

  arquivoSelecionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.componenteRequest.imagem = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.currentImageBase64 = e.target.result;
      reader.readAsDataURL(file);
    } else {
      this.componenteRequest.imagem = undefined;
      this.currentImageBase64 = undefined;
    }
  }

  gerarRelatorio() {
    if (!this.elevadorId) return;
    this.elevadorService.gerarRelatorio(this.elevadorId)
      .subscribe({
        next: (blob) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'relatorio.pdf';
          link.click();
        },
        error: (err) => console.error(err)
      });
  }

  voltarElevador() {
    if (!this.elevadorId) return;
      this.predioService.buscarIdElevador(this.elevadorId)
      .subscribe({
        next: (predio) => {
          this.router.navigate(['/elevadores', predio.id]) },
    
        error: (err) => console.error(err)
      });
  }
}
