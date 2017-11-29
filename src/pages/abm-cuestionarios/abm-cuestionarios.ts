import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-abm-cuestionarios',
  templateUrl: 'abm-cuestionarios.html',
})
export class AbmCuestionariosPage {

  private hayCuestionarios: boolean = false;
  private arrCuestionarios = [];
  private alertPregunta;
  private alertTipoRespuestas;
  private alertRespuestas;
  private cantRespuestas: number;
  private pregunta: string;
  private horasDuracion: number;
  private tipoRespuestas: string;
  private arrRespuestas = [];
  private idCuestionario: number;


  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private dataProvider: DataProvider,
              private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.obtenerUltimoIDCuestionarios();
    this.calcularTiempoRestante("29/11/2017 00:30");
  }

  private mostrarAlertPregunta()
  {
      this.alertPregunta = this.alertCtrl.create({
        title: 'Nuevo cuestionario',
        message: "Complete los datos",
        inputs: [
          {
            name: 'pregunta',
            placeholder: 'Pregunta'
          },
          {
            name: 'cantRespuestas',
            placeholder: 'Cantidad de respuestas',
            type: 'number'
          },
          {
            name: 'horasDuracion',
            placeholder: 'Horas de duraciòn',
            type: 'number'
          }

        ],
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
              this.pregunta = data.pregunta;
              this.cantRespuestas = data.cantRespuestas;
              this.horasDuracion = data.horasDuracion;
              this.mostrarAlertTipoRespuestas();
            }
          }
        ]
      }).present();
  }

  private mostrarAlertTipoRespuestas()
  {

    this.alertPregunta = this.alertCtrl.create({
      title: 'Nuevo cuestionario',
      message: "Seleccione el tipo de respuesta",
      inputs: [
        {
          type:'radio',
          label:'Elegir solo una opciòn',
          value:'radio'
        },
        {
          type:'radio',
          label:'Elegir varias opciones',
          value:'radio'
        },
        {
          type:'radio',
          label:'Escribir respuesta',
          value:'text'
        }
      ],
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
            this.tipoRespuestas = data;
            if(data != 'text')
              this.mostrarAlertRespuestas();
            else
              this.generarCuestionario();
          }
        }
      ]
    }).present();
  }

  private mostrarAlertRespuestas()
  { 
    let inputs = [];

    for(let i = 0; i < this.cantRespuestas; i++)
    {
      inputs.push(
      {
          type: 'text',
          // name: 'respuesta',
          placeholder: `Respuesta ${i+1}`
      });
    }

    this.alertRespuestas = this.alertCtrl.create({
      title: 'Nuevo cuestionario',
      message: "Complete con las respuestas posibles",
      inputs,
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Generar cuestionario',
          handler: data => {
            {
              for(let i=0; i<this.cantRespuestas; i++)
              {
                let obj = {'respuesta': data[i]};
                this.arrRespuestas.push(obj);
              }
            }
            this.generarCuestionario();
          }
        }
      ]
    }).present();
      
  }

  private obtenerUltimoIDCuestionarios()
  {
    this.dataProvider.getItems('cuestionarios').subscribe(
      data =>
      {
        this.arrCuestionarios = data;

        if(data.length == 0)
        {
          this.hayCuestionarios = false;
          this.idCuestionario = 1;
        }
        else
        {
          this.hayCuestionarios = true;
          this.idCuestionario= data[data.length-1].id +1;
        }
      },
      err => console.error(err)
    );
  }

  private generarCuestionario()
  {
    let fecha = new Date();
    let fechaInicio = "";
    fechaInicio += fecha.getDay() + "/";
    fechaInicio += fecha.getMonth()+1 + "/";
    fechaInicio += fecha.getFullYear() + " ";
    fechaInicio += fecha.getHours() + ":";
    fechaInicio += fecha.getMinutes();

    
    let obj = 
    {
      'id': this.idCuestionario,
      'pregunta': this.pregunta,
      'fechaInicio': fechaInicio,
      'horasDuracion': this.horasDuracion,
      'tipoRespuestas': this.tipoRespuestas,
      'arrRespuestas':  this.arrRespuestas
    }

    if(this.dataProvider.addItem('cuestionarios', obj))
    {
      this.mostrarMsjToast("¡Cuestionario generado con èxito!");
    }
    else
    {
      this.mostrarMsjToast("Hubo un problema al generar el cuestionario. Intente mas tarde.");
    }
    
  }

  private mostrarMsjToast(msg: string)
  {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    }).present();
  }

  private calcularTiempoRestante(fechaHora: string)
  {
    let arrFechaHoraAnt = fechaHora.split(" ");
    let arrFechaAnt = arrFechaHoraAnt[0].split("/");
    let arrHoraAnt = arrFechaHoraAnt[1].split(":");

    //Convierto la hora del cuestionario a formato UNIX
    let epochAnt = new Date(Number.parseInt(arrFechaAnt[2]), Number.parseInt(arrFechaAnt[1]), Number.parseInt(arrFechaAnt[0]), Number.parseInt(arrHoraAnt[0]), Number.parseInt(arrHoraAnt[1])).valueOf();
    let epochHoy = new Date().valueOf();
    let millisec = epochAnt - epochHoy;

    console.log(millisec / 60000);
    
  }

}

