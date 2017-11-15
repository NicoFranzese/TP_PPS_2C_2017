import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrAlumnosPage } from './qr-alumnos';

@NgModule({
  declarations: [
    QrAlumnosPage,
  ],
  imports: [
    IonicPageModule.forChild(QrAlumnosPage),
  ],
})
export class QrAlumnosPageModule {}
