import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the GlobalFxProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalFxProvider {

  constructor(public http: Http,private alertCtrl: AlertController) {
    console.log('Hello GlobalFxProvider Provider');
  }

  presentConfirm(title,msj): boolean {
    let result : boolean;
    let alert = this.alertCtrl.create({
      title: 'Confirmar envío',
      message: '¿Desea enviar los datos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            result = false;
          }
        },
        {
          text: 'Enviar',
          handler: () => {
           result = true;
          }
        }
      ]
    });
    alert.present();
    return result;
  }



}
