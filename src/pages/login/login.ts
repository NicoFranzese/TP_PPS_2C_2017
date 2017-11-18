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
  public tipoUsuSeleccionado;

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

    if((this.usuario =="Administrador") && (this.clave =="123")){
      localStorage.setItem("tipoUsuario","Administrador");
      this.navCtrl.push(PrincipalPage);
    }else if((this.usuario =="Administrativo") && (this.clave =="123")){
      localStorage.setItem("tipoUsuario","Administrativo");
      this.navCtrl.push(PrincipalPage);
    }else if((this.usuario =="Alumno") && (this.clave =="123")){
      localStorage.setItem("tipoUsuario","Alumno");
      this.navCtrl.push(PrincipalPage);
    }else if((this.usuario =="Profesor") && (this.clave =="123")){
      localStorage.setItem("tipoUsuario","Profesor");
      this.navCtrl.push(PrincipalPage);
    }     
  }

  HardcodearUsuario(){
    if(this.tipoUsuSeleccionado=="Administrativo"){
      this.usuario = "Administrativo";
      this.clave = "123";
    }else if(this.tipoUsuSeleccionado=="Administrador"){
      this.usuario = "Administrador";
      this.clave = "123";
    }else if(this.tipoUsuSeleccionado=="Alumno"){
      this.usuario = "Alumno";
      this.clave = "123";
    }else if(this.tipoUsuSeleccionado=="Profesor"){
      this.usuario = "Profesor";
      this.clave = "123";
    }
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
