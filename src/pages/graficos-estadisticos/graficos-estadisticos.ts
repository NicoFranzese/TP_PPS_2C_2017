import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-graficos-estadisticos',
  templateUrl: 'graficos-estadisticos.html',
})
export class GraficosEstadisticosPage {

  private idEncuesta;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

    //NICO: cuando le tengo que mostrar al usuario el resultado de la encuesta lo mando a esta pàgina
    //y te mando el id de la encuesta

    if(this.navParams.get('idEncuesta'))
      this.idEncuesta = this.navParams.get('idEncuesta');
  }

}
