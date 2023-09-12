import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { SeriesFBService } from 'src/app/services/series-fb.service';

@Component({
  selector: 'app-busca',
  templateUrl: './adicionar.page.html',
  styleUrls: ['./adicionar.page.scss'],
})

export class AdicionarPage implements OnInit {
  formAdicionar: FormGroup;
  submited: boolean = false;
  genderList: string[] = ["Ação", "Terror", "Teen", "Drama", "Policiais"];
  notas: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  imagem: any;

  constructor(
    private seriesFBService: SeriesFBService,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private router: Router,
    private loading: LoadingController,
  ) {
  }

  ngOnInit() {
    this.formAdicionar = this.formBuilder.group({
      titulo: ["", [Validators.required]],
      generos: ["", [Validators.required]],
      nota: ["", [Validators.required]],
      data: ["", [Validators.required]],
      totalEp: ["", [Validators.required]],
      assistidosEp: ["", [Validators.required]],
      imagem: ["", [Validators.required]],
    });
  }

  uploadFile(imagem : any){
    this.imagem = imagem.files;
  }

  submitForm() : boolean{
    console.log("a")
    this.submited = true;
    if(!this.formAdicionar.valid){
      this.presentAlert("Lista", "Adicionar Error", "Campos inválidos");
      return false;
    }else{
      this.presentAlert("Lista", "Adicionar", "A série foi adicionada a sua lista!");
      this.adicionar();
    }
  }

  get errorControl(){
    return this.formAdicionar.controls;
  }

  public cancel(){
    this.router.navigate(["/my-list"])
  }
  public adicionar(){
    this.showLoading("Aguarde", 10000);
    this.seriesFBService
    .enviarImagem(this.imagem, this.formAdicionar.value)
    .then(()=>{
      this.loading.dismiss();
      this.presentAlert("Lista", "Sucesso", "Série Adicionado!");
      this.router.navigate(["/my-list"]);
    })
    .catch((error)=>{
      this.loading.dismiss();
      this.presentAlert("Lista", "Erro", "Erro ao adicionar!");
      console.log(error);
    })

  }

  async presentAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async showLoading(mensagem : string, duracao : number) {
    const loading = await this.loading.create({
      message: mensagem,
      duration: duracao,
    });
    loading.present();
  }

}
