import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { AlmacenDatosProvider } from '../../providers/almacen-datos/almacen-datos';
import { ModalCuestionariosPage} from '../modal-cuestionarios/modal-cuestionarios';
import { ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-abm-cuestionarios',
  templateUrl: 'abm-cuestionarios.html',
})
export class AbmCuestionariosPage {

  private hayCuestionarios: boolean = false;
  private arrCuestionarios;
  

  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private modalCtrl: ModalController,
              private dataProvider: DataProvider,
              private almacenDatos: AlmacenDatosProvider) {
  }

  ionViewDidLoad() {
    this.obtenerUltimoIDCuestionarios();
  }



  private modalCuestionario(operacion: string)
  {
    this.almacenDatos.operacionCuestionario = operacion;
    this.modalCtrl.create(ModalCuestionariosPage).present();
  }


  private obtenerUltimoIDCuestionarios()
  {
    this.dataProvider.getItems('cuestionarios').subscribe(
      data =>
      {
        this.arrCuestionarios = data;
        if(data.length == 0)
        {
          this.hayCuestionarios = false;
          this.almacenDatos.ultimoIdCuestionario = 1;
        }
        else
        {
          this.hayCuestionarios = true;
          this.almacenDatos.ultimoIdCuestionario= data[data.length-1].id +1;
        }
      },
      err => console.error(err)
    );
  }

  private editarCuestionario(item)
  {
    this.almacenDatos.cuestionarioEditar = item;
    this.modalCuestionario("Editar Cuestionario");
  }

  private eliminarCuestionario(item)
  {
    this.dataProvider.deleteItem('cuestionarios/' + item.id);
  }


}

