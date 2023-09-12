import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Serie } from '../models/serie'
import { finalize } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class SeriesFBService {
  private PATH: string = "series";

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage,
  ) { }

  getSerie(id: string){
    return this.angularFirestore.collection(this.PATH).doc(id).valueChanges();
  }
  getSeries(){
    return this.angularFirestore
      .collection(this.PATH)
      .snapshotChanges();
  }
  inserirSerie(serie: Serie){
    return this.angularFirestore
      .collection(this.PATH)
      .add({
        titulo: serie.titulo,
        generos: serie.generos,
        imageLink: serie.imageLink,
        nota: serie.nota,
        data: serie.data,
        totalEp: serie.totalEp,
        assistidosEp: serie.assistidosEp,
      })
  }
  editarSerie(serie: Serie, id: string){
    return this.angularFirestore
      .collection(this.PATH)
      .doc(id)
      .update({
        titulo: serie.titulo,
        generos: serie.generos,
        nota: serie.nota,
        data: serie.data,
        totalEp: serie.totalEp,
        assistidosEp: serie.assistidosEp,
      })
  }
  excluirSerie(serie: Serie){
    return this.angularFirestore.collection(this.PATH).doc(serie.id).delete();
  }
  enviarImagem(imagem: any, serie: Serie){
    const file = imagem.item(0);
    if(file.type.split('/')[0] !== 'image'){  //Verifica se é do tipo imagem ("/image")
      console.error("Tipo não reconhecido ou não suportado");
      return;
    }
    const path = `images/${new Date().getTime()}_${file.name}`; //deve ser com craze ` !== '
    const fileRef = this.angularFireStorage.ref(path);
    let task = this.angularFireStorage.upload(path, file);
    task.snapshotChanges().pipe(
      finalize(() => {
        let imageLink = fileRef.getDownloadURL()
        imageLink.subscribe((resp) => {
          serie.imageLink = resp
          this.inserirSerie(serie)
        })
      })
    ).subscribe()
    return task;
  }
}
