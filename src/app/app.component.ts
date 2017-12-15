import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AlmacenDatosProvider } from '../providers/almacen-datos/almacen-datos';
import { LoginProvider } from '../providers/login/login';
import { LoginPage } from '../pages/login/login';
import { CargaArchivosPage } from '../pages/carga-archivos/carga-archivos';
import { ControlAsistenciaPage } from '../pages/control-asistencia/control-asistencia';
import { AbmCuestionariosPage } from '../pages/abm-cuestionarios/abm-cuestionarios';
import { AbmAdministrativosPage } from '../pages/abm-administrativos/abm-administrativos';
import { AbmProfesoresPage } from '../pages/abm-profesores/abm-profesores';
import { NotificationProvider } from '../providers/notification/notification';
import { EncuestaPage } from '../pages/encuesta/encuesta';
import { AvisoImportanciaPage } from '../pages/aviso-importancia/aviso-importancia';
import { ResultadoEscaneadoPage } from '../pages/resultado-escaneado/resultado-escaneado';

// import { Push, PushToken } from '@ionic/cloud-angular'

// import { Push,PushObject, PushOptions  } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // rootPage: any = EncuestaPage;
  // rootPage: any = ResultadoEscaneadoPage;
  rootPage: any = LoginPage;

  //PARA EL SPLASH ANIMADO
  private splash = true;

  pages: Array<{title: string, component: any}> = [];

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen, 
              private almacenDatosProvider: AlmacenDatosProvider,
              private loginProvider: LoginProvider,
              private notificationsProvider: NotificationProvider
              // public push: Push
              // , private pushNativo: Push
            ) 
  {

    // this.notificationsProvider.init();

    this.initializeApp();

    this.almacenDatosProvider.arrMenuOpciones$.subscribe(
      data => 
      {
        data.forEach(element => 
          {
            this.pages.push
            (
              { title: element[0], component: element[3]}
            );
          });

        if(data.length != 0)
          this.pages.push({title: 'Desloguearse', component: LoginPage});
      }
    );

    // used for an example of ngFor and navigation
    // this.pages = [
      // { title: 'Home', component: LoginPage },
      // { title: 'List', component: PrincipalPage },
      // { title: 'ControlAsistencia', component: ControlAsistenciaPage }
    // ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // if(this.platform.is('core') || this.platform.is('mobileweb')) {

      // } else {
      //   this.pushNativo.hasPermission()
      //   .then((res: any) => {
      //     if (res.isEnabled) {
      //       console.log('Permiso OK para Enviar Push Notificaciones');
      //     } else {
      //       console.log('Permiso Deneagado para Enviar Push Notificaciones');
      //     }
      //   });

      //   const options: PushOptions = {
      //     android: { },
      //     ios: {
      //         alert: 'true',
      //         badge: true,
      //         sound: 'false'
      //     },
      //     windows: {},
      //     browser: {
      //         pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      //     }
      //   };

      //   const pushObject: PushObject = this.pushNativo.init(options);   
      //   pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification)); 
      //   pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));
      //   pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
      // }

     

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //PARA EL SPLASH ANIMADO
      this.almacenDatosProvider.reproducirSonido('beep');
      setTimeout(() => this.splash = false, 4000);

      // this.RegisterNotification();
      // this.Notification();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);

  }

  // private RegisterNotification(){
  //   this.push.register().then((t: PushToken) => {
  //     return this.push.saveToken(t);
  //   }).then((t: PushToken) => {
  //     console.log('token grabado:', t.token);
  //   });
  // }

  // private Notification(){
  //   this.push.rx.notification()
  //     .subscribe((msg) => {
  //       alert(msg.title + ':' + msg.text)
  //   });
  // } 



}
