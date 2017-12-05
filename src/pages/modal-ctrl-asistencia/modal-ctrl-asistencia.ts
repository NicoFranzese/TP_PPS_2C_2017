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
  public comisiones: any[];
  public cursos: any[] ;
  public auxItems: any[];
  flagHide : boolean = false;
  flagCursos : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,
    public dataservice : DataProvider) {
      this.selectedOption =  this.navParams.get('selectedOption');
      this.initializeItems(this.selectedOption);

  }



  initializeItems(selectedOption) {

    if(selectedOption == "dia"){
      this.items = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado' ];
    }else if(selectedOption == "alumno" || selectedOption == "docente"){
      this.getDBData("entidades_persona",selectedOption);
    }else{
      this.getDBData("cursos")  ;
    }

    console.info(this.items);
  }


  searchItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems(this.selectedOption);

    // set val to the value of the searchbar
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
       let result :boolean;
       if(this.selectedOption == "alumno" || this.selectedOption == "docente"){
          result = (item.nombre_apellido.trim().toLowerCase().indexOf(val.toLowerCase()) > -1);
       }else if(this.selectedOption == "aula"){
          result = (item.aula.trim().toLowerCase().indexOf(val.toLowerCase()) > -1);
       }else{
          result = (item.sigla_materia.trim().toLowerCase().indexOf(val.toLowerCase()) > -1); 
       }
  
        return result;
      })
    }
  }


  getDBData(entityName,filter?){
    // configuro spinner para mostrar mientras se consultan los datos 
    const loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    loading.present();
 
    //por única vez recupero los cursos
    if(this.flagCursos == false){
      console.log("recupero cursos");
      this.dataservice.getItems("cursos").subscribe(
        datos => {     
          this.cursos = datos;   
          this.flagCursos = true;
        },
        error => console.error(error),
        () => console.log("ok")
      );
     }
 
    this.dataservice.getItems(entityName).subscribe(
      datos => {     
        if(this.selectedOption == "alumno" || this.selectedOption == "docente"){
          this.items = datos.filter((item) => item.tipo_entidad == filter );
        } else{
          this.items = datos;
        }
        loading.dismiss();  
      },
      error => console.error(error),
      () => console.log("ok")
    );
  

  }//getPeople



  

 getComision(option,filter){


  switch(option) { 

    // faltar terminar bien esta funcion y sendCourseList

    case 'aula': { 
      this.comisiones = this.cursos.filter((item) => item.aula == filter );
      this.flagHide = true;
       break; 
    } 
    case 'dia': { 
      // this.comisiones = this.cursos.filter((item) => item.dia_horario == filter );
      // this.flagHide = true;
      break; 
    } 
    case 'docente': { 
      this.comisiones = this.cursos.filter((item) => item.legajo_docente == filter );
      this.flagHide = true;
      break; 
    } 
    case 'materia': { 
      this.comisiones = this.cursos.filter((item) => item.sigla_materia == filter );
      this.flagHide = true;
      break; 
    } 
    case 'alumno': { 
      // this.comisiones = this.cursos.filter((item) => item.dia_horario == filter );
      // this.flagHide = true;
      break; 
    } 
    default: { 
       //statements; 
       break; 
    } 
   } 
 }


 sendCourseList(item){
   alert(item);
 }


// ***********************************************************************************

  ionViewDidLoad() {

  }

 close(){
  this.navCtrl.push(ControlAsistenciaPage);
 }

 test(){
   alert("ok");
 }
}
