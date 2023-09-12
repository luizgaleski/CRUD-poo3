import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Serie } from 'src/app/models/serie';
import { SeriesFBService } from 'src/app/services/series-fb.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {
  serie: Serie;
  edicao: boolean = true;
  formEditar: FormGroup;
  isSubmitted: boolean = false;
  
  constructor(
    private router: Router,
    private serieFBService: SeriesFBService,
    private alertController: AlertController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.serie = nav.extras.state.object;
    console.log(this.serie)
    this.formEditar = this.formBuilder.group({
      titulo:[this.serie.titulo ,[Validators.required]],
      generos:[this.serie.generos,[Validators.required]],
      totalEp:[this.serie.totalEp,[Validators.required]],
      assistidosEp:[this.serie.assistidosEp ,[Validators.required]]
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
    this.serieFBService. editarSerie(this.formEditar.value, this.serie.id)
    .then(()=>{
    
      this.presentAlert("Lista", "Sucesso", "Série Cadastrada!");
      this.router.navigate(["/my-list"]);
    })
    .catch((error)=>{
     
      this.presentAlert("Lista", "Erro", "Erro ao cadastrar!");
      console.log(error);
    })
    
    
  }

  excluir(): void{
    this.presentAlertConfirm("Lista", "Excluir Série",
    "Você realmente deseja excluir a série?");
  }

excluirSerie(){
  this.serieFBService.excluirSerie(this.serie)
  .then(()=>{
    this.presentAlert("Lista", "Sucesso", "Série excluída!");
    this.router.navigate(["/my-list"]);
  })
  .catch((error)=>{
    this.presentAlert("Lista", "Erro", "Erro ao excluir!");
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
          this.excluirSerie()
          }
        }
      ],
    });
    await alert.present();
  }
}


