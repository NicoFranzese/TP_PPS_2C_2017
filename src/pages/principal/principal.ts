// ionic-angular
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
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
  

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loginProvider: LoginProvider,
              private almacenDatosProvider: AlmacenDatosProvider,
              private barcodeScanner: BarcodeScanner,
              private dataProvider: DataProvider,
              public platform: Platform,
              public localNoti: LocalNotifications,
              private qrEncuestasProvider: QrEncuestasProvider) {
   
    let userChanged;
    userChanged = this.navParams.get("logout");
    if(userChanged!=null){this.logout();}
    this.obtenerAvisos();
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
    this.navCtrl.push(LoginPage);
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
        arrAux[0] = 'Gestor de Cuestionarios';
        arrAux[1] = 'fa fa-question-circle fa-5x icon';
        arrAux[2] =  'ABM-cuestionarios';
        arrAux[3] = AbmCuestionariosPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = 'Avisos de Importancia';
        arrAux[1] = 'fa fa-flag fa-5x icon';
        arrAux[2] =  'aviso-importancia';
        arrAux[3] = AvisoImportanciaPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = 'Gráficos Estadísticos';
        arrAux[1] = 'fa fa-pie-chart fa-5x icon';
        arrAux[2] =  'graficos-estadisticos';
        arrAux[3] = GraficosEstadisticosPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = 'QR Para Profesores';
        arrAux[1] = 'fa fa-qrcode fa-5x icon';
        arrAux[2] =  'qr-profesores';
        arrAux[3] = QrProfesoresPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = 'QR Para Encuestas';
        arrAux[1] = 'fa fa-qrcode fa-5x icon';
        arrAux[2] =  'qr-encuestas';
        arrAux[3] = QrEncuestasPage;
        this.arrOpciones.push(arrAux);
      break;

      case 'administrativo':
        arrAux = [];
        arrAux[0] = 'Tomar asistencia';
        arrAux[1] = 'fa fa-list-alt fa-5x icon';
        arrAux[2] =  'control-asistencia';
        arrAux[3] = ControlAsistenciaPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = 'Inscribir alumnos CSV';
        arrAux[1] = 'fa fa-file-excel-o fa-5x icon';
        arrAux[2] =  'carga-archivos';
        arrAux[3] = CargaArchivosPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = 'Avisos de Importancia';
        arrAux[1] = 'fa fa-flag fa-5x icon';
        arrAux[2] =  'aviso-importancia';
        arrAux[3] = AvisoImportanciaPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = 'ABM Alumnos';
        arrAux[1] = 'fa fa-users fa-5x icon';
        arrAux[2] =  'ABM-alumnos';
        arrAux[3] = AbmAlumnosPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = ' Gráficos Estadísticos';
        arrAux[1] = 'fa fa-pie-chart fa-5x icon';
        arrAux[2] =  'graficos-estadisticos';
        arrAux[3] = GraficosEstadisticosPage;
        this.arrOpciones.push(arrAux);
      break;

      case 'alumno':
        arrAux = [];
        arrAux[0] = 'QR Para Alumnos';
        arrAux[1] = 'fa fa-qrcode fa-5x icon';
        arrAux[2] =  'qr-alumnos';
        arrAux[3] = QrAlumnosPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = 'QR Para Encuestas';
        arrAux[1] = 'fa fa-qrcode fa-5x icon';
        arrAux[2] =  'qr-encuestas';
        arrAux[3] = QrEncuestasPage;
        this.arrOpciones.push(arrAux);
      break;

      case 'administrador':
        arrAux = [];
        arrAux[0] = 'ABM Profesores';
        arrAux[1] = 'fa fa-users fa-5x icon';
        arrAux[2] =  'ABM-profesores';
        arrAux[3] = AbmProfesoresPage;
        this.arrOpciones.push(arrAux);

        arrAux = [];
        arrAux[0] = 'ABM Administrativos';
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
        tipo_entidad:this.almacenDatosProvider.usuarioLogueado.tipo_entidad
      });
  }

  private evaluarMensajeDeInasistencias()
{
  console.log(this.almacenDatosProvider.usuarioLogueado.tipo_entidad);
  console.log(this.almacenDatosProvider.usuarioLogueado.legajo);
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
  console.log(this.almacenDatosProvider.usuarioLogueado.legajo);
  this.dataProvider.getItems('fotoPerfil/'+ this.almacenDatosProvider.usuarioLogueado.legajo).subscribe(
    tbFotoPerfil =>
    {
      let indice = tbFotoPerfil[1].posicion;
      this.almacenDatosProvider.usuarioLogueado.photoURL = tbFotoPerfil[0][indice];
      console.log(tbFotoPerfil[0][indice]);
      console.log(this.almacenDatosProvider.usuarioLogueado.photoURL);
    }
  )
}

}
