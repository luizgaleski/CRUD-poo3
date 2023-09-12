import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Serie } from 'src/app/models/serie';
import { SeriesFBService } from 'src/app/services/series-fb.service';


//suggestion e favorites vira apenas tags

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.page.html',
  styleUrls: ['./my-list.page.scss'],
})
export class MyListPage {
  minhas_series: Serie[];
  searchItems: string = "";

  constructor(
    private serieFBService: SeriesFBService,
    private router: Router,
  ) {
    this.carregarSeries();
  }
  carregarSeries(){
    this.serieFBService.getSeries().subscribe(res => {
      this.minhas_series = res.map(c => {
        return {
          id: c.payload.doc.id,
          ...c.payload.doc.data() as Serie,
        } as Serie;
      })
    });
  }

  searchMyAnime( event ){
    this.searchItems = event.detail.value;
  }

  irParaAdicionar(){
    this.router.navigate(['/adicionar']);
  }
  
  irParaEdicao(serie: Serie){
    this.router.navigateByUrl("/editar",
      { state: {object: serie} }
    )
  }

}
