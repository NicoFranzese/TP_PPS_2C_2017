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


  constructor(public navCtrl: NavController, public navParams: NavParams,
            public servicioResultadoEscaneado: ResultadoEscaneadoProvider,
            public loadingCtrl: LoadingController) {

       // configuro spinner para mientras se cargan los datos 
      const loading = this.loadingCtrl.create({
        content: 'Espere por favor...'
      });
      loading.present();
      
            this.materia = localStorage.getItem("materiaEscaneada");
            this.comision = localStorage.getItem("comisionEscaneada");
            this.escaneoDesde = localStorage.getItem("escaneoDesde");

            if (this.escaneoDesde = "Alumno"){
              this.servicioResultadoEscaneado.traerDatos("cursos").subscribe(                
                datos => {      
                  this.items = datos;
                  setTimeout(() => {
                    loading.dismiss();
                  }, 3000);
                },
                error => {console.error(error);},
                () => {console.log("ok");}
              );   
              
              this.aula = this.items[0].aula;
              this.horario = this.items[0].dia_horario;
              this.legDocente = this.items[0].legajo_docente;
              
            }else if (this.escaneoDesde = "Profesor"){
              this.servicioResultadoEscaneado.traerDatos("cursos").subscribe(                
                datos => {      
                  this.items = datos;
                  setTimeout(() => {
                    loading.dismiss();
                  }, 3000);
                },
                error => {console.error(error);},
                () => {console.log("ok");}
              );  
              
              this.aula = this.items[0].aula;
              this.horario = this.items[0].dia_horario;
              this.legDocente = this.items[0].legajo_docente;

            } else if (this.escaneoDesde = "Encuesta"){
              loading.dismiss();
            }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ResultadoEscaneadoPage');
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
