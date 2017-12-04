import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ControlAsistenciaPage} from '../../pages/control-asistencia/control-asistencia';
import { LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the ModalCtrlAsistenciaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-ctrl-asistencia',
  templateUrl: 'modal-ctrl-asistencia.html',
})
export class ModalCtrlAsistenciaPage {


  selectedOption : string;
  searchQuery: string = '';
  items: any[];
  auxItems: any[];
  

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,
    public dataservice : DataProvider) {


  }

 isAlumno(element, index, array) { 
    return (element.tipo_entidad =="alumno"); 
 } 


  initializeItems(selectedOption) {


    switch(selectedOption) { 
      case 'dia': { 
        this.items = [
          'Lunes',
          'Martes',
          'Miércoles',
          'Jueves',
          'Viernes',
          'Sábado'
        ];
         break; 
      } 
      case 'materia': { 
         //statements; 
         break; 
      } 
      case 'aula': { 
        //statements; 
        break; 
     } 
     case 'docente': { 
      //statements; 
      break; 
     }   
     case 'alumno': { 
        // this.getDBData("entidad_persona");
        // for (let item in this.auxItems){
        //    let aux = JSON.parse(item);
        //    console.log("aux: " + aux);
        //    if (aux.tipo_entidad == "alumno"){
        //       this.items.fill(aux)
        //    }

        //  }
        //  console.log("items:" + this.items);
    break; 
 } 
      default: { 
         //statements; 
         break; 
      } 
   } 
    


  }



  searchItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems(this.selectedOption);

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

 getDBData(entityName){
     // configuro spinner para mientras se cargan los datos 
  const loading = this.loadingCtrl.create({
    content: 'Espere por favor...'
  });
  loading.present();

  //recupero los datos, mientras muestra spinner
  this.dataservice.getItems(entityName).subscribe(
    datos => {      
      this.auxItems = datos;
      setTimeout(() => {
        loading.dismiss();
      }, 2000);
    },
    error => console.error(error),
    () => console.log("ok")
  );
 }







  ionViewDidLoad() {
    this.selectedOption =  this.navParams.get('selectedOption');
    console.log("opcion: "+ this.selectedOption);
    this.initializeItems(this.selectedOption);
  }

  ngOnInit(){

  }


 close(){

  this.navCtrl.push(ControlAsistenciaPage);
 }


 test(){
   alert("ok");
 }
}
