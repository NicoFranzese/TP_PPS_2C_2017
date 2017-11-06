import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { DataProvider } from '../../providers/data/data';
import { LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-control-asistencia',
  templateUrl: 'control-asistencia.html',
})
export class ControlAsistenciaPage {
  
  items: any[];
  


  constructor(public navCtrl: NavController, public navParams: NavParams, db: AngularFireDatabase,
     public dataservice : DataProvider,public loadingCtrl: LoadingController) {
  
   this.getAlumnos();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ControlAsistenciaPage');
  }


  getAlumnos() {
    // configuro spinner para mientras se cargan los datos 
    const loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    loading.present();

    //recupero los datos, mientras muestra spinner
    this.dataservice.getItems().subscribe(
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



  addAbsence(parValue,legajo){
    this.items.forEach(element => {
      if (element.legajo==legajo) {
       element.inasistencias =  Number.parseFloat(parValue);
      }
    });
        
  }

}//class
