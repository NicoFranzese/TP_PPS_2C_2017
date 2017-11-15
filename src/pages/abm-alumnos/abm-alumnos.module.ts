import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AbmAlumnosPage } from './abm-alumnos';

@NgModule({
  declarations: [
    AbmAlumnosPage,
  ],
  imports: [
    IonicPageModule.forChild(AbmAlumnosPage),
  ],
})
export class AbmAlumnosPageModule {}
