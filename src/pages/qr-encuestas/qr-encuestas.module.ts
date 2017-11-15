import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrEncuestasPage } from './qr-encuestas';

@NgModule({
  declarations: [
    QrEncuestasPage,
  ],
  imports: [
    IonicPageModule.forChild(QrEncuestasPage),
  ],
})
export class QrEncuestasPageModule {}
