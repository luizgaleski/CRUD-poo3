import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Anime } from 'src/app/models/anime';
import { AnimesFBService } from 'src/app/services/animes-fb.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {
  anime: Anime;
  edicao: boolean = true;
  formEditar: FormGroup;
  isSubmitted: boolean = false;
  
  constructor(
    private router: Router,
    private animeFBService: AnimesFBService,
    private alertController: AlertController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.anime = nav.extras.state.object;
    console.log(this.anime)
    this.formEditar = this.formBuilder.group({
      titulo:[this.anime.titulo ,[Validators.required]],
      generos:[this.anime.generos,[Validators.required]],
      totalEp:[this.anime.totalEp,[Validators.required]],
      assistidosEp:[this.anime.assistidosEp ,[Validators.required]]
    });
  }

  submitForm(): boolean{
    this.isSubmitted = true;
    if(!this.formEditar.valid){
      this.presentAlert("Agenda", "Erro",
      "Todos os campos são Obrigatórios!");
      return false;
    }else{
      this.editar();
    }
  }

  aplicar(): void{
    if(this.edicao == false){
      this.edicao = true;
    }else{
      this.edicao = false;
    }
  }

  editar(){
    this.animeFBService.editarAnime(this.formEditar.value, this.anime.id)
    .then(()=>{
    
      this.presentAlert("Agenda", "Sucesso", "Cliente Cadastrado!");
      this.router.navigate(["/my-list"]);
    })
    .catch((error)=>{
     
      this.presentAlert("Agenda", "Erro", "Erro ao cadastrar!");
      console.log(error);
    })
    
    
  }

  excluir(): void{
    this.presentAlertConfirm("Agenda", "Excluir Contato",
    "Você realmente deseja excluir o contato?");
  }

excluirAnime(){
  this.animeFBService.excluirAnime(this.anime)
  .then(()=>{
    this.presentAlert("Agenda", "Sucesso", "Contato excluído!");
    this.router.navigate(["/my-list"]);
  })
  .catch((error)=>{
    this.presentAlert("Agenda", "Erro", "Erro ao excluir!");
    console.log(error);
  })
  }

  async presentAlert(cabecalho: string, subcabecalho: string,
    mensagem: string) {
    const alert = await this.alertController.create({
      header: cabecalho,
      subHeader: subcabecalho,
      message: mensagem,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentAlertConfirm(cabecalho: string,
    subcabecalho: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: cabecalho,
      subHeader: subcabecalho,
      message: mensagem,
      buttons: [
        {
          text:'Cancelar',
          role:'cancelar',
          cssClass:'secondary',
          handler: ()=>{
            console.log("Cancelou")
          }
        },
        {
          text:'Confirmar',
          role: 'confirm',
          handler: ()=>{
          this.excluirAnime()
          }
        }
      ],
    });
    await alert.present();
  }
}


