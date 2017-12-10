import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ControlAsistenciaPage} from '../../pages/control-asistencia/control-asistencia';
import { LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';



@IonicPage()
@Component({
  selector: 'page-modal-ctrl-asistencia',
  templateUrl: 'modal-ctrl-asistencia.html',
})
export class ModalCtrlAsistenciaPage {

  comisiones: any[];
  public cursos: any[] ;
  cursadas: any[] ;
  entidades_persona: any[] ;
  cursadas_alumnos: any[] ;
  filteredItems: any[];
  auxItems: any[];

  selectedOption : string;
  searchQuery: string = '';
  flagHide : boolean = false;
  flagCursos : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,
    public dataservice : DataProvider) {
      this.selectedOption =  this.navParams.get('selectedOption');
      this.initializeItems();
      console.clear();
      console.log("paso por constructor");
  }

  // traigo los datos para listar en pantalla, según el criterio q eligió el usuario
  initializeItems() {
    
    if(this.selectedOption == "dia"){
      this.filteredItems = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sabado' ];
    }else if(this.selectedOption == "alumno" || this.selectedOption == "docente"){
      this.getDBData("entidades_persona",true);
    }else {
      this.getDBData("cursos",true)  ;
    }
   
  }

  // función que busca los items para el searchBar
  searchItems(ev: any) {
    // Reset items back to all of the items
    this.filteredItems = this.auxItems;

    // set val to the value of the searchbar
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.filteredItems = this.auxItems.filter((item) => {
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

  getDBData(entityName,firstTime? :boolean){
    // configuro spinner para mostrar mientras se consultan los datos 
    
    const loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    if(firstTime){ loading.present(); }

    this.dataservice.getItems(entityName).subscribe(
      datos => {
        if(firstTime){
          console.log("primera vez: " + entityName);
          if(entityName == "entidades_persona"){
            this.auxItems = datos.filter((item) => item.tipo_entidad == this.selectedOption);
          }else{
            this.auxItems = datos;
          }
          localStorage.setItem(entityName,JSON.stringify(this.auxItems));
          this.filteredItems = this.auxItems;
          setTimeout(() => {
            loading.dismiss();
          }, 2000);
        }else{
          localStorage.setItem(entityName,JSON.stringify(datos));
        }
      },
      error => console.error(error),
      () => console.log("ok")
    );
  }//getDBData


// obtengo la lista de comisiones según los filtros q eligió el usuario
 getComision(option,filter){
  console.log("getcomision("+option+","+filter+");");
  let auxCursadasAlumno,auxCursada,auxCursos,auxCursadasAlumno2,auxCursada2,auxCursos2 : any;
  this.comisiones = [];

  switch(option) { 
    case 'aula': { 
      auxCursos= JSON.parse(localStorage.getItem("cursos")); 
      auxCursos2 = auxCursos.filter((item) => item.aula == filter );
      auxCursos2.forEach(element => {
        this.comisiones.push(element.comision + "-" + element.sigla_materia);
      });
       break; 
    } 
    case 'dia': { 
      auxCursos= JSON.parse(localStorage.getItem("cursos")); 
      auxCursos2 = auxCursos.filter((item) => {
        return (item.dia_horario.trim().toLowerCase().indexOf(filter.toLowerCase()) > -1);
       });
       auxCursos2.forEach(element => {
        this.comisiones.push(element.comision + "-" + element.sigla_materia);
      });
      break; 
    } 
    case 'docente': { 
      auxCursos= JSON.parse(localStorage.getItem("cursos")); 
      auxCursos2 = auxCursos.filter((item) => item.legajo_docente == filter );
      auxCursos2.forEach(element => {
        this.comisiones.push(element.comision + "-" + element.sigla_materia);
      });
      break; 
    } 
    case 'materia': { 
      auxCursos= JSON.parse(localStorage.getItem("cursos"));
      auxCursos2 = auxCursos.filter((item) => item.sigla_materia == filter );
      auxCursos2.forEach(element => {
        this.comisiones.push(element.comision + "-" + element.sigla_materia);
      });
      break; 
    } 
    case 'alumno': { 
            
      auxCursadasAlumno  = JSON.parse(localStorage.getItem("cursadas_alumnos"));
      auxCursada         = JSON.parse(localStorage.getItem("cursadas"));
      auxCursos          = JSON.parse(localStorage.getItem("cursos")); 

      auxCursadasAlumno2 = auxCursadasAlumno.filter((item) => item.legajo_alumno == filter);

      auxCursadasAlumno2.forEach(element => {
        auxCursada2 = auxCursada.find((item) => item.id_cursada == element.id_cursada);
        auxCursos2 = auxCursos.find((item)=> item.id_curso == auxCursada2.id_curso);
        this.comisiones.push(auxCursos2.comision + "-" + auxCursos2.sigla_materia);
      });
      console.info("comisiones: ", this.comisiones);
      break; 
    } 
   } //switch
 } //getComision

 
 sendCourseList(item){
  alert(item);
 }

 close(){
  this.navCtrl.push(ControlAsistenciaPage);
 }

 test(){
   alert("ok");
 }

 ionViewDidLoad() { }

}//class

