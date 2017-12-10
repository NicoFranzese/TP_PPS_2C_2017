import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

// import { Toast } from '@ionic-native/toast'

import { EscanearQrProvider } from '../../providers/escanear-qr/escanear-qr'

import { ResultadoEscaneadoPage } from '../resultado-escaneado/resultado-escaneado';

import { PrincipalPage } from '../principal/principal';

import { LoadingController } from 'ionic-angular';

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

  public items;
  public personas;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    // private toast: Toast,
    public servicioEscanearQr: EscanearQrProvider,
    public loadingCtrl: LoadingController) {
    this.escanear();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad QrAlumnosPage');
  }


  escanear() {
    // configuro spinner para mientras se cargan los datos 
    const loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    loading.present();

    let CodigoQROK = 0;

    this.barcodeScanner.scan().then((barcodeData) => {
      let arr = (barcodeData.text).split("-");
      // console.log(arr);
      // console.log(arr[0]);
      // console.log(arr[1]);
      let materia = arr[0];
      let comision = arr[1];

    /*Ir a la tabla Cursos y ver si existe PPS Si existe en campo "sigla_materia" y si existe la comision en el campo comision
      Si se da la condicion anterior, que me muestre el Aula, horario y Legajo profesor.*/

      this.servicioEscanearQr.getExisteQR("entidades_persona").subscribe(        
        datos => {      
          this.personas = datos;
          setTimeout(() => {
            loading.dismiss();
          }, 3000);
        },
        error => {console.error(error); this.navCtrl.push(PrincipalPage);},
        () => {console.log("ok");}
      );   

      this.servicioEscanearQr.getExisteQR("cursos").subscribe(
        datos => {      
          this.items = datos;
          setTimeout(() => {
            loading.dismiss();
          }, 3000);

          //Valido que el código QR sea válido
          this.items.forEach(element => {      
            if ((element.sigla_materia==materia) && (element.comision==comision)) {
              this.personas.forEach(per => {
                if (element.legajo_docente==per.legajo) {
                  console.log("legajo curso ;"+element.legajo_docente);
                  console.log("legajo persona ;"+per.legajo);
                  CodigoQROK = 1;
                  localStorage.setItem("profesorEscaneado", per.nombre_apellido);
                  localStorage.setItem("aulaEscaneada", element.aula);
                  localStorage.setItem("horarioEscaneada", element.dia_horario);
                }
              });
            }
          });

          if(CodigoQROK == 1){
            localStorage.setItem("materiaEscaneada", materia);
            localStorage.setItem("comisionEscaneada", comision);
            localStorage.setItem("escaneoDesde", "Alumnos");
            this.navCtrl.push(ResultadoEscaneadoPage);
          }else{
            localStorage.setItem("materiaEscaneada", "");
            localStorage.setItem("comisionEscaneada", "");
            localStorage.setItem("escaneoDesde", "");
            localStorage.setItem("profesorEscaneado", "");
            alert("Codigo QR Erróneo");            
            this.navCtrl.push(PrincipalPage);
          }   
        },
        error => {console.error(error); this.navCtrl.push(PrincipalPage);},
        () => {console.log("ok");}
      );    
    });
  }

}
