import { Injectable } from '@angular/core';
import { App } from "ionic-angular";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { PrincipalPage } from '../../pages/principal/principal';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class LoginProvider {

  public usuarioLogueado = [];
  public usuarioLogueadoSubject = new Subject<any>();

  constructor(public afAuth: AngularFireAuth) { 
  }

  public loginRedSocial(proveedor: string): any
  {
    let provider;

    switch(proveedor)
    {
      case 'google':
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      case 'facebook':
        provider = new firebase.auth.FacebookAuthProvider();
        break;
    }

    firebase.auth().signInWithRedirect(provider).then(()=>
    {
      firebase.auth().getRedirectResult().then((user)=>
      {
        console.log(user);
        this.usuarioLogueado['nombre'] = user['user'].displayName;
        this.usuarioLogueado['email'] = user['user'].email;
        this.usuarioLogueadoSubject.next();
      }).catch((error)=>
      {
        console.log(error)
      });
    });
  }

  public logOut()
  {
    this.afAuth.auth.signOut();
  }
  
}
