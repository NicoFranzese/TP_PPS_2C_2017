import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { DataProvider } from '../../providers/data/data';


/**
 * Generated class for the ControlAsistenciaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-control-asistencia',
  templateUrl: 'control-asistencia.html',
})
export class ControlAsistenciaPage {
  
  items: any[];


  constructor(public navCtrl: NavController, public navParams: NavParams, db: AngularFireDatabase, public dataservice : DataProvider) {

   this.getAlumnos();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ControlAsistenciaPage');
  }


  getAlumnos() {
    // configuro spinner para mientras se cargan los datos 
    // const loading = this.loadingCtrl.create({
    //   content: 'Espere por favor...'
    // });
    // loading.present();

    this.dataservice.getItems().subscribe(
      datos => {
        this.items = datos;
        // loading.dismiss();
      },
      error => console.error(error),
      () => console.log("ok")
    );
  }




}//class
