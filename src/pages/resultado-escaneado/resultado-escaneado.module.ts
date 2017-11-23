import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResultadoEscaneadoPage } from './resultado-escaneado';

@NgModule({
  declarations: [
    ResultadoEscaneadoPage,
  ],
  imports: [
    IonicPageModule.forChild(ResultadoEscaneadoPage),
  ],
})
export class ResultadoEscaneadoPageModule {}
