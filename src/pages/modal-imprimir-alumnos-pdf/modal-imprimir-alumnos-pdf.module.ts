import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalImprimirAlumnosPdfPage } from './modal-imprimir-alumnos-pdf';

@NgModule({
  declarations: [
    ModalImprimirAlumnosPdfPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalImprimirAlumnosPdfPage),
  ],
})
export class ModalImprimirAlumnosPdfPageModule {}
