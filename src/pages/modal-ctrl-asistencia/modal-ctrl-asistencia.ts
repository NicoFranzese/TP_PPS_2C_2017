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
  public items: any[];

  

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,
    public dataservice : DataProvider) {
      this.selectedOption =  this.navParams.get('selectedOption');
      this.initializeItems(this.selectedOption);

  }



  initializeItems(selectedOption) {

    if(this.selectedOption == "dia"){
      this.items = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado' ];
    }else if(this.selectedOption == "alumno" || this.selectedOption == "docente"){
      this.getDBData("entidades_persona",this.selectedOption);
    }else{
      this.getDBData("cursos")  ;
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

  getDBData(entityName,filter?){
     // configuro spinner para mientras se cargan los datos 
  const loading = this.loadingCtrl.create({
    content: 'Espere por favor...'
  });
  loading.present();

  //recupero los datos, mientras muestra spinner
  this.dataservice.getItems(entityName).subscribe(
    datos => {     

      if(this.selectedOption == "alumno" || this.selectedOption == "docente"){
        this.items = datos.filter((item) => item.tipo_entidad == filter );
      } else{
        this.items = datos;
      } 
      console.info(this.items);
      loading.dismiss();
    },
    error => console.error(error),
    () => console.log("ok")
  );
 }//getPeople








  ionViewDidLoad() {

  }



 close(){
  this.navCtrl.push(ControlAsistenciaPage);
 }


 test(){
   alert("ok");
 }
}
