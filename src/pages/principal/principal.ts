// ionic-angular
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,ViewController } from 'ionic-angular';
import { BarcodeScanner }                               from '@ionic-native/barcode-scanner';
import { LocalNotifications }                           from '@ionic-native/local-notifications';

// providers
import { DataProvider }         from '../../providers/data/data';
import { AlmacenDatosProvider } from '../../providers/almacen-datos/almacen-datos';
import { QrEncuestasProvider }  from '../../providers/qr-encuestas/qr-encuestas';
import { LoginProvider }        from '../../providers/login/login';

// pages
import { LoginPage }                from '../login/login';
import { AbmAdministrativosPage }   from '../abm-administrativos/abm-administrativos';
import { AbmAlumnosPage }           from '../abm-alumnos/abm-alumnos';
import { AbmCuestionariosPage }     from '../abm-cuestionarios/abm-cuestionarios';
import { AbmProfesoresPage }        from '../abm-profesores/abm-profesores';
import { AvisoImportanciaPage }     from '../aviso-importancia/aviso-importancia';
import { CargaArchivosPage }        from '../carga-archivos/carga-archivos';
import { ControlAsistenciaPage }    from '../control-asistencia/control-asistencia';
import { GraficosEstadisticosPage } from '../graficos-estadisticos/graficos-estadisticos';
import { QrAlumnosPage }            from '../qr-alumnos/qr-alumnos';
import { QrEncuestasPage }          from '../qr-encuestas/qr-encuestas';
import { QrProfesoresPage }         from '../qr-profesores/qr-profesores';
import { EncuestaPage }             from '../encuesta/encuesta';
import { EdicionPerfilPage}         from '../edicion-perfil/edicion-perfil';


@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {
  public tipoUsuario;
  public arrAvisos;
  private arrOpciones = [];
  
  //Traducciones
  public traduccionTitulo;
  public traduccionAdministrarPerfil;
  public traduccionSalir;
  public traduccion00;
  public traduccion01;
  public traduccion02;
  public traduccion03;
  public traduccion04;
  public traduccion05;
  public traduccion06;
  public traduccion08;
  public traduccion010;
  public traduccion012;
  public traduccion013;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loginProvider: LoginProvider,
              private almacenDatosProvider: AlmacenDatosProvider,
              private barcodeScanner: BarcodeScanner,
              private dataProvider: DataProvider,
              public platform: Platform,
              public localNoti: LocalNotifications,
              private qrEncuestasProvider: QrEncuestasProvider,
              private viewCtrl: ViewController) {
    //Si aún no se presionó ningún lenguaje, se setea por defecto Español
    if ((localStorage.getItem("Lenguaje") == "") || (localStorage.getItem("Lenguaje") == null) || (localStorage.getItem("Lenguaje") == undefined)){
      localStorage.setItem("Lenguaje", "Es");
    }
    //Le paso el lenguaje que se presionó en sesiones anteriores dentro de la APP
    this.traducir(localStorage.getItem("Lenguaje"));
   
    let userChanged;
    userChanged = this.navParams.get("logout");
    if(userChanged!=null){this.logout();}
    this.obtenerAvisos();

    // console.log(this.almacenDatosProvider.usuarioLogueado);

  }

  ionViewDidLoad() {
    this.cambiarMenu();

    if(this.almacenDatosProvider.primeraVez)
    {
      this.evaluarMensajeDeInasistencias();
      this.asignarFotoPerfil();
      this.almacenDatosProvider.primeraVez = false;
    }
  }

    //Método que traduce objetos de la pagina 
    traducir(lenguaje){    
      //Según lenguaje seleccionado se traducen los objetos.
      if(lenguaje == 'Es'){
        this.traduccionTitulo = "Menu principal";
        this.traduccionAdministrarPerfil ="Administrar perfil";
        this.traduccionSalir ="Salir";
        this.traduccion00 = 'Gestor de Cuestionarios';
        this.traduccion01  = 'Avisos de Importancia';
        this.traduccion02 = 'Gráficos Estadísticos';
        this.traduccion03= 'QR Para Profesores';
        this.traduccion04 = 'QR Para Encuestas';
        this.traduccion05  = 'Tomar asistencia';
        this.traduccion06 = 'Inscribir alumnos CSV';
        this.traduccion08  = 'ABM Alumnos';
        this.traduccion010  = 'QR Para Alumnos';
        this.traduccion012  = 'ABM Profesores';
        this.traduccion013  = 'ABM Administrativos';

    
      }else if(lenguaje == 'Usa'){
        this.traduccionTitulo = "Main menu";
        this.traduccionAdministrarPerfil ="Manage profile";
        this.traduccionSalir ="Get out";
        this.traduccion00 = 'Questionnaire Manager';
        this.traduccion01  = 'Important Notices';
        this.traduccion02 = 'Statistical Graphs';
        this.traduccion03= 'QR For Teachers';
        this.traduccion04 = 'QR For Surveys';
        this.traduccion05  = 'Take assistance';
        this.traduccion06 = 'Register CSV students';
        this.traduccion08  = 'ABM Students';
        this.traduccion010  = 'QR For Students';
        this.traduccion012  = 'ABM Teachers';
        this.traduccion013  = 'ABM Administrative';
    
      }else if(lenguaje == 'Br'){
        this.traduccionTitulo = "Menu principal";
        this.traduccionAdministrarPerfil ="Gerenciar perfil";
        this.traduccionSalir ="Sair";
        this.traduccion00 = 'Gerente do Questionário';
        this.traduccion01  = 'Avisos importantes';
        this.traduccion02 = 'Gráficos estatísticos';
        this.traduccion03= 'QR para professores';
        this.traduccion04 = 'QR para pesquisas';
        this.traduccion05  = 'Tome assistência';
        this.traduccion06 = 'Registre estudantes CSV';
        this.traduccion08  = 'Estudantes da ABMs';
        this.traduccion010  = 'QR para estudantes';
        this.traduccion012  = 'Professores da ABM';
        this.traduccion013  = 'ABM Administrativo';
    
      }
    
    }

  private itemSelected(pageName) {  

    this.almacenDatosProvider.reproducirSonido('plop');

    switch (pageName) {
      case "control-asistencia": {
        this.navCtrl.push(ControlAsistenciaPage);
        break;
      }
      case "aviso-importancia": {
        this.navCtrl.push(AvisoImportanciaPage);
        break;
      }
      case "carga-archivos": {
        this.navCtrl.push(CargaArchivosPage);
        break;
      }
      
      case "ABM-cuestionarios": {
        this.navCtrl.push(AbmCuestionariosPage);
        break;
      }
      case "ABM-alumnos": {
        this.navCtrl.push(AbmAlumnosPage);
        break;
      }
      case "ABM-profesores": {
        this.navCtrl.push(AbmProfesoresPage);
        break;
      }
      case "ABM-administrativos": {
        this.navCtrl.push(AbmAdministrativosPage);
        break;
      }
      case "graficos-estadisticos": {
        this.navCtrl.push(GraficosEstadisticosPage);
        break;
      }
      case "qr-profesores": {
        this.navCtrl.push(QrProfesoresPage);
        break;
      }
      case "qr-alumnos": {
        this.navCtrl.push(QrAlumnosPage);
        break;
      }
      case "qr-encuestas": {
        this.qrEncuestasProvider.escanearQR();
        // this.qrEncuestasProvider.verificarEntidad(3);
        break;
      }
    }
  }

  private logout() {
    this.almacenDatosProvider.reproducirSonido('plop');
    this.loginProvider.logOut();
    this.almacenDatosProvider.reproducirSonido('intro');
    this.navCtrl.push(LoginPage).then(() => {
      // first we find the index of the current view controller:
      const index = this.viewCtrl.index;
      // then we remove it from the navigation stack
      this.navCtrl.remove(index);
    });
  }

  //Según el tipo de usuario logueado muestro las opciones
  private cambiarMenu()
  {
    this.arrOpciones = [];
    let arrAux = [];

    switch(this.almacenDatosProvider.usuarioLogueado.tipo_entidad)
    {
      case 'docente':
        arrAux = [];
        arrAux[0] = this.traduccion00;
        arrAux[1] = 'fa fa-question-circle fa-5x icon';
        arrAux[2] =  'ABM-cuestionarios';
        arrAux[3] = AbmCuestionariosPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] =this.traduccion01;
        arrAux[1] = 'fa fa-flag fa-5x icon';
        arrAux[2] =  'aviso-importancia';
        arrAux[3] = AvisoImportanciaPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = this.traduccion02;
        arrAux[1] = 'fa fa-pie-chart fa-5x icon';
        arrAux[2] =  'graficos-estadisticos';
        arrAux[3] = GraficosEstadisticosPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = this.traduccion03;
        arrAux[1] = 'fa fa-qrcode fa-5x icon';
        arrAux[2] =  'qr-profesores';
        arrAux[3] = QrProfesoresPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = this.traduccion04;
        arrAux[1] = 'fa fa-qrcode fa-5x icon';
        arrAux[2] =  'qr-encuestas';
        arrAux[3] = QrEncuestasPage;
        this.arrOpciones.push(arrAux);
      break;

      case 'administrativo':
        arrAux = [];
        arrAux[0] = this.traduccion05;
        arrAux[1] = 'fa fa-list-alt fa-5x icon';
        arrAux[2] =  'control-asistencia';
        arrAux[3] = ControlAsistenciaPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = this.traduccion06;
        arrAux[1] = 'fa fa-file-excel-o fa-5x icon';
        arrAux[2] =  'carga-archivos';
        arrAux[3] = CargaArchivosPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = this.traduccion01;
        arrAux[1] = 'fa fa-flag fa-5x icon';
        arrAux[2] =  'aviso-importancia';
        arrAux[3] = AvisoImportanciaPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = this.traduccion08;
        arrAux[1] = 'fa fa-users fa-5x icon';
        arrAux[2] =  'ABM-alumnos';
        arrAux[3] = AbmAlumnosPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = this.traduccion02;
        arrAux[1] = 'fa fa-pie-chart fa-5x icon';
        arrAux[2] =  'graficos-estadisticos';
        arrAux[3] = GraficosEstadisticosPage;
        this.arrOpciones.push(arrAux);
      break;

      case 'alumno':
        arrAux = [];
        arrAux[0] = this.traduccion010;
        arrAux[1] = 'fa fa-qrcode fa-5x icon';
        arrAux[2] =  'qr-alumnos';
        arrAux[3] = QrAlumnosPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = this.traduccion04;
        arrAux[1] = 'fa fa-qrcode fa-5x icon';
        arrAux[2] =  'qr-encuestas';
        arrAux[3] = QrEncuestasPage;
        this.arrOpciones.push(arrAux);
      break;

      case 'administrador':
        arrAux = [];
        arrAux[0] = this.traduccion012;
        arrAux[1] = 'fa fa-users fa-5x icon';
        arrAux[2] =  'ABM-profesores';
        arrAux[3] = AbmProfesoresPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = this.traduccion013;
        arrAux[1] = 'fa fa-users fa-5x icon';
        arrAux[2] =  'ABM-administrativos';
        arrAux[3] = AbmAdministrativosPage;
        this.arrOpciones.push(arrAux);
      break;
    }
    this.almacenDatosProvider.arrMenuOpciones.next(this.arrOpciones);
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
                      sound: '' //Ruta del archivo de sonido
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


  private modificarPerfil(){
    this.navCtrl.push(EdicionPerfilPage,
      {
        legajo:this.almacenDatosProvider.usuarioLogueado.legajo,
        nombre:this.almacenDatosProvider.usuarioLogueado.nombre,
        tipo_entidad:this.almacenDatosProvider.usuarioLogueado.tipo_entidad,
        id_persona:this.almacenDatosProvider.usuarioLogueado.id_persona,
        id_usuario:this.almacenDatosProvider.usuarioLogueado.id_usuario
      });
  }

  private evaluarMensajeDeInasistencias()
{
  console.log("Entidad logueada= " +this.almacenDatosProvider.usuarioLogueado.tipo_entidad);
  console.log("Legajo logueado= "+this.almacenDatosProvider.usuarioLogueado.legajo);
  if(
    this.almacenDatosProvider.usuarioLogueado.tipo_entidad == "alumno" ||
    this.almacenDatosProvider.usuarioLogueado.tipo_entidad == "docente" ||
    this.almacenDatosProvider.usuarioLogueado.tipo_entidad == "administrativo"
  )
  {
    // debugger
    this.dataProvider.getItems('aviso_faltas').subscribe(
      tabAvisoFaltas =>
       {
         tabAvisoFaltas.forEach(element => {

           if(element.legajo == this.almacenDatosProvider.usuarioLogueado.legajo)
           {
             //Mando la notificacion
             this.platform.ready().then(() => {
              this.localNoti.schedule({
                title: 'Alerta de Gestión Académica!',
                text: element.mensaje,
                at: new Date(new Date().getTime() + 3600),
                led: 'FF0000',
                icon:'', //ruta del icono
                sound: 'assets/sonidos/notificacion.mp3' //Ruta del archivo de sonido
              });
            //Elimino aviso para que no vuelva a enviarlo.
              this.dataProvider.deleteItem('aviso_faltas/'+ this.almacenDatosProvider.usuarioLogueado.legajo);
            });
             
           }
         });
       }
     );
  }
  
}

private asignarFotoPerfil()
{
  // console.log("Legajo logueado= "+this.almacenDatosProvider.usuarioLogueado.legajo);
  this.dataProvider.getItems('fotoPerfil/'+ this.almacenDatosProvider.usuarioLogueado.legajo).subscribe(
    tbFotoPerfil =>
    {
      let indice = tbFotoPerfil[1].posicion;
      this.almacenDatosProvider.usuarioLogueado.photoURL = tbFotoPerfil[0][indice];
      // console.log(tbFotoPerfil[0][indice]);
      // console.log(this.almacenDatosProvider.usuarioLogueado.photoURL);
    }
  )
}

}
