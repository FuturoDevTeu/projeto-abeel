import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Componente } from '../../types/Componente'; // Certifique-se que Componente tem 'id'
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Adicionado RouterLink
import { ComponenteService } from '../../services/componente-service';
import { FormsModule } from '@angular/forms';
import { ComponenteRequest } from '../../types/ComponenteRequest';
import { ElevadorService } from '../../services/elevador-service';
import { Elevador } from '../../types/Elevador';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-componente-list',
  standalone: true, // Adicionado: Se o seu componente for standalone
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule], // RouterLink adicionado
  templateUrl: './componente-list.html',
  styleUrl: './componente-list.css'
})
export class ComponenteList implements OnInit{
  elevadorId: string | null = null;
  componentes: Componente[] = [];
  
  // NOVAS PROPRIEDADES PARA O MODAL E EDIÇÃO
  isModalOpen: boolean = false; // Controla a visibilidade do modal
  isEditingMode: boolean = false; // True se estiver editando, False se estiver cadastrando
  idComponenteEmEdicao: string | null = null; // Armazena o ID do componente sendo editado

  componenteRequest: ComponenteRequest = {nome: "", hePadrao: false, imagem: undefined, observacao: "", situacao: true};
  // Propriedade para guardar a imagem Base64 do componente atual para pré-visualização no modal
  currentImageBase64: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private componenteService: ComponenteService,
    private cdr: ChangeDetectorRef,
    private elevadorService: ElevadorService
  ){}

  ngOnInit(): void {
    this.elevadorId = this.route.snapshot.paramMap.get('id');
    console.log("ID do Elevador na inicialização:", this.elevadorId);

    if(this.elevadorId){
      this.carregarListaComponentes(this.elevadorId);
      return;
    }
    console.error("ID do elevador não encontrado na rota de componentes. Verifique a URL.");
    this.componentes = [];
    this.cdr.detectChanges(); // Garante que a UI reflita a lista vazia
  }

  carregarListaComponentes(elevadorId: string): void {
    this.componenteService.carregarComponentesDoElevador(elevadorId)
    .subscribe({
      next: (componente) => {
        this.componentes = Array.from(componente);
        this.cdr.detectChanges(); // Notifica o Angular para atualizar a view
      },
      error: (err) => {
        console.error("Erro ao carregar componentes:", err);
        // Você pode adicionar um alert ou uma mensagem na tela para o usuário aqui
        alert("Não foi possível carregar os componentes. Tente novamente mais tarde.");
      },
    })
  }

  // --- Funções para controle do Modal ---
  abrirModalParaCadastro(): void {
    this.isModalOpen = true;
    this.isEditingMode = false;
    this.idComponenteEmEdicao = null;
    // Reseta o formulário para um novo cadastro
    this.componenteRequest = {nome: "", hePadrao: false, imagem: undefined, observacao: "", situacao: true};
    this.currentImageBase64 = undefined; // Limpa qualquer pré-visualização de imagem anterior
  }

  abrirModalParaEdicao(componente: Componente): void {
    this.isModalOpen = true;
    this.isEditingMode = true;
    this.idComponenteEmEdicao = componente.id; // Salva o ID do componente que está sendo editado
    
    // Preenche o formulário com os dados do componente selecionado
    this.componenteRequest = {
      nome: componente.nome,
      situacao: componente.situacao,
      observacao: componente.observacao || "", // Garante que não seja undefined
      hePadrao: componente.hePadrao,
      imagem: undefined // A imagem File não é carregada para edição, o usuário terá que selecionar novamente
    };
    // Salva a imagemBase64 para pré-visualização no modal
    this.currentImageBase64 = componente.imagemBase64;
  }

  fecharModal(): void {
    this.isModalOpen = false;
    // Reseta todas as variáveis relacionadas ao modal e formulário
    this.componenteRequest = { nome: '', hePadrao: false, imagem: undefined, observacao: "", situacao: true };
    this.idComponenteEmEdicao = null;
    this.isEditingMode = false;
    this.currentImageBase64 = undefined;
  }

  // --- Lógica de Cadastro/Edição de Componente (Disparador do formulário) ---
  salvarFormulario(): void {
    if (!this.elevadorId) {
      console.error("ID do elevador não disponível para cadastro/edição.");
      alert("Erro: ID do elevador não encontrado.");
      return;
    }

    // Validação de Frontend: Imagem obrigatória se situação for Ruim E não houver uma imagem existente
    // Se o modo é edição e já existe uma imagem (currentImageBase64 está definido)
    // ou se o modo é cadastro/edição e uma nova imagem foi selecionada (componenteRequest.imagem está definido)
    if (this.componenteRequest.situacao === false && !this.componenteRequest.imagem && !this.currentImageBase64) {
      alert('Para a situação "Ruim", é obrigatório fornecer uma imagem.');
      return;
    }

    if (this.isEditingMode) {
      // Modo de edição
      if (!this.idComponenteEmEdicao) {
        console.error("ID do componente para edição não encontrado.");
        alert("Erro: ID do componente para edição inválido.");
        return;
      }
      this.editarComponente(this.elevadorId, this.idComponenteEmEdicao, this.componenteRequest);
    } else {
      // Modo de cadastro
      this.cadastrarComponente(this.elevadorId, this.componenteRequest);
    }
  }

  // --- Função de Cadastro (chamada por salvarFormulario) ---
  // Seu método de cadastro já estava bom. Mantive ele separado para clareza.
  cadastrarComponente(idElevador: string, componente: ComponenteRequest): void {
    this.componenteService.cadastrarComponenteNoElevador(idElevador, componente)
    .subscribe({
      next: (res) =>{
        console.log("Componente cadastrado com sucesso:", res);
        alert("Componente cadastrado com sucesso!");
        this.fecharModal(); // Fecha o modal após o cadastro
        this.carregarListaComponentes(idElevador); // Recarrega a lista para mostrar o novo componente
      },
      error: (err) => {
        console.error("Erro ao cadastrar componente:", err);
        alert("Erro ao cadastrar componente.");
      },
    })
  }

  // --- Função de Edição (chamada por salvarFormulario) ---
  editarComponente(idElevador: string, idComponente: string, componente: ComponenteRequest): void {
    // IMPORTANTE: Seu serviço 'editarComponenteDoElevador' foi alterado para enviar FormData.
    // Isso pressupõe que seu endpoint PUT no backend ('/componente/{idElevador}/{idComponente}')
    // está configurado para receber 'multipart/form-data' e um 'MultipartFile' para a imagem,
    // assim como seu endpoint de cadastro.
    // Se seu backend não aceitar MultipartFile no PUT, esta parte precisará ser ajustada.
    
    this.componenteService.editarComponenteDoElevador(idElevador, idComponente, componente)
      .subscribe({
        next: (res) => {
          console.log("Componente editado com sucesso:", res);
          alert("Componente editado com sucesso!");
          this.fecharModal(); // Fecha o modal após a edição
          this.carregarListaComponentes(idElevador); // Recarrega a lista
        },
        error: (err) => {
          console.error("Erro ao editar componente:", err);
          alert("Erro ao editar componente.");
        },
      });
  }

  // --- Função de Deleção ---
  deletarComponente(idComponente: string): void {
    if (!this.elevadorId) {
      console.error("ID do elevador não disponível para deleção.");
      alert("Erro: ID do elevador não encontrado.");
      return;
    }
    if (confirm('Tem certeza que deseja deletar este componente? Esta ação não pode ser desfeita.')) {
      this.componenteService.deletarComponenteDoElevador(this.elevadorId, idComponente)
        .subscribe({
          next: (res) => {
            console.log("Componente deletado com sucesso:", res);
            alert("Componente deletado com sucesso!");
            this.carregarListaComponentes(this.elevadorId!);
          },
          error: (err) => {
            console.error("Erro ao deletar componente:", err);
            alert("Erro ao deletar componente.");
          },
        });
    }
  }

  // --- Lógica para seleção de arquivo (agora com pré-visualização para o modal) ---
  arquivoSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;

    if(input.files && input.files.length > 0){
      const file = input.files[0];
      this.componenteRequest.imagem = file; // Salva o objeto File

      // Pré-visualiza a imagem no modal
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentImageBase64 = e.target.result;
      };
      reader.readAsDataURL(file);

    } else {
      this.componenteRequest.imagem = undefined;
      this.currentImageBase64 = undefined; // Limpa a pré-visualização se nenhum arquivo for selecionado
    }
  }

  // --- Outras Funções (mantidas as originais) ---
  gerarRelatorio(): void {
    console.log("Gerando relatório para o elevador ID:", this.elevadorId);
    if(!this.elevadorId){
      console.error("Elevador ID está vazio. Não é possível gerar relatório.");
      alert("Erro: ID do elevador não disponível para gerar relatório.");
      return;
    }
    this.elevadorService.gerarRelatorio(this.elevadorId)
    .subscribe({
      next: (blob) =>{
        const fileUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "relatorio.pdf"; // Nome do arquivo a ser baixado
        link.click();
        URL.revokeObjectURL(fileUrl); // Libera o URL do objeto
        alert("Relatório gerado e download iniciado!");
      },
      error: (err) => {
        console.error("Erro ao gerar relatório:", err);
        alert("Erro ao gerar relatório.");
      },
    })
  }

  voltarElevador(): void {
    if(this.elevadorId){
      console.log("Buscando elevador para retornar, ID:", this.elevadorId)
      this.elevadorService.buscarId(this.elevadorId)
      .subscribe({
        next: (elevador) =>{
          console.log("Modelo do Elevador:", elevador.modelo);
          console.log("Predio ID do Elevador:", elevador.predioId);

          this.router.navigate(['/elevadores/', elevador.predioId])
          .catch( (error) =>{ // Captura erros de navegação
            console.error("Erro ao navegar para elevadores:", error);
            alert("Erro ao navegar de volta para o prédio. Redirecionando para login.");
            this.router.navigate(["/login"]);
          });
        },
        error: (err) =>{
          console.error("Erro ao buscar elevador para voltar:", err);
          alert("Erro inesperado ao voltar.");
        }
      })
    }else{
      alert("Erro inesperado: ID do elevador não definido para voltar.");
    }
  }
}