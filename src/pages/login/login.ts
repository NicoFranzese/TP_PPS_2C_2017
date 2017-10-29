import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { PrincipalPage } from '../principal/principal';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit{

  private loader;

  constructor(private navCtrl: NavController,
              private loginProvider: LoginProvider,
              private loadingCtrl: LoadingController) {

  }

  ngOnInit()
  {
    this.loginProvider.logOut();
  }

  private loginSocial(proveedor: string): any
  {
    switch(proveedor)
    {
      case 'google':
        this.mostrarLoading("Autentificando...");
        this.loginProvider.loginGoogle();
        this.navegarPrincipalPage();
        break;

      case 'facebook':
      this.mostrarLoading("Autentificando...");
        this.loginProvider.loginFacebook();
        this.navegarPrincipalPage();
        break;
    }
  }

  private navegarPrincipalPage()
  {
    this.loginProvider.usuarioLogueadoSubject.subscribe(
      data=> 
      {
        this.loader.dismiss();
        this.navCtrl.push(PrincipalPage);
      }
    )
  }

  private mostrarLoading(msg: string)
  {
    this.loader = this.loadingCtrl.create({
      content: msg
    });
    this.loader.present();
  }
}
