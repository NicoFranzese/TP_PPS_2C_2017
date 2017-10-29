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

  public loginGoogle(): any
  {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.lanzarObservable();
  }

  public loginFacebook(): any
  {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    this.lanzarObservable();
  }

  public logOut()
  {
    this.afAuth.auth.signOut();
  }

  private lanzarObservable()
  {
    this.afAuth.authState.subscribe(
      user=>
      {
        if(user != null)
        {
          this.usuarioLogueado['nombre'] = user.displayName;
          this.usuarioLogueado['email'] = user.email;
          console.log(this.usuarioLogueado);
          this.usuarioLogueadoSubject.next();
        }
      }
    );
  }
  
}
