import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ResultadoEscaneadoProvider } from '../../providers/resultado-escaneado/resultado-escaneado'
import { LoadingController } from 'ionic-angular';
/**
 * Generated class for the ResultadoEscaneadoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-resultado-escaneado',
  templateUrl: 'resultado-escaneado.html',
})
export class ResultadoEscaneadoPage {

  public resultadoEscaneado;
  public materia;
  public comision;
  public escaneoDesde;
  public items;
  public aula;
  public horario;
  public legDocente;
  public profesor;


  constructor(public navCtrl: NavController, public navParams: NavParams,
            public servicioResultadoEscaneado: ResultadoEscaneadoProvider,
            public loadingCtrl: LoadingController) {

       // configuro spinner para mientras se cargan los datos 
      const loading = this.loadingCtrl.create({
        content: 'Espere por favor...'
      });
      loading.present();
      this.escaneoDesde = localStorage.getItem("escaneoDesde");

      if (this.escaneoDesde = "Alumno"){
        this.materia = localStorage.getItem("materiaEscaneada");
        this.comision = localStorage.getItem("comisionEscaneada");
        this.profesor = localStorage.getItem("profesorEscaneado");
        this.aula = localStorage.getItem("aulaEscaneada");
        this.horario = localStorage.getItem("horarioEscaneada");   
        loading.dismiss();           
      }else if (this.escaneoDesde = "Profesor"){
        loading.dismiss();
      } else if (this.escaneoDesde = "Encuesta"){
        loading.dismiss();
      }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ResultadoEscaneadoPage');
    // this.materia ="PPS";
    // this.aula ="505";
    // this.comision ="4A";
    // this.horario = "Sabados 09.00 a 10 hs"
    // this.profesor = "Villegas Octavio" ;

  }

  ResultadoEscaneado() {
    this.servicioResultadoEscaneado.ResultadoEscaneado().subscribe(
      data => this.resultadoEscaneado = data,
      err => {
        console.error(err);
      },
      () => { }
    );
  }

}
