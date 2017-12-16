import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { ResultadoEscaneadoProvider } from '../../providers/resultado-escaneado/resultado-escaneado'
import { LoadingController } from 'ionic-angular';
import { LocalNotifications }                           from '@ionic-native/local-notifications';
import { DataProvider } from '../../providers/data/data';

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
  public arrAvisos;

  constructor(public navCtrl: NavController, public navParams: NavParams,
            public servicioResultadoEscaneado: ResultadoEscaneadoProvider,
            public loadingCtrl: LoadingController,
            public  platform: Platform,
            public  localNoti: LocalNotifications,
            private dataProvider: DataProvider) {
              this.obtenerAvisos();

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
