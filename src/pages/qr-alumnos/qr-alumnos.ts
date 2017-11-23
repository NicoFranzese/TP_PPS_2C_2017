import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { Toast } from '@ionic-native/toast'

import { EscanearQrProvider } from '../../providers/escanear-qr/escanear-qr'

import { ResultadoEscaneadoPage } from '../resultado-escaneado/resultado-escaneado';

import { PrincipalPage } from '../principal/principal';
/**
 * Generated class for the QrAlumnosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr-alumnos',
  templateUrl: 'qr-alumnos.html',
})
export class QrAlumnosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private toast: Toast,
    public servicioEscanearQr: EscanearQrProvider) {
    this.escanear();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad QrAlumnosPage');
  }


  escanear() {
    this.barcodeScanner.scan().then((barcodeData) => {
      // alert(barcodeData.text);
      this.servicioEscanearQr.EscanearQr(barcodeData.text, "Alumno").subscribe(
        data => console.info(),
        err => { console.error(err); },
        () => {
          localStorage.getItem("Resultado Escaneo");
          this.navCtrl.push(ResultadoEscaneadoPage);
        }
      );
    }, (err) => {
      try {
        this.toast.show('Código QR Erróneo', '4000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
        );
      } catch (e) {
        // alert("Código QR Erróneo");
      }
      this.navCtrl.push(PrincipalPage);
    });
  }

}
