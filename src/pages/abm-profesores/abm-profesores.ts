import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController, ViewController, Platform } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { GlobalFxProvider } from '../../providers/global-fx/global-fx';

import { PrincipalPage } from '../principal/principal';
import { ModalAbmDocentesPage } from '../modal-abm-docentes/modal-abm-docentes';
import { LocalNotifications }                           from '@ionic-native/local-notifications';
/**
 * Generated class for the AbmProfesoresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-abm-profesores',
  templateUrl: 'abm-profesores.html',
})
export class AbmProfesoresPage {
  public legajo;
  public nombre_apellido;
  public email;
  public clave;
  public tipo_entidad = "docente";

  public ultimoIDEntidadesPersona;
  public arrEntidadesPersona;

  public ultimoIDUsuarios;
  public arrUsuarios;

  public items;
  public itemsUsuarios;
  public arrAvisos;

  //Traducciones
  public traduccionLegajo;
  public traduccionNomYApe;
  public traduccionAccion;
  public traduccionModificar;
  public traduccionEliminar;
  public traduccionTitulo;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private dataProvider: DataProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private viewCtrl: ViewController,
    public  platform: Platform,
    public  localNoti: LocalNotifications,
    private gFx: GlobalFxProvider) {
      //Si aún no se presionó ningún lenguaje, se setea por defecto Español
      if ((localStorage.getItem("Lenguaje") == "") || (localStorage.getItem("Lenguaje") == null) || (localStorage.getItem("Lenguaje") == undefined)){
        localStorage.setItem("Lenguaje", "Es");
      }
      //Le paso el lenguaje que se presionó en sesiones anteriores dentro de la APP
      this.traducir(localStorage.getItem("Lenguaje"));

      this.obtenerAvisos();
      this.getItemsEntidadesPersonas();
      this.getItemsUsuarios();
  }

  
  ionViewDidLoad() {
    // console.log('ionViewDidLoad AbmProfesoresPage');
  }
  
  //Método que traduce objetos de la pagina 
  traducir(lenguaje){    
    //Según lenguaje seleccionado se traducen los objetos.
    if(lenguaje == 'Es'){
      this.traduccionLegajo = "Legajo";
      this.traduccionNomYApe = "Nombre y Apellido";
      this.traduccionAccion = "Acción";
      this.traduccionModificar = "Modificar";
      this.traduccionEliminar = "Eliminar";
      this.traduccionTitulo = "ABM Alumnos";
    }else if(lenguaje == 'Usa'){
      this.traduccionLegajo = "File";
      this.traduccionNomYApe = "Name and surname";
      this.traduccionAccion = "Action";
      this.traduccionModificar = "Modify";
      this.traduccionEliminar = "Remove";
      this.traduccionTitulo = "ABM Teachers";
    }else if(lenguaje == 'Br'){
      this.traduccionLegajo = "Arquivo";
      this.traduccionNomYApe = "Nome e sobrenome";
      this.traduccionAccion = "Ação";
      this.traduccionModificar = "Modificar";
      this.traduccionEliminar = "Excluir";
      this.traduccionTitulo = "ABM Professores";
    }

  }
  
  getItemsEntidadesPersonas() {
    // configuro spinner para mientras se cargan los datos 
    const loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    loading.present();

    //recupero los datos, mientras muestra spinner
    this.dataProvider.getItems("entidades_persona").subscribe(
      datos => {      
        this.items = datos;

        setTimeout(() => {
          loading.dismiss();
        }, 3000);

      },
      error => console.error(error),
      () => console.log("ok")
    );
  }

  getItemsUsuarios() {
    // configuro spinner para mientras se cargan los datos 
    const loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    loading.present();

    //recupero los datos, mientras muestra spinner
    this.dataProvider.getItems("usuarios").subscribe(
      datos => {      
        this.itemsUsuarios = datos;

        setTimeout(() => {
          loading.dismiss();
        }, 3000);

      },
      error => console.error(error),
      () => console.log("ok")
    );
  }


  Baja(leg){
    for (let i=0;i<this.items.length;i++){ 
      if (this.items[i].legajo==leg) {
        this.dataProvider.deleteItem('entidades_persona/'+i);
      }
    }

    for (let i=0;i<this.itemsUsuarios.length;i++){ 
      if (this.itemsUsuarios[i].legajo==leg) {
        this.dataProvider.deleteItem('usuarios/'+i);
      }
    }

    this.getItemsEntidadesPersonas();
    this.getItemsUsuarios();
  }

  AbrirModal(accion, leg){

    if (accion == 'Modificacion'){
      for (let i=0;i<this.items.length;i++){ 
        if (this.items[i].legajo==leg) {
          this.nombre_apellido = this.items[i].nombre_apellido;
        }
      }

      for (let i=0;i<this.itemsUsuarios.length;i++){ 
        if (this.itemsUsuarios[i].legajo==leg) {
          console.log(this.itemsUsuarios[i]);
          this.email = this.itemsUsuarios[i].email;
          this.clave = this.itemsUsuarios[i].clave;        
        }
      }


      let optionModal = this.modalCtrl.create(ModalAbmDocentesPage,{accion: accion, 
                                                                    legajo: leg,
                                                                    nombre: this.nombre_apellido, 
                                                                    email: this.email,
                                                                    clave: this.clave});
                                                                    optionModal.present()
      .then(() => {
        // first we find the index of the current view controller:
        // const index = this.viewCtrl.index;
        // then we remove it from the navigation stack
        // this.navCtrl.remove(index);
      });
    }else{
      let optionModal = this.modalCtrl.create(ModalAbmDocentesPage,{accion: accion});
      optionModal.present()
      .then(() => {
        // first we find the index of the current view controller:
        // const index = this.viewCtrl.index;
        // then we remove it from the navigation stack
        // this.navCtrl.remove(index);
      });
    }
   
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
