import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ModalImprimirAlumnosPdfPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-imprimir-alumnos-pdf',
  templateUrl: 'modal-imprimir-alumnos-pdf.html',
})
export class ModalImprimirAlumnosPdfPage {
  public items;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.items =  this.navParams.get('items');
    // this.confirmarExportacion();

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ModalImprimirAlumnosPdfPage');
  }

  confirmarExportacion(){
    if(document.getElementById("divImprimir") != null){
      let printContents, popupWin;
      printContents = document.getElementById('divImprimir').innerHTML;

      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>

          </head>
            <body onload="window.print();window.close()">${printContents}</body>
        </html>`
      );
      popupWin.document.close();
    }
  }

}
