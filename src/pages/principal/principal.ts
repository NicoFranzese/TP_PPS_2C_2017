import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { LoginPage } from '../login/login';
import { ControlAsistenciaPage } from '../control-asistencia/control-asistencia'

@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loginProvider: LoginProvider
  ) {
  }

  ionViewDidLoad() {
    console.log(this.loginProvider.usuarioLogueado);
  }

  private itemSelected(pageName) {
  

    switch (pageName) {
      case "ABM": {
        //statements; 
        break;
      }
      case "control-asistencia": {
        this.navCtrl.push(ControlAsistenciaPage);
        break;
      }
      default: {
        //statements; 
        break;
      }
    }
   
  }


  private logout() {
    this.loginProvider.logOut();
    this.navCtrl.push(LoginPage);
  }

}
