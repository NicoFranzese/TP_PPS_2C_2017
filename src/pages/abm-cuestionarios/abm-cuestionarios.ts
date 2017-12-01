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
  private cantRespuestas;
  private pregunta;
  private horasDuracion;
  private tipoRespuestas: string;
  private arrRespuestas = [];
  private fechaInicio = "";
  private idCuestionario: number;

  private tituloCuestionario: string;


  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private dataProvider: DataProvider,
              private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.obtenerUltimoIDCuestionarios();
  }

  private resetearVariables()
  {
    this.cantRespuestas = "";
    this.pregunta = "";
    this.horasDuracion = "";
    this.tipoRespuestas = "";
    this.arrRespuestas = [];
    this.fechaInicio = "";
  }

  private mostrarAlertPregunta(operacion: string)
  {
    if(operacion == 'alta')
    {
      this.resetearVariables();
      this.obtenerUltimoIDCuestionarios();
      this.tituloCuestionario = "Nuevo cuestionario";
    }
    else
      this.tituloCuestionario = "Editar cuestionario"
      
      this.alertPregunta = this.alertCtrl.create({
        title: this.tituloCuestionario,
        message: "Complete los datos",
        inputs: [
          {
            name: 'pregunta',
            placeholder: 'Pregunta',
            value: this.pregunta
          },
          {
            name: 'cantRespuestas',
            placeholder: 'Cantidad de respuestas',
            type: 'number',
            value: this.cantRespuestas
          },
          {
            name: 'horasDuracion',
            placeholder: 'Horas de duraciòn',
            type: 'number',
            value: this.horasDuracion
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
              this.mostrarAlertTipoRespuestas(operacion);
            }
          }
        ]
      }).present();
  }

  private mostrarAlertTipoRespuestas(operacion)
  {

    this.alertPregunta = this.alertCtrl.create({
      title: this.tituloCuestionario,
      message: "Seleccione el tipo de respuesta",
      inputs: [
        {
          type:'radio',
          label:'Elegir solo una opciòn',
          value:'radio',
          checked: this.tipoRespuestas == 'radio'
        },
        {
          type:'radio',
          label:'Elegir varias opciones',
          value:'check',
          checked: this.tipoRespuestas == 'check'
          
        },
        {
          type:'radio',
          label:'Escribir respuesta',
          value:'text',
          checked: this.tipoRespuestas == 'text'
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
              this.mostrarAlertRespuestas(operacion);
            else
              this.guardarCuestionario(operacion);
          }
        }
      ]
    }).present();
  }

  private mostrarAlertRespuestas(operacion: string)
  { 
    let inputs = [];

    for(let i = 0; i < Number.parseInt(this.cantRespuestas); i++)
    {
      if(operacion == 'editar')
      {
        inputs.push(
        {
            type: 'text',
            value: this.arrRespuestas[i].respuesta,
            placeholder: `Respuesta ${i+1}`
        });
      }
      else
      {
        inputs.push(
          {
              type: 'text',
              placeholder: `Respuesta ${i+1}`
          });
      }
    }

    this.alertRespuestas = this.alertCtrl.create({
      title: this.tituloCuestionario,
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
              this.arrRespuestas = [];
              for(let i=0; i<Number.parseInt(this.cantRespuestas); i++)
              {
                let obj = {'respuesta': data[i]};
                this.arrRespuestas.push(obj);
              }
            }
            this.guardarCuestionario(operacion);
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

  private guardarCuestionario(operacion)
  {
    if(operacion == 'alta')
    {
      let fecha = new Date();
      this.fechaInicio += fecha.getDay() + "/";
      this.fechaInicio += fecha.getMonth()+1 + "/";
      this.fechaInicio += fecha.getFullYear() + " ";
      this.fechaInicio += fecha.getHours() + ":";
      this.fechaInicio += fecha.getMinutes();
    }
    
    let obj = 
    {
      'id': this.idCuestionario,
      'pregunta': this.pregunta,
      'fechaInicio': this.fechaInicio,
      'horasDuracion': this.horasDuracion,
      'tipoRespuestas': this.tipoRespuestas,
      'arrRespuestas':  this.arrRespuestas
    }

    this.dataProvider.addItem('cuestionarios', obj);

    if(operacion == 'alta')  
      this.mostrarMsjToast("¡Cuestionario generado con èxito!");  
    else
      this.mostrarMsjToast("¡Cuestionario editado con èxito!");
    
  
  }

  private mostrarMsjToast(msg: string)
  {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    }).present();
  }

  private editarCuestionario(item)
  {
    this.idCuestionario = item.id;
    this.pregunta = item.pregunta;

    if(item.arrRespuestas)
      this.cantRespuestas = item.arrRespuestas.length;
    else
      this.cantRespuestas = 1;
    
    this.horasDuracion = item.horasDuracion;
    this.tipoRespuestas = item.tipoRespuestas;
    this.arrRespuestas = item.arrRespuestas;
    this.fechaInicio = item.fechaInicio;

    this.mostrarAlertPregunta('editar');

  }

  // private calcularTiempoRestante(fechaHora: string)
  // {
  //   let arrFechaHoraAnt = fechaHora.split(" ");
  //   let arrFechaAnt = arrFechaHoraAnt[0].split("/");
  //   let arrHoraAnt = arrFechaHoraAnt[1].split(":");

  //   //Convierto la hora del cuestionario a formato UNIX
  //   let epochAnt = new Date(Number.parseInt(arrFechaAnt[2]), Number.parseInt(arrFechaAnt[1]), Number.parseInt(arrFechaAnt[0]), Number.parseInt(arrHoraAnt[0]), Number.parseInt(arrHoraAnt[1])).valueOf();
  //   let epochHoy = new Date().valueOf();
  //   let millisec = epochAnt - epochHoy;

  //   console.log(millisec / 60000); 
  // }

}

