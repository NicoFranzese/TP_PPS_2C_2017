import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCuestionariosPage } from './modal-cuestionarios';

@NgModule({
  declarations: [
    ModalCuestionariosPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCuestionariosPage),
  ],
})
export class ModalCuestionariosPageModule {}
