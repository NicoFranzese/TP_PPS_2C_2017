import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

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


  items: any[];


  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,
     public dataservice : DataProvider) {
       this.getItems();
       console.log(this.items);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AbmAdministrativosPage');
  }


  
  getItems() {
    // configuro spinner para mientras se cargan los datos 
    const loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    loading.present();

    //recupero los datos, mientras muestra spinner
    this.dataservice.getItems("entidades_persona").subscribe(
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


   test(){
     alert("ok");
   }

}
