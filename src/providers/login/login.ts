import { Injectable } from '@angular/core';
import { App } from "ionic-angular";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { PrincipalPage } from '../../pages/principal/principal';
import { Subject } from 'rxjs/Subject';
import { Platform } from 'ionic-angular';
import { AlmacenDatosProvider } from '../almacen-datos/almacen-datos';


@Injectable()
export class LoginProvider {

  //@usuarioLogueado donde guardo los datos del usuario una vez traidos de la red social.
  //Puedo acceder desde cualquier componente, haciendo uso de este provider.
  //@usuarioLogueadoSubject este observable se va a ejecutar cuando traigo los datos de la red social
  //Como la comunicación con las redes sociales es asincrónica, necesito avisar una vez que tengo los datos para luego navegar hacia otro componente.
  public usuarioLogueado = [];
  public usuarioLogueadoSubject = new Subject<any>();
  private provider;

  constructor(private afAuth: AngularFireAuth,
              private platform: Platform,
              private almacenDatos: AlmacenDatosProvider) { 
               
  }

  //Método público que llamo del lado del componente.
  //Recibe el tipo de proveedor que puede ser google o facebook.
  //Según este proveedor inicializo un provider del tipo que corresponda.
  //Luego compruebo en que dispositivo se está ejecutando, si en una pc o un celular.
  //Esto es para poder iniciar sesión en los dos tipos de dispositivos.
  public loginRedSocial(proveedor: string): any
  {
    switch(proveedor)
    {
      case 'google':
        this.provider = new firebase.auth.GoogleAuthProvider();
        break;
      case 'facebook':
        this.provider = new firebase.auth.FacebookAuthProvider();
        break;
    }

    if(this.platform.is('core') || this.platform.is('mobileweb')) {
      this.loginWindows();
    } else {
      this.loginAndroid();
    }
    
  }

  //Si el dispositivo es un celular android, ejecuto la promesa que me devuelve el usuario.
  //Asigno los datos nombre y email de este usuario a mi variable pública que puedo ver desde el componente.
  //Cuando estaasignación termina ejecuto un observable para avisar que ya tengo los datos.
  private loginAndroid(): any
  {
      firebase.auth().signInWithRedirect(this.provider).then(()=>
      {
        firebase.auth().getRedirectResult().then((user)=>
        {
          console.log(user);
          this.usuarioLogueado['nombre'] = user['user'].displayName;
          this.usuarioLogueado['email'] = user['user'].email;
          this.usuarioLogueado['photoURL'] = user['user'].photoURL;
          this.usuarioLogueadoSubject.next();
        }).catch((error)=>
        {
          console.log(error)
        });
      });
  }

  //Si el dispositivo es una pc emulando la app, inicio sesión y me suscribo al observable que me trae los datos de usuario.
  //Una vez que le asigno esos datos a mi variable pública, lanzo un observable para avisar que ya tengo los datos.
  private loginWindows()
  {
    this.afAuth.auth.signInWithPopup(this.provider);
    this.afAuth.authState.subscribe(
       user=>
       {
         
         if(user != null)
         {
           this.usuarioLogueado['nombre'] = user.displayName;
           this.usuarioLogueado['email'] = user.email;
           this.usuarioLogueado['photoURL'] = user.photoURL;
           this.usuarioLogueadoSubject.next();
         }
       }
     );
  }

  public logOut()
  {
    this.usuarioLogueado = [];
    this.almacenDatos.usuarioLogueado = "";
    this.afAuth.auth.signOut();
    this.almacenDatos.reproducirSonido('intro');
  }

  
}
