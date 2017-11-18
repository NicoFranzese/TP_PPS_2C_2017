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
  public usuario;
  public clave;

  constructor(private navCtrl: NavController,
              private loginProvider: LoginProvider,
              private loadingCtrl: LoadingController) 
  {
  }

  ngOnInit()
  {
    this.loginProvider.logOut();
  }

  Ingresar(){
     this.mostrarLoading("Autentificando...");
        this.loader.dismiss();
        localStorage.setItem("tipoUsuario","Administrativo");
        this.navCtrl.push(PrincipalPage);
    // if((this.usuario =="Admin") && (this.clave =="Admin")){
    //   this.mostrarLoading("Autentificando...");
    //   this.loader.dismiss();
    //   localStorage.setItem("tipoUsuario","Administrador");
    //   this.navCtrl.push(PrincipalPage);
    // }else{
    //   console.log("Usuario Administrador incorrecto");
    // }
  }

  private loginSocial(proveedor: string): any
  {
    this.mostrarLoading("Autentificando...");
    localStorage.setItem("tipoUsuario","Alumno");
    this.loginProvider.loginRedSocial(proveedor);
    this.navegarPrincipalPage();
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
