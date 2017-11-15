import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrProfesoresPage } from './qr-profesores';

@NgModule({
  declarations: [
    QrProfesoresPage,
  ],
  imports: [
    IonicPageModule.forChild(QrProfesoresPage),
  ],
})
export class QrProfesoresPageModule {}
