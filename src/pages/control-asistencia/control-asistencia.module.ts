import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ControlAsistenciaPage } from './control-asistencia';

@NgModule({
  declarations: [
    ControlAsistenciaPage,
  ],
  imports: [
    IonicPageModule.forChild(ControlAsistenciaPage),
  ],
})
export class ControlAsistenciaPageModule {}
