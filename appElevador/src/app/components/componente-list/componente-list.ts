import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Componente } from '../../types/Componente';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponenteService } from '../../services/componente-service';
import { FormsModule } from '@angular/forms';
import { ComponenteRequest } from '../../types/ComponenteRequest';
import { ElevadorService } from '../../services/elevador-service';

@Component({
  selector: 'app-componente-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './componente-list.html',
  styleUrl: './componente-list.css'
})
export class ComponenteList implements OnInit{
  elevadorId: string | null = null;
  componentes: Componente[] = [];
  idComponenteSelecionado = "";
  componenteRequest: ComponenteRequest = {nome: "", hePadrao: false, imagem: undefined, observacao: "", situacao: false};

  constructor(
    private route: ActivatedRoute,
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
        console.log(err);
      },
    })
  }
  

}
