import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CargaArchivosPage } from './carga-archivos';

@NgModule({
  declarations: [
    CargaArchivosPage,
  ],
  imports: [
    IonicPageModule.forChild(CargaArchivosPage),
  ],
})
export class CargaArchivosPageModule {}
