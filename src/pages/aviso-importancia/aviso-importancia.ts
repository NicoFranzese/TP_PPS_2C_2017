import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { LocalNotifications } from '@ionic-native/local-notifications';

/**
 * Generated class for the AvisoImportanciaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aviso-importancia',
  templateUrl: 'aviso-importancia.html',
})
export class AvisoImportanciaPage {
  public mensaje;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public localNoti: LocalNotifications,
              public platform: Platform) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad AvisoImportanciaPage');
  }

  PushClicked(){
    this.platform.ready().then(() => {
      this.localNoti.schedule({
        title: 'Alerta de Gestión Académica!',
        text: this.mensaje,
        at: new Date(new Date().getTime() + 3600),
        led: 'FF0000',
        icon:'', //ruta del icono
        sound: null //Ruta del archivo de sonido
     });
    });
  }


}
