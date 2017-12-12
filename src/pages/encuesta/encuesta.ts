import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { PrincipalPage } from '../principal/principal'; 
import { ToastController } from 'ionic-angular';


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
  

  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private dataProvider: DataProvider,
              private toastCtrl: ToastController) 
  {
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
          this.mostrarToast("Emncuesta inexistente");
          this.navCtrl.push(PrincipalPage);
        }
        else
        {
          this.arrEncuesta = data;
          this.arrPreguntas = data[0];
          this.pintarRows();
          this.titulo = data[6];
          this.cierre = data[2].toString() + " " + data[4].toString();
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
    let legajo = 16658;
    this.dataProvider.addItem('cuestionarios/' + this.idEncuesta + '/' + 'arrPreguntas' + '/' + idPregunta + '/' + 'arrRespondidos' + '/' + legajo, obj);
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

  private mostrarToast(msg)
  {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000
      });
      toast.present();
  }
}
