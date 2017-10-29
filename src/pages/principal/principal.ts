import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';


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

}
