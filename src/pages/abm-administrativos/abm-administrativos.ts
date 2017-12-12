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
    // console.log('ionViewDidLoad AbmAdministrativosPage');
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

   private obtenerUltimoIDEntidadesPersona()
   {
     this.dataProvider.getItems('entidades_persona').subscribe(
       data =>
       {
         this.arrEntidadesPersona = data;
 
         if(data.length == 0)
         {
           this.ultimoIDEntidadesPersona = 1;
         }
         else
         {
           this.ultimoIDEntidadesPersona= data.length;
         }
         // console.log(data.length +1);
       },
       err => console.error(err)
     );
   }
 
   private obtenerUltimoIDUsuarios()
   {
     this.dataProvider.getItems('usuarios').subscribe(
       data =>
       {
         this.arrUsuarios = data;
 
         if(data.length == 0)
         {
           this.ultimoIDUsuarios = 1;
         }
         else
         {
           this.ultimoIDUsuarios= data.length;
         }
         
         // console.log(data.length +1);
       },
       err => console.error(err)
     );
   }
 
   Alta(){
 
     // this.obtenerUltimoIDEntidadesPersona();
     // this.obtenerUltimoIDUsuarios();
 
     console.log(this.ultimoIDEntidadesPersona);
     console.log(this.ultimoIDUsuarios);
 
     if((this.legajo == null) || (this.legajo == undefined) || (this.legajo == "") ||
       (this.nombre_apellido == null) || (this.nombre_apellido == undefined) || (this.nombre_apellido == "") ||
     (this.email == null) || (this.email == undefined) || (this.email == "") ||
       (this.clave == null) || (this.clave == undefined) || (this.clave == "")){
         alert("Debe ingresar valores para los campos que visualiza en pantalla");
     }else{
       try {
         let obj = 
         {
           'legajo': this.legajo,
           'nombre_apellido': this.nombre_apellido,
           'tipo_entidad': this.tipo_entidad
         };        
         this.dataProvider.addItem('entidades_persona/' +  this.ultimoIDEntidadesPersona, obj);
   
         let objUsu = 
         {
           'legajo': this.legajo,
           'email': this.email,
           'clave': this.clave
         };                
         this.dataProvider.addItem('usuarios/' +  this.ultimoIDUsuarios, objUsu);
 
         this.legajo="";
         this.nombre_apellido="";
         this.email="";
         this.clave="";
 
         alert("Se ah agregado el docente.");
 
         this.navCtrl.push(PrincipalPage);
       } catch (error) {
         alert("Algo ha fallado, verifique su conexión a internet.");
       }      
     }
   }

}
