import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController, ViewController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

import { PrincipalPage } from '../principal/principal';
import { ModalAbmAdministrativosPage } from '../modal-abm-administrativos/modal-abm-administrativos';

/**
 * Generated class for the AbmAdministrativosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-abm-administrativos',
  templateUrl: 'abm-administrativos.html',
})
export class AbmAdministrativosPage {

  public legajo;
  public nombre_apellido;
  public email;
  public clave;
  public tipo_entidad = "administrativo";

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
    // console.log('ionViewDidLoad AbmAdministrativosPage');
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
      if (this.items[i].legajo.toString()==leg.toString()) {
        this.dataProvider.deleteItem('entidades_persona/'+i);
      }
    }

    for (let j=0;j<this.itemsUsuarios.length;j++){ 
      if (this.itemsUsuarios[j].legajo.toString()==leg.toString()) {
        this.dataProvider.deleteItem('usuarios/'+j);
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
    
          for (let j=0;j<this.itemsUsuarios.length;j++){ 
            if (this.itemsUsuarios[j].legajo==leg) {
              this.email = this.itemsUsuarios[j].email;
              this.clave = this.itemsUsuarios[j].clave;        
            }
          }
    
    
          let optionModal = this.modalCtrl.create(ModalAbmAdministrativosPage,{accion: accion, 
                                                                        legajo: leg.toString(),
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
          let optionModal = this.modalCtrl.create(ModalAbmAdministrativosPage,{accion: accion});
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
