import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { AlmacenDatosProvider } from '../../providers/almacen-datos/almacen-datos';
import { ModalCuestionariosPage} from '../modal-cuestionarios/modal-cuestionarios';
import { ModalController } from 'ionic-angular';
import { LocalNotifications }                           from '@ionic-native/local-notifications';

@IonicPage()
@Component({
  selector: 'page-abm-cuestionarios',
  templateUrl: 'abm-cuestionarios.html',
})
export class AbmCuestionariosPage {

  private hayCuestionarios: boolean = false;
  private arrCuestionarios;
  public arrAvisos;
  

  constructor(private navCtrl: NavController, 
              private navParams: NavParams,
              private modalCtrl: ModalController,
              private dataProvider: DataProvider,
              private almacenDatos: AlmacenDatosProvider,
              public  platform: Platform,
              public  localNoti: LocalNotifications) {
                this.obtenerAvisos();
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

        //Si vengo de escanear un qr como profesor, edito el cuestionario
        console.log(this.navParams.get('id'));
        if(this.navParams.get('id'))
          this.vengoDeLeerQr();

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

  private vengoDeLeerQr()
  {
    //Obtengo el id enviado desde la pag principal
    let idEscaneado = this.navParams.get('id');
    
    //Recorro los cuestionarios y encuentro el que quiero editar
    this.arrCuestionarios.forEach(element => {
      if(element.id == idEscaneado)
      {
        // let respuesta = this.almacenDatos.calcularHorasRestantes(element);
        // alert(respuesta);
         this.editarCuestionario(element);
      }
       
    });

  }

  private test(item)
  {
    console.log(item);
  }

  private obtenerAvisos()
  {
    this.dataProvider.getItems('avisos_importancia').subscribe(
      data => 
      {
        // this.arrPersonas = data;

        if(data == undefined)
        {
          // alert("No existen personas cargadas en la BD");
        }
        else
        {
          this.arrAvisos = data;

          for (let i=0;i<this.arrAvisos.length;i++){ 
            let legajo = this.arrAvisos[i].legajo;
            if ((legajo < localStorage.getItem("legajoLogueado").toString()) || 
                (legajo > localStorage.getItem("legajoLogueado").toString())){
                }else{
                  this.platform.ready().then(() => {
                    this.localNoti.schedule({
                      title: 'Alerta de Gestión Académica!',
                      text: this.arrAvisos[i].mensaje,
                      at: new Date(new Date().getTime() + 3600),
                      led: 'FF0000',
                      icon:'', //ruta del icono
                      sound: 'assets/sonidos/notificacion.mp3' //Ruta del archivo de sonido
                    });
                  //Elimino aviso para que no vuelva a enviarlo.
                    // this.dataProvider.deleteItem('avisos_importancia/'+this.arrAvisos[i].id);
                  });
                }
          }

          for (let i=0;i<this.arrAvisos.length;i++){ 
            let legajo = this.arrAvisos[i].legajo;
            if ((legajo < localStorage.getItem("legajoLogueado").toString()) || 
                (legajo > localStorage.getItem("legajoLogueado").toString())){
                  
                }else{
                  this.platform.ready().then(() => {
                  //Elimino aviso para que no vuelva a enviarlo.
                    this.dataProvider.deleteItem('avisos_importancia/'+this.arrAvisos[i].id);
                  });
                }
          }
        }
        // console.log(this.arrAvisos);
      },
      err => console.log(err)
    );
  }



}

