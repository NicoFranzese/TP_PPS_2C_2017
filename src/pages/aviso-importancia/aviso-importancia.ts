import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { GlobalFxProvider } from '../../providers/global-fx/global-fx';
import { DataProvider } from '../../providers/data/data';
import { LocalNotifications } from '@ionic-native/local-notifications';

/**
 * Generated class for the AvisoImportanciaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aviso-importancia',
  templateUrl: 'aviso-importancia.html',
})
export class AvisoImportanciaPage {
  public mensaje;
  public tipoUsuSeleccionado;
  public arrAvisos;
  public ultimoIDAviso = 1;
  public arrPersonas;

  //traducciones
  public traduccionTitulo;
  public traduccionSeleccioneDestinado;
  public traduccionSeleccioneUsuario;
  public traduccionAdministrador;
  public traduccionAdministrativo;
  public traduccionAlumno;
  public traduccionDocente;
  public traduccionTodos;
  public traduccionMensajeQueSeEnviara;
  public traduccionEnviar;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public localNoti: LocalNotifications,
              public platform: Platform,
              private dataProvider: DataProvider,
              private gFx: GlobalFxProvider) {
                //Si aún no se presionó ningún lenguaje, se setea por defecto Español
                if ((localStorage.getItem("Lenguaje") == "") || (localStorage.getItem("Lenguaje") == null) || (localStorage.getItem("Lenguaje") == undefined)){
                  localStorage.setItem("Lenguaje", "Es");
                }
                //Le paso el lenguaje que se presionó en sesiones anteriores dentro de la APP
                this.traducir(localStorage.getItem("Lenguaje"));
                
                this.obtenerPersonas();
                this.obtenerUltimoIDAvisosImportancia();   
  }
  

  ionViewDidLoad() {
    // console.log('ionViewDidLoad AvisoImportanciaPage');
  }

  //Método que traduce objetos de la pagina 
  traducir(lenguaje){    
    //Según lenguaje seleccionado se traducen los objetos.
    if(lenguaje == 'Es'){
      this.traduccionTitulo = "Avisos de Importancia";
      this.traduccionSeleccioneDestinado = "Seleccione a quien está Destinado";
      this.traduccionSeleccioneUsuario = "Seleccione Usuario";
      this.traduccionAdministrador = "Administrador";
      this.traduccionAdministrativo = "Administrativo";
      this.traduccionAlumno = "Alumno";
      this.traduccionDocente = "Docente";
      this.traduccionTodos = "Todos";
      this.traduccionMensajeQueSeEnviara ="Mensaje que enviará";
      this.traduccionEnviar = "Enviar";
    }else if(lenguaje == 'Usa'){
      this.traduccionTitulo = "Important Notices";
      this.traduccionSeleccioneDestinado = "Select who is Destined";
      this.traduccionSeleccioneUsuario = "Select User";
      this.traduccionAdministrador = "Administrator";
      this.traduccionAdministrativo = "Administrative";
      this.traduccionAlumno = "Student";
      this.traduccionDocente = "teacher";
      this.traduccionTodos = "Everybody";
      this.traduccionMensajeQueSeEnviara ="Message to be sent";
      this.traduccionEnviar = "Submit";
    }else if(lenguaje == 'Br'){
      this.traduccionTitulo = "Avisos importantes";
      this.traduccionSeleccioneDestinado = "Selecione quem está Destinado";
      this.traduccionSeleccioneUsuario = "Selecione Usuário";
      this.traduccionAdministrador = "Administrador";
      this.traduccionAdministrativo = "Administrativo";
      this.traduccionAlumno = "Estudante";
      this.traduccionDocente = "Professor";
      this.traduccionTodos = "Todos";
      this.traduccionMensajeQueSeEnviara ="Mensagem a enviar";
      this.traduccionEnviar = "Enviar";
    }

  }

  private obtenerUltimoIDAvisosImportancia()
  {
    this.dataProvider.getItems('avisos_importancia').subscribe(
      data =>
      {
        this.arrAvisos = data;

        if(data.length == 0)
        {
          this.ultimoIDAviso = 1;
        }
        else
        {
          this.ultimoIDAviso= data[data.length-1].id +1;
        }
      },
      err => console.error(err)
    );
  }

  private obtenerPersonas()
  {
    this.dataProvider.getItems('entidades_persona').subscribe(
      data => 
      {
        // this.arrPersonas = data;

        if(data == undefined)
        {
          this.gFx.presentToast("No existen personas cargadas en la BD.");
        }
        else
        {
          this.arrPersonas = data;
        }
        // console.log(this.arrPersonas);
      },
      err => console.log(err)
    );
  }


  PushClicked(){
    if((this.mensaje == null) || (this.mensaje == undefined) || (this.mensaje == "") ||
      (this.tipoUsuSeleccionado == null) || (this.tipoUsuSeleccionado == undefined) || (this.tipoUsuSeleccionado == "")){        
        this.gFx.presentToast("Debe seleccionar a quien va destinado el Aviso y escribir un mensaje");
    }else{
      if (this.tipoUsuSeleccionado == "todos"){
        for (let i=0;i<this.arrPersonas.length;i++){ 
          let legajo = this.arrPersonas[i].legajo;  
          if ((legajo < localStorage.getItem("legajoLogueado").toString()) || 
              (legajo > localStorage.getItem("legajoLogueado").toString())){
            let obj = 
            {
              'id': this.ultimoIDAviso,
              'mensaje': this.mensaje,
              'tipoUsuario': this.tipoUsuSeleccionado,
              'legajo': this.arrPersonas[i].legajo
            };        
            this.dataProvider.addItem('avisos_importancia/' + obj.id, obj);
            this.ultimoIDAviso = this.ultimoIDAviso +1;
          }
        }
      }else{
        for (let i=0;i<this.arrPersonas.length;i++){ 
          if (this.arrPersonas[i].tipo_entidad==this.tipoUsuSeleccionado) {
            let legajo = this.arrPersonas[i].legajo;  
            if ((legajo < localStorage.getItem("legajoLogueado").toString()) || 
                (legajo > localStorage.getItem("legajoLogueado").toString())){
              let obj = 
              {
                'id': this.ultimoIDAviso,
                'mensaje': this.mensaje,
                'tipoUsuario': this.tipoUsuSeleccionado,
                'legajo': this.arrPersonas[i].legajo
              };        
              this.dataProvider.addItem('avisos_importancia/' + obj.id, obj);
              this.ultimoIDAviso = this.ultimoIDAviso +1;
            }
          }
        }
      }

      this.gFx.presentToast("Se ah enviado el aviso.");
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

}
