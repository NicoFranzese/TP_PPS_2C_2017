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
export class LoginPage {

  private loader;
  public email ="adminis@trativo";
  public clave= 123;
  private arrUsuarios = [];
  private arrEntidades = [];
  private referenciaSubj;

  public traduccionClave;
  public traduccionEmail;
  public traduccionIngresar;
  public traduccionOIngresarCon;
  public selectedImage;
  public arrImages;
  public  fotoPerfil;
  

  constructor(private navCtrl: NavController,
              private loginProvider: LoginProvider,
              private loadingCtrl: LoadingController,
              private dataProvider: DataProvider,
              private almacenDatos: AlmacenDatosProvider,
              private toastCtrl: ToastController) 
  {
    //Si aún no se presionó ningún lenguaje, se setea por defecto Español
    if ((localStorage.getItem("Lenguaje") == "") || (localStorage.getItem("Lenguaje") == null) || (localStorage.getItem("Lenguaje") == undefined)){
      localStorage.setItem("Lenguaje", "Es");
    }
    //Le paso el lenguaje que se presionó en sesiones anteriores dentro de la APP
    this.traducir(localStorage.getItem("Lenguaje"));

  }

  //Método que traduce objetos de la pagina 
  traducir(lenguaje){    
    //Guardo en el localStorage el Lenguaje seleccionado
    localStorage.setItem("Lenguaje",lenguaje);
    //Según lenguaje seleccionado se traducen los objetos.
    if(lenguaje == 'Es'){
      this.traduccionClave = "Clave";
      this.traduccionEmail = "Email";
      this.traduccionIngresar = "Ingresar";
      this.traduccionOIngresarCon = "O puede ingresar con:";
    }else if(lenguaje == 'Usa'){
      this.traduccionClave = "Password";
      this.traduccionEmail = "E-mail";
      this.traduccionIngresar = "Enter";
      this.traduccionOIngresarCon = "Or you can enter with:";
    }else if(lenguaje == 'Br'){
      this.traduccionClave = "Senha";
      this.traduccionEmail = "E-mail";
      this.traduccionIngresar = "Digite";
      this.traduccionOIngresarCon = "Ou você pode entrar com:";
    }

  }


  ionViewDidLoad() {
    
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
    let band = false;
  
    this.arrUsuarios.forEach(element => {

      if(element.email == this.email && element.clave == this.clave)
      {
        band = true;
        localStorage.setItem("legajoLogueado", element.legajo);
        this.getFotoPerfil(element.legajo);
        this.obtenerDatosUsuario(element.legajo);
      }
      
    });
    if(!band)
    {
      this.mostrarToast("Usuario y/o contraseña inválidos");
      this.loader.dismiss();
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
            this.referenciaSubj.unsubscribe();
            this.obtenerDatosUsuario(element.legajo);
            this.guardarFotoPerfil(element.legajo);
          }
          
        });
        if(!band)
        {
          this.mostrarToast("Usuario inválido");
          this.loader.dismiss();
        }
          
        
     }
    );
  }

  private obtenerDatosUsuario(legajo)
  {
    this.arrEntidades.forEach(element => {

      if(element.legajo == legajo)
      {
        let email;
        let foto;
        let usuario;

        if(this.loginProvider.usuarioLogueado['email'] != undefined)
        {
          email = this.loginProvider.usuarioLogueado['email'];
          foto = this.loginProvider.usuarioLogueado['photoURL'];
        }
        else
        {
          // console.log("Login ok");
          email = this.email;
         
        }
        

        for (let i=0;i<this.arrUsuarios.length;i++){ 
          if (this.arrUsuarios[i].legajo==legajo) {
              usuario = this.arrUsuarios[i].id_usuario;
          }
        }

        this.almacenDatos.usuarioLogueado = {
          'legajo': element.legajo,
          'nombre': element.nombre_apellido,
          'tipo_entidad': element.tipo_entidad,
          'email': email,
          'id_persona' : element.id_persona,
          'id_usuario' : usuario
          
        }
      }
    });
    this.loader.dismiss();
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

  private guardarFotoPerfil(legajo)
  {

    // console.log(legajo);
    this.dataProvider.getItems('fotoPerfil/'+legajo+'/arrFotos').subscribe(
      data => 
      {
        console.log(data);
        if(data.length == 0)
        {
          let arr = [];
          arr.push(this.loginProvider.usuarioLogueado['photoURL']);
          this.dataProvider.addItem('fotoPerfil/'+legajo+'/arrFotos/',arr);
        }
        else
        {
          this.dataProvider.addItem('fotoPerfil/'+legajo+'/arrFotos/0',this.loginProvider.usuarioLogueado['photoURL']);
        }
      }
    );
  }


  getFotoPerfil(leg)  {
 
   //recupero los datos, mientras muestra spinner
   this.dataProvider.getItems("fotoPerfil/"+leg).subscribe(
     datos => {  
  
       this.arrImages = datos[0];
       this.selectedImage = datos[1];

       if(datos.length == 1){
        this.almacenDatos.usuarioLogueado.photoURL = this.arrImages[0];
       }else if(this.arrImages == undefined){
        this.almacenDatos.usuarioLogueado.photoURL = "./assets/img/anonimo.jpg";
       }else{
        this.almacenDatos.usuarioLogueado.photoURL = this.arrImages[this.selectedImage.posicion];
       }
       
      },
     error => console.error(error),
     () => console.log("ok")
   );

 }//getFotos()

}
//end class
