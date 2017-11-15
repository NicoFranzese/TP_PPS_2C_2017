import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { LoginPage } from '../login/login';

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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loginProvider: LoginProvider
  ) {
  }

  ionViewDidLoad() {
    this.tipoUsuario = localStorage.getItem("tipoUsuario");
    // this.tipoUsuario = "Profesor";
    // this.tipoUsuario = "Administrador";
    // this.tipoUsuario = "Administrativo";
    //console.log(this.tipoUsuario);
    // console.log(this.loginProvider.usuarioLogueado);
  }


  private itemSelected(pageName) {
  

    switch (pageName) {
      case "control-asistencia": {
        this.navCtrl.push(ControlAsistenciaPage);
        break;
      }
      case "ABM-cuestionarios": {
        this.navCtrl.push(AbmCuestionariosPage);
        break;
      }
      case "aviso-importancia": {
        this.navCtrl.push(AvisoImportanciaPage);
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
      case "carga-archivos": {
        this.navCtrl.push(CargaArchivosPage);
        break;
      }
      case "ABM-alumnos": {
        this.navCtrl.push(QrAlumnosPage);
        break;
      }
      case "graficos-estadisticos": {
        this.navCtrl.push(GraficosEstadisticosPage);
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
      case "ABM-profesores": {
        this.navCtrl.push(AbmProfesoresPage);
        break;
      }
      case "ABM-administrativos": {
        this.navCtrl.push(AbmAdministrativosPage);
        break;
      }

    }
   
  }


  private logout() {
    this.loginProvider.logOut();
    this.navCtrl.push(LoginPage);
  }

}
