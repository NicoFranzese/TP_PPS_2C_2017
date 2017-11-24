import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ResultadoEscaneadoProvider } from '../../providers/resultado-escaneado/resultado-escaneado'

/**
 * Generated class for the ResultadoEscaneadoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-resultado-escaneado',
  templateUrl: 'resultado-escaneado.html',
})
export class ResultadoEscaneadoPage {

  public resultadoEscaneado;

  constructor(public navCtrl: NavController, public navParams: NavParams,
            public servicioResultadoEscaneado: ResultadoEscaneadoProvider) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ResultadoEscaneadoPage');
  }

  ResultadoEscaneado() {
    this.servicioResultadoEscaneado.ResultadoEscaneado().subscribe(
      data => this.resultadoEscaneado = data,
      err => {
        console.error(err);
      },
      () => { }
    );
  }

}
