import { Injectable } from '@angular/core';
import { AlmacenDatosProvider } from '../../providers/almacen-datos/almacen-datos';
import { DataProvider } from '../../providers/data/data';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { EncuestaPage } from '../../pages/encuesta/encuesta';
import { AbmCuestionariosPage } from '../../pages/abm-cuestionarios/abm-cuestionarios';
import { App } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';


@Injectable()
export class QrEncuestasProvider {

  private nav;
  private arrCuestionarios = [];

  constructor(private toastCtrl: ToastController,
              private dataProvider: DataProvider,
              private app: App,
              private barcodeScanner: BarcodeScanner,
              private almacenDatosProvider: AlmacenDatosProvider,
              private alertCtrl: AlertController) 
  {
    this.nav = this.app.getActiveNav();
    this.traerCuestionarios();
  }

  public escanearQR()
  {
    this.barcodeScanner.scan().then((barcodeData) => 
    {
      let idLeido = Number.parseInt(barcodeData.text);
      this.verificarEntidad(idLeido);

     }, (err) => {
         console.error(err);
     });
  }

  public verificarEntidad(idLeido: number)
  {
    let encontradoBand: boolean = false;
    let empezoVotacion;
    let tituloAlert;

    if(this.almacenDatosProvider.usuarioLogueado.tipo_entidad == 'docente')
    {
      console.log(this.arrCuestionarios);
      this.arrCuestionarios.forEach(element => 
        {
        console.log(element.id);
        if(element.id == idLeido)
        {
          empezoVotacion = this.empezoVotacion(element);
          if(this.almacenDatosProvider.calcularTiempoRestante(element) >= 0)
          {
            tituloAlert = 'Votaciòn terminada';
          }
          else
          {
            tituloAlert = 'La votaciòn ya comenzò'
          }

          console.log(tituloAlert);
          encontradoBand = true;
        }
      });

      if(encontradoBand)
      {
        if(empezoVotacion || tituloAlert == 'Votaciòn terminada')
        {
          let alerta = this.alertCtrl.create({
            title: tituloAlert,
            message: '¿Que acciòn desea realizar?',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                handler: data => {
                }
              },
              {
                text: 'Ver resultados',
                handler: data => {
                 alert('Ir a resultados');
                }
              }
            ]
          });
          alerta.present();
        }
        else
        {
          let alert = this.alertCtrl.create({
            title: 'La votaciòn aùn no comenzò',
            message: '¿Que acciòn desea realizar?',
            inputs: [
              {
                type: 'radio',
                label: 'Editar encuesta',
                value: 'editar'
              },
              {
                type: 'radio',
                label: 'Ver resultados',
                value: 'resultados'
              }
            ],
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                handler: data => 
                {
                  
                }
              },
              {
                text: 'Aceptar',
                handler: data => {
                  switch(data)
                  {
                    case 'editar':
                      this.nav.push(AbmCuestionariosPage, {'id': idLeido});
                    break;
                  }
                }
              }
            ]
          });
          alert.present();
        }
      }
      else
      {
        this.mostrarToast("QR invàlido o encuesta inexistente");
      }
    }
    if(this.almacenDatosProvider.usuarioLogueado.tipo_entidad == 'alumno')
    {
      this.arrCuestionarios.forEach(element => 
        {
        console.log(element.id);
        if(element.id == idLeido)
        {
          encontradoBand = true;
          
          if(this.almacenDatosProvider.calcularTiempoRestante(element) >= 0)
          {
            tituloAlert = "Votaciòn terminada";
          }
          else
          {
     
            if(this.alumnoVoto(element))
            {
              
              tituloAlert = "Usted ya ha votado";
            }
            else
            {
              this.nav.push(EncuestaPage, {'id': idLeido});
            }
          }
          if(tituloAlert == "Votaciòn terminada" || tituloAlert == "Usted ya ha votado")
          {
            let alerta = this.alertCtrl.create({
              title: tituloAlert,
              message: '¿Que acciòn desea realizar?',
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  handler: data => {
                  }
                },
                {
                  text: 'Ver resultados',
                  handler: data => {
                   
                  }
                }
              ]
            });
            alerta.present();
          }
        }
      });
    }
     
  }

  private traerCuestionarios()
  {
    this.dataProvider.getItems('cuestionarios').subscribe(
      data => this.arrCuestionarios = data,
      err => console.error(err)
    );
  }

  private empezoVotacion(cuestionario: Array<any>)
  {
    let hayRespuestasBand = false;

    cuestionario['arrPreguntas'].forEach(element => {
      if(element['arrRespondidos'] != undefined)
        hayRespuestasBand = true;
    });
    return hayRespuestasBand;
  }

  private mostrarToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    }).present();
  }

  //Compruebo que el alumno haya realizado la votacion en la encuesta recibida
  //Recorro todas las preguntas de este arreglo y verifico que se encuentren las respuestas
  //en la posicion mediante su legajo
  private alumnoVoto(cuestionario)
  {
    let legajo = this.almacenDatosProvider.usuarioLogueado['legajo'];
    let band = true;

    cuestionario['arrPreguntas'].forEach(element => {
      if(element.arrRespondidos)
      {
        if(!element.arrRespondidos[legajo])
          band = false;
      }
      else
        band = false;
    });

  return band;
    
  }


}
