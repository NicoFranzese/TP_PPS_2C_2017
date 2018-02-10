import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

// import { Toast } from '@ionic-native/toast'

import { EscanearQrProvider } from '../../providers/escanear-qr/escanear-qr'

import { ResultadoEscaneadoPage } from '../resultado-escaneado/resultado-escaneado';

import { PrincipalPage } from '../principal/principal';

import { LoadingController } from 'ionic-angular';
import { GlobalFxProvider } from '../../providers/global-fx/global-fx';
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
  public horaActual;
  public horaABuscar;
  public auxCursosF1;
  public auxCursos;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    // private toast: Toast,
    public servicioEscanearQr: EscanearQrProvider,
    public loadingCtrl: LoadingController,
    private gFx: GlobalFxProvider) {
    this.escanear();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad QrAlumnosPage');
  }

  // escanear() {
  //   const loading = this.loadingCtrl.create({
  //     content: 'Espere por favor...'
  //   });
  //   loading.present();

  //   let CodigoQROK = 0;

  //   this.barcodeScanner.scan().then((barcodeData) => {

  //     var f=new Date();
  //     this.horaActual=f.getHours(); 
  //     console.log(this.horaABuscar);
  //     if (this.horaActual < 12){
  //       this.horaABuscar = "8:30";
  //       console.log(this.horaABuscar);
  //     }else{
  //       this.horaABuscar = "18:30";
  //       console.log(this.horaABuscar);
  //     }

  //     let arr = (barcodeData.text).split("-");
  //     let materia = arr[0];
  //     let comision = arr[1];

  //     this.servicioEscanearQr.getExisteQR("entidades_persona").subscribe(        
  //       datos => {      
  //         this.personas = datos;
  //         setTimeout(() => {
  //           loading.dismiss();
  //         }, 3000);
  //       },
  //       error => {console.error(error); this.navCtrl.push(PrincipalPage);},
  //       () => {console.log("ok");}
  //     );   

  //     this.servicioEscanearQr.getExisteQR("cursos").subscribe(
  //       datos => {      
  //         this.items = datos;
  //         setTimeout(() => {
  //           loading.dismiss();
  //         }, 3000);

  //         this.auxCursosF1 = this.items.filter((item) => {
  //           return (item.dia_horario.trim().toLowerCase().indexOf(this.horaABuscar.toLowerCase()) > -1);
  //         });

  //         this.auxCursosF1.forEach(element => {  
  //           if (element==aula) {
  //             this.auxCursos = element;              
  //           }
  //         });

  //         this.auxCursos.forEach(element => {      
  //             this.personas.forEach(per => {
  //               if (element.legajo_docente==per.legajo) {
  //                 CodigoQROK = 1;
  //                 localStorage.setItem("profesorEscaneado", per.nombre_apellido);
  //                 localStorage.setItem("aulaEscaneada", element.aula);
  //                 localStorage.setItem("horarioEscaneada", element.dia_horario);
  //                 localStorage.setItem("comisionEscaneada", element.comision);
  //                 localStorage.setItem("materiaEscaneada", element.sigla_materia);
  //               }
  //             });
  //           // }
  //         });

  //         if(CodigoQROK == 1){           
  //           localStorage.setItem("escaneoDesde", "Alumnos");
  //           this.navCtrl.push(ResultadoEscaneadoPage);
  //         }else{
  //           localStorage.setItem("materiaEscaneada", "");
  //           localStorage.setItem("comisionEscaneada", "");
  //           localStorage.setItem("escaneoDesde", "");
  //           localStorage.setItem("profesorEscaneado", "");
  //           this.gFx.presentToast("Codigo QR Erróneo");           
  //           this.navCtrl.push(PrincipalPage);
  //         }   
  //       },
  //       error => {console.error(error); this.navCtrl.push(PrincipalPage);},
  //       () => {console.log("ok");}
  //     );    
  //   });
  // }

  escanear() {
    const loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    loading.present();

    let CodigoQROK = 0;

    this.barcodeScanner.scan().then((barcodeData) => {
      let arr = (barcodeData.text).split("-");
      let materia = arr[0];
      let comision = arr[1];

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

          this.items.forEach(element => {      
            if ((element.sigla_materia==materia) && (element.comision==comision)) {
              this.personas.forEach(per => {
                if (element.legajo_docente==per.legajo) {
                  // console.log("legajo curso ;"+element.legajo_docente);
                  // console.log("legajo persona ;"+per.legajo);
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
            this.gFx.presentToast("Codigo QR Erróneo o no ha escaneado uno.");            
            this.navCtrl.push(PrincipalPage);
          }   
        },
        error => {console.error(error); this.navCtrl.push(PrincipalPage);},
        () => {console.log("ok");}
      );    
    });
  }

}
