import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { EmpresaType } from '../../types/Empresa';
import { EmpresaRequest } from '../../types/EmpresaRequest';
import { EmpresaService } from '../../services/empresa-service';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [MatCardModule, CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './empresa.html',
  styleUrl: './empresa.css'
})
export class Empresa implements OnInit {

  empresas: EmpresaType[] = [];
  selectedEmpresaId: string | null = null;
  isModalOpen = false;
  empresa: EmpresaType = { id: '', nome: '' }; // só id e nome
  estaCarregando: boolean = false;
  mensagem: string = "";

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private empresaService: EmpresaService
  ) { }

  ngOnInit(): void {
    this.carregarEmpresas();
  }

  abrirModalParaCadastro(): void {
    this.empresa = { id: '', nome: '' };
    this.isModalOpen = true;
  }

  abrirModalParaEdicao(empresa: EmpresaType): void {
    this.empresa = { ...empresa };
    this.isModalOpen = true;
  }

  fecharModal(): void {
    this.isModalOpen = false;
    this.empresa = { id: '', nome: '' };
  }

  submitForm(): void {
    if (this.empresa.nome) {
      if (this.empresa.id) {
        this.editarEmpresa(this.empresa);
      } else {
        this.cadastrarEmpresa({ nome: this.empresa.nome });
      }
      this.fecharModal();
    }
  }

  carregarEmpresas(): void {
    this.estaCarregando = true;
    this.mensagem = "Carregando empresas, por favor espere...";
    this.empresaService.obterEmpresas()
      .subscribe({
        next: (empresas) => {
          this.empresas = Array.from(empresas);
          this.mensagem = this.empresas.length === 0 ? "Nenhuma empresa encontrada" : '';
          this.estaCarregando = false;
          this.selectedEmpresaId = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao carregar empresas', err);
          this.empresas = [];
          this.estaCarregando = false;
          this.mensagem = 'Erro ao carregar empresas';
          this.cdr.detectChanges();
        }
      });
  }

  cadastrarEmpresa(empresa: EmpresaRequest): void {
    this.empresaService.cadastrarEmpresa(empresa)
      .subscribe({
        next: () => this.carregarEmpresas(),
        error: (err) => this.tratarErro(err)
      });
  }

  deletarEmpresa(idEmpresa: string): void {
    if (confirm('Tem certeza que deseja deletar esta empresa?')) {
      this.empresaService.deletarEmpresa(idEmpresa)
        .subscribe({
          next: () => {
            this.carregarEmpresas();
            this.cdr.detectChanges();
          },
          error: (err) => this.tratarErro(err)
        });
    }
  }

  editarEmpresa(empresa: EmpresaType): void {
    this.empresaService.editarEmpresa(empresa)
      .subscribe({
        next: () => this.carregarEmpresas(),
        error: (err) => this.tratarErro(err)
      });
  }

  selecionarEmpresa(id: string): void {
    this.selectedEmpresaId = id;
    this.router.navigate(['/predios', id]);
  }

  private tratarErro(err: any): void {
    if (typeof err.error === 'string') {
      window.alert(err.error);
    } else {
      window.alert("Ocorreu um erro inesperado");
    }
    this.cdr.detectChanges();
  }
}
