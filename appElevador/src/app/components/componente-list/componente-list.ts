import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Componente } from '../../types/Componente';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ComponenteService } from '../../services/componente-service';
import { FormsModule } from '@angular/forms';
import { ComponenteRequest } from '../../types/ComponenteRequest';
import { ElevadorService } from '../../services/elevador-service';
import { Elevador } from '../../types/Elevador';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-componente-list',
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './componente-list.html',
  styleUrl: './componente-list.css'
})
export class ComponenteList implements OnInit{
  elevadorId: string | null = null;
  componentes: Componente[] = [];
  idComponenteSelecionado = "";
  isModalOpen = false;
  componente: Componente = {id: "", nome: "", hePadrao: false, situacao: true, imagemBase64: undefined, observacao: ""}
  componenteRequest: ComponenteRequest = {nome: "", hePadrao: false, imagem: undefined, observacao: "", situacao: true};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private componenteService: ComponenteService,
    private cdr: ChangeDetectorRef,
    private elevadorService: ElevadorService
  ){}

  ngOnInit(): void {
    this.elevadorId =  this.route.snapshot.paramMap.get('id');
    console.log(this.elevadorId)

    if(this.elevadorId != null){
      this.carregarListaComponentes(this.elevadorId);
      return;
    }
    console.error("ID do elevadornão encontrado na rota de componentes. Verifique a URL.");
    this.componentes = [];
    this.cdr.detectChanges();

  }

  carregarListaComponentes(elevadorId: string){
    this.componenteService.carregarComponentesDoElevador(elevadorId)
    .subscribe({
      next: (componente) => {
        this.componentes = Array.from(componente);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      },
    })
  }

  cadastrarComponente(idElevador: string, componente: ComponenteRequest){
    this.componenteService.cadastrarComponenteNoElevador(idElevador, componente)
    .subscribe({
      next: (res) =>{
        console.log(res);
        this.cdr.detectChanges();
        this.carregarListaComponentes(idElevador);
      },
      error: (err) => {
        console.error(err);
        this.cdr.detectChanges();
      },
    })
  }

  arquivoSelecionado(event: Event){
    const input = event.target as HTMLInputElement;

    if(input.files && input.files.length > 0){
      this.componenteRequest.imagem = input.files[0];
    }
  }

  gerarRelatorio(){
    console.log("Estou no relatorio, id do elevador: ", this.elevadorId);
    if(!this.elevadorId){
      console.log("Elevador esta vazio");
    }
    this.elevadorService.gerarRelatorio(this.elevadorId!)
    .subscribe({
      next: (blob) =>{
        const fileUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "relatorio.pdf";
        link.click();
        URL.revokeObjectURL(fileUrl);
      },
      error: (err) => {
        console.log(err.error);
      },
    })
  }
  fecharModal(): void {
    this.isModalOpen = false;
    this.componenteRequest = { nome: '', hePadrao: false, imagem: undefined, observacao: "" };
  }
  editarComponente(componente: ComponenteRequest | Componente){

  }
  voltarElevador(){
    let elevador:Elevador = {id: '', modelo: '',predioId: '', componentes: []} 
    if(this.elevadorId){
      console.log("Estou na função, "+ this.elevadorId)
      this.elevadorService.buscarId(this.elevadorId)
      .subscribe({
        next: (elevador) =>{
          console.log(elevador.modelo);
          console.log(elevador.predioId);

          this.router.navigate(['/elevadores/', elevador.predioId])
          .catch( () =>{
            this.router.navigate(["/login"]);
          });
        },
        error: (err) =>{
          window.alert(err.err);
        }
      })
    }else{
      window.alert("Erro inesperado");
    }
  }
}