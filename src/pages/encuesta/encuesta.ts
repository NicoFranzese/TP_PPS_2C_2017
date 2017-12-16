import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { AlmacenDatosProvider } from '../../providers/almacen-datos/almacen-datos';
import { PrincipalPage } from '../principal/principal'; 
import { ToastController } from 'ionic-angular';

import { LocalNotifications }                           from '@ionic-native/local-notifications';

@IonicPage()
@Component({
  selector: 'page-encuesta',
  templateUrl: 'encuesta.html',
})
export class EncuestaPage {

  private arrEncuesta;
  private arrPreguntas = [];
  private titulo;
  private cierre;
  private idEncuesta;

  private arrClase = [];
  public arrAvisos;

  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private dataProvider: DataProvider,
              private toastCtrl: ToastController,
              private almacenDatos: AlmacenDatosProvider,
              public  platform: Platform,
              public  localNoti: LocalNotifications) 
  {
    this.obtenerAvisos();
  }

  ionViewDidLoad() {
    
    let id = this.navParams.get('id');
    // let id = 2;
    this.test(id);

  }

  private test(id)
  {
    this.dataProvider.getItems('cuestionarios/' + id).subscribe(
      data => 
      {
        if(data == undefined)
        {
          this.mostrarToast("Encuesta inexistente");
          this.navCtrl.push(PrincipalPage);
        }
        else
        {
          this.arrEncuesta = data;
          console.log(this.arrEncuesta);
          this.arrPreguntas = data[0];
          this.pintarRows();
          this.titulo = data[7];
          this.cierre = data[1].toString() + " " + data[3].toString();
          this.idEncuesta = this.arrEncuesta[5];
        }
      },
      err => console.log(err)
    );
  }

  private mostrarEncuesta(item)
  {
    console.log(item);
    let inputs = [];

    if(item.arrRespuestas != undefined)
    {
      item.arrRespuestas.forEach(element => {
        let obj = {
          type: item.tipoRespuestas,
          label: element.respuesta,
          value: element.respuesta
        }
        inputs.push(obj);
      });

      console.log(Number.parseInt(item.cantRespuestas));

    }
    else
    {
      for(let i=0; i<item.cantRespuestas; i++)
      {
        let obj = {
          type: item.tipoRespuestas
        }
        inputs.push(obj);
      }
    }
    
    let prompt = this.alertCtrl.create({
      title: item.pregunta,
      message: "Responde la encuesta",
      inputs,
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
 
            console.log(data);
           if(typeof(data) == 'string')
            this.GuardarRespuesta({'0' : data}, item);
           else
            this.GuardarRespuesta(data, item);
        
          }
        }
      ]
    }).present();
  }
  
  private GuardarRespuesta(obj, pregunta)
  {
    let idPregunta = this.arrPreguntas.indexOf(pregunta);
    this.dataProvider.addItem('cuestionarios/' + this.idEncuesta + '/' + 'arrPreguntas' + '/' + idPregunta + '/' + 'arrRespondidos' + '/' + this.almacenDatos.usuarioLogueado['legajo'], obj);
    this.arrClase[idPregunta] = "row backGreen";
  }

  private pintarRows()
  {
    for(let i=0; i<this.arrPreguntas.length; i++)
    {
      if(this.arrClase[i] != "row backGreen")
        this.arrClase[i] = " row backRed";
    }
      
  }

  private volverMenu()
  {
    let band = true;

    this.arrClase.forEach(element => {
      if(element != 'row backGreen')
        band = false;
    });

    if(!band)
      this.mostrarToast("Debe completar todas las preguntas");
    else
    {
      this.mostrarToast("Encuesta respondida con èxito");
      this.navCtrl.push(PrincipalPage);
    }

  }

  private obtenerAvisos()
  {
    this.dataProvider.getItems('avisos_importancia').subscribe(
      data => 
      {
        // this.arrPersonas = data;

        if(data == undefined)
        {
          // alert("No existen personas cargadas en la BD");
        }
        else
        {
          this.arrAvisos = data;

          for (let i=0;i<this.arrAvisos.length;i++){ 
            let legajo = this.arrAvisos[i].legajo;
            if ((legajo < localStorage.getItem("legajoLogueado").toString()) || 
                (legajo > localStorage.getItem("legajoLogueado").toString())){
                }else{
                  this.platform.ready().then(() => {
                    this.localNoti.schedule({
                      title: 'Alerta de Gestión Académica!',
                      text: this.arrAvisos[i].mensaje,
                      at: new Date(new Date().getTime() + 3600),
                      led: 'FF0000',
                      icon:'', //ruta del icono
                      sound: 'assets/sonidos/notificacion.mp3' //Ruta del archivo de sonido
                    });
                  //Elimino aviso para que no vuelva a enviarlo.
                    // this.dataProvider.deleteItem('avisos_importancia/'+this.arrAvisos[i].id);
                  });
                }
          }

          for (let i=0;i<this.arrAvisos.length;i++){ 
            let legajo = this.arrAvisos[i].legajo;
            if ((legajo < localStorage.getItem("legajoLogueado").toString()) || 
                (legajo > localStorage.getItem("legajoLogueado").toString())){
                  
                }else{
                  this.platform.ready().then(() => {
                  //Elimino aviso para que no vuelva a enviarlo.
                    this.dataProvider.deleteItem('avisos_importancia/'+this.arrAvisos[i].id);
                  });
                }
          }
        }
        // console.log(this.arrAvisos);
      },
      err => console.log(err)
    );
  }

  private mostrarToast(msg)
  {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000
      });
      toast.present();
  }

}
