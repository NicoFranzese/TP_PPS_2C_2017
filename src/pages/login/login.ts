import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { PrincipalPage } from '../principal/principal';
import { LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { AlmacenDatosProvider } from '../../providers/almacen-datos/almacen-datos';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit{

  private loader;
  public usuario;
  public clave;
  public tipoUsuSeleccionado;
  private arrUsuarios = [];
  private arrEntidades = [];
  private referenciaSubj;

  constructor(private navCtrl: NavController,
              private loginProvider: LoginProvider,
              private loadingCtrl: LoadingController,
              private dataProvider: DataProvider,
              private almacenDatos: AlmacenDatosProvider,
              private toastCtrl: ToastController) 
  {
  }

  ngOnInit()
  {
    this.loginProvider.logOut();
    this.traerUsuarios();
    this.traerEntidades();
  }


  private traerUsuarios()
  {
    this.dataProvider.getItems('usuarios').subscribe(
      data => this.arrUsuarios = data,
      err => console.error(err)
    );
  }

  private traerEntidades()
  {
    this.dataProvider.getItems('entidades_persona').subscribe(
      data => this.arrEntidades = data,
      err => console.error(err)
    );
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
    this.loginProvider.loginRedSocial(proveedor);
    this.referenciaSubj = this.loginProvider.usuarioLogueadoSubject.subscribe(
     data =>
     {
       let band = false;

        this.arrUsuarios.forEach(element => {

          if(element.email == this.loginProvider.usuarioLogueado['email'])
          {
            band = true;
            this.obtenerDatosUsuario(element.legajo);
          }
          
        });
        if(!band)
        {
          this.mostrarToast("Usuario invàlido");
          this.loader.dismiss();
        }
          
        
     }
    );
  }

  private obtenerDatosUsuario(legajo)
  {
    this.arrEntidades.forEach(element => {

      if(element.legajo == legajo)
        this.almacenDatos.usuarioLogueado = {
          'legajo': element.legajo,
          'nombre': element.nombre_apellido,
          'email': this.loginProvider.usuarioLogueado['email'],
          'tipo_entidad': element.tipo_entidad,
          'photoURL': this.loginProvider.usuarioLogueado['photoURL']
        }
    });
    this.loader.dismiss();
    this.referenciaSubj.unsubscribe();
    this.navCtrl.push(PrincipalPage);
  }

  private mostrarLoading(msg: string)
  {
    this.loader = this.loadingCtrl.create({
      content: msg
    });
    this.loader.present();
  }

  private mostrarToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    }).present();
  }
}
