import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
import { LocalNotifications } from '@ionic-native/local-notifications';

/**
 * Generated class for the AvisoImportanciaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aviso-importancia',
  templateUrl: 'aviso-importancia.html',
})
export class AvisoImportanciaPage {
  public mensaje;
  public tipoUsuSeleccionado;
  public arrAvisos;
  public ultimoIDAviso = 1;
  public arrPersonas;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public localNoti: LocalNotifications,
              public platform: Platform,
              private dataProvider: DataProvider) {
                this.obtenerPersonas();
                this.obtenerUltimoIDAvisosImportancia();   
  }
  

  ionViewDidLoad() {
    // console.log('ionViewDidLoad AvisoImportanciaPage');
  }

  private obtenerUltimoIDAvisosImportancia()
  {
    this.dataProvider.getItems('avisos_importancia').subscribe(
      data =>
      {
        this.arrAvisos = data;

        if(data.length == 0)
        {
          this.ultimoIDAviso = 1;
        }
        else
        {
          this.ultimoIDAviso= data[data.length-1].id +1;
        }
      },
      err => console.error(err)
    );
  }

  private obtenerPersonas()
  {
    this.dataProvider.getItems('entidades_persona').subscribe(
      data => 
      {
        // this.arrPersonas = data;

        if(data == undefined)
        {
          alert("No existen personas cargadas en la BD");
        }
        else
        {
          this.arrPersonas = data;
        }
        console.log(this.arrPersonas);
      },
      err => console.log(err)
    );
  }


  PushClicked(){
    if((this.mensaje == null) || (this.mensaje == undefined) || (this.mensaje == "") ||
      (this.tipoUsuSeleccionado == null) || (this.tipoUsuSeleccionado == undefined) || (this.tipoUsuSeleccionado == "")){
        alert("Debe seleccionar a quien va destinado el Aviso y escribir un mensaje");
    }else{
      if (this.tipoUsuSeleccionado == "todos"){
        for (let i=0;i<this.arrPersonas.length;i++){ 
          let legajo = this.arrPersonas[i].legajo;  
          if ((legajo < localStorage.getItem("legajoLogueado").toString()) || 
              (legajo > localStorage.getItem("legajoLogueado").toString())){
            let obj = 
            {
              'id': this.ultimoIDAviso,
              'mensaje': this.mensaje,
              'tipoUsuario': this.tipoUsuSeleccionado,
              'legajo': this.arrPersonas[i].legajo
            };        
            this.dataProvider.addItem('avisos_importancia/' + obj.id, obj);
            this.ultimoIDAviso = this.ultimoIDAviso +1;
          }
        }
      }else{
        for (let i=0;i<this.arrPersonas.length;i++){ 
          if (this.arrPersonas[i].tipo_entidad==this.tipoUsuSeleccionado) {
            let legajo = this.arrPersonas[i].legajo;  
            if ((legajo < localStorage.getItem("legajoLogueado").toString()) || 
                (legajo > localStorage.getItem("legajoLogueado").toString())){
              let obj = 
              {
                'id': this.ultimoIDAviso,
                'mensaje': this.mensaje,
                'tipoUsuario': this.tipoUsuSeleccionado,
                'legajo': this.arrPersonas[i].legajo
              };        
              this.dataProvider.addItem('avisos_importancia/' + obj.id, obj);
              this.ultimoIDAviso = this.ultimoIDAviso +1;
            }
          }
        }
      }

      alert("Se ah enviado el aviso.");
    }
  }

}
