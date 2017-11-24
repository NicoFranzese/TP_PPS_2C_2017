import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule }    from '@angular/http';
import { PapaParseModule } from 'ngx-papaparse';

import { FileChooser } from '@ionic-native/file-chooser';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from 'angularfire2/database';


import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { PrincipalPage } from '../pages/principal/principal';

import { AbmAdministrativosPage } from '../pages/abm-administrativos/abm-administrativos';
import { AbmAlumnosPage } from '../pages/abm-alumnos/abm-alumnos';
import { AbmCuestionariosPage } from '../pages/abm-cuestionarios/abm-cuestionarios';
import { AbmProfesoresPage } from '../pages/abm-profesores/abm-profesores';
import { AvisoImportanciaPage } from '../pages/aviso-importancia/aviso-importancia';
import { CargaArchivosPage } from '../pages/carga-archivos/carga-archivos';
import { ControlAsistenciaPage } from '../pages/control-asistencia/control-asistencia';
import { GraficosEstadisticosPage } from '../pages/graficos-estadisticos/graficos-estadisticos';
import { QrAlumnosPage } from '../pages/qr-alumnos/qr-alumnos';
import { QrEncuestasPage } from '../pages/qr-encuestas/qr-encuestas';
import { QrProfesoresPage } from '../pages/qr-profesores/qr-profesores';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginProvider } from '../providers/login/login';
import { DataProvider } from '../providers/data/data';
import { EscanearQrProvider } from '../providers/escanear-qr/escanear-qr';

import { ResultadoEscaneadoPage } from '../pages/resultado-escaneado/resultado-escaneado';
import { ResultadoEscaneadoProvider } from '../providers/resultado-escaneado/resultado-escaneado';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    PrincipalPage,
    AbmAdministrativosPage,
    AbmAlumnosPage,
    AbmCuestionariosPage,
    AbmProfesoresPage,
    AvisoImportanciaPage,
    CargaArchivosPage,
    ControlAsistenciaPage,
    GraficosEstadisticosPage,
    QrAlumnosPage,
    QrEncuestasPage,
    QrProfesoresPage,
    ResultadoEscaneadoPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    PapaParseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    PrincipalPage,
    AbmAdministrativosPage,
    AbmAlumnosPage,
    AbmCuestionariosPage,
    AbmProfesoresPage,
    AvisoImportanciaPage,
    CargaArchivosPage,
    ControlAsistenciaPage,
    GraficosEstadisticosPage,
    QrAlumnosPage,
    QrEncuestasPage,
    QrProfesoresPage,
    ResultadoEscaneadoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginProvider,
    DataProvider,
    FileChooser,
    EscanearQrProvider,
    ResultadoEscaneadoProvider
  ]
})
export class AppModule {}
