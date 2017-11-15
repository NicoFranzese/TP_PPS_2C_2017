import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GraficosEstadisticosPage } from './graficos-estadisticos';

@NgModule({
  declarations: [
    GraficosEstadisticosPage,
  ],
  imports: [
    IonicPageModule.forChild(GraficosEstadisticosPage),
  ],
})
export class GraficosEstadisticosPageModule {}
