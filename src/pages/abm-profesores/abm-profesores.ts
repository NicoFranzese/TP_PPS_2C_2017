import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController, ViewController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

import { PrincipalPage } from '../principal/principal';
import { ModalAbmDocentesPage } from '../modal-abm-docentes/modal-abm-docentes';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private dataProvider: DataProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private viewCtrl: ViewController) {
      this.getItemsEntidadesPersonas();
      this.getItemsUsuarios();
  }

  
  ionViewDidLoad() {
    // console.log('ionViewDidLoad AbmProfesoresPage');
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



}
