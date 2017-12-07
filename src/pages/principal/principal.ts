import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { LoginPage } from '../login/login';
import { AlmacenDatosProvider } from '../../providers/almacen-datos/almacen-datos';

import { AbmAdministrativosPage } from '../abm-administrativos/abm-administrativos';
import { AbmAlumnosPage } from '../abm-alumnos/abm-alumnos';
import { AbmCuestionariosPage } from '../abm-cuestionarios/abm-cuestionarios';
import { AbmProfesoresPage } from '../abm-profesores/abm-profesores';
import { AvisoImportanciaPage } from '../aviso-importancia/aviso-importancia';
import { CargaArchivosPage } from '../carga-archivos/carga-archivos';
import { ControlAsistenciaPage } from '../control-asistencia/control-asistencia';
import { GraficosEstadisticosPage } from '../graficos-estadisticos/graficos-estadisticos';
import { QrAlumnosPage } from '../qr-alumnos/qr-alumnos';
import { QrEncuestasPage } from '../qr-encuestas/qr-encuestas';
import { QrProfesoresPage } from '../qr-profesores/qr-profesores';


@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {

  public tipoUsuario;

  private arrOpciones = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loginProvider: LoginProvider,
    private almacenDatosProvider: AlmacenDatosProvider
    
  ) {
  }

  ionViewDidLoad() {
    this.cambiarMenu();

  }


  private itemSelected(pageName) {  

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
      case "qr-encuestas": {
        this.navCtrl.push(QrEncuestasPage);
        break;
      }
      case "qr-alumnos": {
        this.navCtrl.push(QrAlumnosPage);
        break;
      }
      case "qr-encuestas": {
        this.navCtrl.push(QrEncuestasPage);
        break;
      }
    }
  }

  private logout() {
    this.loginProvider.logOut();
    this.navCtrl.push(LoginPage);
  }

  //Según el tipo de usuario logueado muestro las opciones
  private cambiarMenu()
  {
    this.arrOpciones = [];
    let arrAux = [];

    switch(this.almacenDatosProvider.usuarioLogueado.tipo_entidad)
    {
      case 'profesor':
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


}
