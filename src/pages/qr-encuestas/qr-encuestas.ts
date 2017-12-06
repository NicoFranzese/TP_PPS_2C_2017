import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DataProvider } from '../../providers/data/data';
import { EncuestaPage } from '../encuesta/encuesta';


@IonicPage()
@Component({
  selector: 'page-qr-encuestas',
  templateUrl: 'qr-encuestas.html',
})
export class QrEncuestasPage {

  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private barcodeScanner: BarcodeScanner,
              private dataProvider: DataProvider)
  {
    
  }

  ionViewDidLoad() {
    this.escanear();
  }

  private escanear() 
  {
    this.barcodeScanner.scan().then((barcodeData) => {
      let idLeido = Number.parseInt(barcodeData.text);
      this.navCtrl.push(EncuestaPage, {'id': idLeido});
      
     }, (err) => {
         console.error(err);
     });
  }

 

}
