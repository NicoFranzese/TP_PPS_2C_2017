import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlmacenDatosProvider } from '../../providers/almacen-datos/almacen-datos';
import { AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { ToastController } from 'ionic-angular';
import { AbmCuestionariosPage } from '../abm-cuestionarios/abm-cuestionarios';


@IonicPage()
@Component({
  selector: 'page-modal-cuestionarios',
  templateUrl: 'modal-cuestionarios.html',
})
export class ModalCuestionariosPage {

  private alertPregunta;
  private alertTipoRespuestas;
  private alertRespuestas;
  private cantRespuestas;
  private pregunta = "";
  private fechaInicio;
  private horaInicio;
  private fechaFin;
  private horaFin;
  private tipoRespuestas: string;
  private arrRespuestas = [];
  private arrPreguntas = [];
  private titulo = "";

  private operacion: string;
  private idPreguntaEditar;

  //Traducciones
  public traduccionDatosBasicos;
  public traduccionTitulo;
  public traduccionTerminaElDia;
  public traduccionALaHora;
  public traduccionPregunta;
  public traduccionEliminar;
  public traduccionEditar;
  public traduccionAgregarPregunta;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private almacenDatos: AlmacenDatosProvider,
              private alertCtrl: AlertController,
              private dataProvider: DataProvider,
              private toastCtrl: ToastController
              ) 
  {
    //Si aún no se presionó ningún lenguaje, se setea por defecto Español
    if ((localStorage.getItem("Lenguaje") == "") || (localStorage.getItem("Lenguaje") == null) || (localStorage.getItem("Lenguaje") == undefined)){
      localStorage.setItem("Lenguaje", "Es");
    }
    //Le paso el lenguaje que se presionó en sesiones anteriores dentro de la APP
    this.traducir(localStorage.getItem("Lenguaje"));

    console.log(this.almacenDatos.operacionCuestionario);
  }

  ionViewDidLoad() {
    if(this.almacenDatos.operacionCuestionario == "Editar Cuestionario")
      this.asignarVariablesEditar();
    else
      this.resetearVariables();
  }

  //Método que traduce objetos de la pagina 
traducir(lenguaje){    
  //Según lenguaje seleccionado se traducen los objetos.
  if(lenguaje == 'Es'){
    // this.traduccionTitulo = "Seleccione una comisión";
    this.traduccionDatosBasicos ="Datos Básicos";
    this.traduccionTitulo ="Título";
    this.traduccionTerminaElDia = "Termina el Día";
    this.traduccionALaHora = "A la Hora ";
    this.traduccionPregunta = "Pregunta";
    this.traduccionEliminar = "Eliminar";
    this.traduccionEditar = "Editar";
    this.traduccionAgregarPregunta = "Agregar pregunta";

  }else if(lenguaje == 'Usa'){
    this.traduccionDatosBasicos ="Basic data";
    this.traduccionTitulo ="Title";
    this.traduccionTerminaElDia = "End the Day";
    this.traduccionALaHora = "At the Hour";
    this.traduccionPregunta = "Question";
    this.traduccionEliminar = "Remove";
    this.traduccionEditar = "Edit";
    this.traduccionAgregarPregunta = "Add question";


  }else if(lenguaje == 'Br'){
    this.traduccionDatosBasicos ="Dados básicos";
    this.traduccionTitulo ="Título";
    this.traduccionTerminaElDia = "Terminar o dia";
    this.traduccionALaHora = "Na hora";
    this.traduccionPregunta = "Pergunta";
    this.traduccionEliminar = "Excluir";
    this.traduccionEditar = "Editar";
    this.traduccionAgregarPregunta = "Adicionar pergunta";

  }

}



  private resetearVariables()
  {
    this.cantRespuestas = "";
    this.pregunta = "";
    this.tipoRespuestas = "";
    this.arrRespuestas = [];
  }

  private mostrarAlertPregunta(operacion: string)
  {
    this.operacion = operacion;

    if(this.operacion == 'Nueva pregunta')
      this.resetearVariables();

      this.alertPregunta = this.alertCtrl.create({
        title: this.operacion,
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
              this.mostrarAlertTipoRespuestas();
            }
          }
        ]
      }).present();
  }

  private mostrarAlertTipoRespuestas()
  {

    this.alertPregunta = this.alertCtrl.create({
      title: this.operacion,
      message: "Seleccione el tipo de respuesta",
      inputs: [
        {
          type:'radio',
          label:'Elegir solo una opción (radio)',
          value:'radio',
          checked: this.tipoRespuestas == 'radio'
        },
        {
          type:'radio',
          label:'Elegir múltiples opciones (check)',
          value:'checkbox',
          checked: this.tipoRespuestas == 'check'
          
        },
        {
          type:'radio',
          label:'Escribir respuesta (text)',
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
              this.mostrarAlertRespuestas();
            else
              this.guardarPregunta();
          }
        }
      ]
    }).present();
  }

  private mostrarAlertRespuestas()
  { 
    let inputs = [];

    for(let i = 0; i < Number.parseInt(this.cantRespuestas); i++)
    {
      if(this.operacion == 'Editar')
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
      title: this.operacion,
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
          text: 'Guardar pregunta',
          handler: data => {
            {
              this.arrRespuestas = [];
              for(let i=0; i<Number.parseInt(this.cantRespuestas); i++)
              {
                let obj = {'respuesta': data[i]};
                this.arrRespuestas.push(obj);
              }
            }
            this.guardarPregunta();
          }
        }
      ]
    }).present();
      
  }

  private guardarPregunta()
  {
    let obj = 
    {
      'pregunta': this.pregunta,
      'tipoRespuestas': this.tipoRespuestas,
      'arrRespuestas':  this.arrRespuestas,
      'cantRespuestas': this.cantRespuestas
    }
    if(this.operacion == 'Nueva pregunta')
      this.arrPreguntas.push(obj);
    else
      this.arrPreguntas[this.idPreguntaEditar] = obj;
  }

  private editarPregunta(item)
  {
    this.operacion = "Editar";

    this.arrPreguntas.forEach(element => {
      for(let i=0; i<this.arrPreguntas.length; i++)
        this.idPreguntaEditar = i;

    });

    this.pregunta = item.pregunta;
    // console.log(item);
    if(item.arrRespuestas)
      this.cantRespuestas = Number.parseInt(item.cantRespuestas);
    
    this.tipoRespuestas = item.tipoRespuestas;
    this.arrRespuestas = item.arrRespuestas;

    this.mostrarAlertPregunta('Editar');

  }

  private guardarCuestionario()
  {
    if(this.almacenDatos.operacionCuestionario != 'Editar Cuestionario')
    {
      let fecha = new Date();
      let mes = fecha.getMonth()+1;
      this.fechaInicio = fecha.getDate() + "/" + mes + "/" + fecha.getFullYear();
      this.horaInicio = fecha.getHours() + ":" + fecha.getMinutes();
    }

    let arrFechaFin = this.fechaFin.split('-');
    let obj = 
    {
      'id': this.almacenDatos.ultimoIdCuestionario,
      'titulo': this.titulo,
      'fechaInicio': this.fechaInicio,
      'horaInicio': this.horaInicio,
      'fechaFin': arrFechaFin[2] +"/"+ arrFechaFin[1] +"/"+ arrFechaFin[0],
      'horaFin': this.horaFin,
      'arrPreguntas': this.arrPreguntas,
      'legajo_creador': this.almacenDatos.usuarioLogueado['legajo']
    };
    console.log(obj);

    if(this.titulo == "" || this.fechaFin == undefined || this.fechaInicio == undefined)
    {
      this.mostrarMsjToast("¡Atención! Debe completar todos los campos");
    }
    else
    {
      this.dataProvider.addItem('cuestionarios/' + obj.id, obj);
      this.mostrarMsjToast("¡Cuestionario agregado con éxito!");
      this.navCtrl.push(AbmCuestionariosPage);
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

  private asignarVariablesEditar()
  {
    this.titulo = this.almacenDatos.cuestionarioEditar.titulo;
    this.almacenDatos.ultimoIdCuestionario = this.almacenDatos.cuestionarioEditar.id;

    let arrFecha = this.almacenDatos.cuestionarioEditar.fechaFin.split('/');;
    this.fechaFin = arrFecha[2] +'-'+ arrFecha[1] +'-'+ arrFecha[0];
    
    this.horaFin = this.almacenDatos.cuestionarioEditar.horaFin;
    this.fechaInicio = this.almacenDatos.cuestionarioEditar.fechaInicio;
    this.horaInicio = this.almacenDatos.cuestionarioEditar.horaInicio;
    if(this.almacenDatos.cuestionarioEditar.arrPreguntas != undefined)
      this.arrPreguntas = this.almacenDatos.cuestionarioEditar.arrPreguntas;
    else
      this.arrPreguntas = [];
  }

  private eliminarPregunta(item)
  {
    this.arrPreguntas.forEach(element => {
      for(let i=0; i<this.arrPreguntas.length; i++)
        this.arrPreguntas.splice(i,1);

    });
  }

}
