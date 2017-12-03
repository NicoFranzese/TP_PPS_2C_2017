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


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // rootPage: any = CargaArchivosPage;
  rootPage: any = AbmCuestionariosPage;

  pages: Array<{title: string, component: any}> = [];

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen, 
              private almacenDatosProvider: AlmacenDatosProvider,
              private loginProvider: LoginProvider) 
  {

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
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);

  }
}
