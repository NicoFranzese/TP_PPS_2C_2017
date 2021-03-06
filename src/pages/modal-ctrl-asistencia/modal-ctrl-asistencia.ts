import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController ,LoadingController} from 'ionic-angular';
import { ControlAsistenciaPage} from '../../pages/control-asistencia/control-asistencia';
import { DataProvider } from '../../providers/data/data';



@IonicPage()
@Component({
  selector: 'page-modal-ctrl-asistencia',
  templateUrl: 'modal-ctrl-asistencia.html',
})
export class ModalCtrlAsistenciaPage {

  comisiones:       any[];
  auxItems:         any[];
  filteredItems:    any[];
  tbCursadasAlumno: any[];
  tbCursada :       any[];
  tbCursos :        any[];

  searchQuery:     string = '';
  selectedOption:  string;

  public traduccionTitulo;
  public traduccionNomYApe;
  public traduccionLegajo;
  public traduccionComisionDe;
  public traduccionAsignatura;
  public traduccionComisionesDelAula;
  public traduccionDia;

  constructor(public navCtrl    : NavController,     private viewCtrl: ViewController,    public navParams: NavParams,
              public loadingCtrl: LoadingController ,public dataservice : DataProvider) {
                    //Si aún no se presionó ningún lenguaje, se setea por defecto Español
    if ((localStorage.getItem("Lenguaje") == "") || (localStorage.getItem("Lenguaje") == null) || (localStorage.getItem("Lenguaje") == undefined)){
      localStorage.setItem("Lenguaje", "Es");
    }
    //Le paso el lenguaje que se presionó en sesiones anteriores dentro de la APP
    this.traducir(localStorage.getItem("Lenguaje"));
      
      this.selectedOption =  this.navParams.get('selectedOption');
     
  }

  ionViewDidLoad() { 
    this.initializeItems();
  }


  //Método que traduce objetos de la pagina 
traducir(lenguaje){    
  //Según lenguaje seleccionado se traducen los objetos.
  if(lenguaje == 'Es'){
    this.traduccionTitulo = "Seleccione una comisión";
    this.traduccionNomYApe ="Nombre y Apellido";
    this.traduccionLegajo ="Legajo";
    this.traduccionComisionDe = "Comisiones de ";
    this.traduccionAsignatura = "Asignatura";
    this.traduccionComisionesDelAula = "Comisiones del Aula ";
    this.traduccionDia = "Día";

  }else if(lenguaje == 'Usa'){
    this.traduccionTitulo = "Select a commission";
    this.traduccionNomYApe ="Name and surname";
    this.traduccionLegajo ="File";
    this.traduccionComisionDe = "Commissions of ";
    this.traduccionAsignatura = "Subject";
    this.traduccionComisionesDelAula = "Classroom Commissions ";
    this.traduccionDia = "Day";


  }else if(lenguaje == 'Br'){
    this.traduccionTitulo = "Selecione uma comissão";
    this.traduccionNomYApe ="Nome e sobrenome";
    this.traduccionLegajo ="Arquivo";
    this.traduccionComisionDe = "Comissões de ";
    this.traduccionAsignatura = "Assunto";
    this.traduccionComisionesDelAula = "Comissões de sala de aula ";
    this.traduccionDia = "Dia";

  }

}

  // Carga inicial de datos. El param opcional de getDBData([..]) lo uso para determinar si debo modificar el array que se muestra en pantalla.
  // Esto cambia según la opción de filtro elegida, cargo el array con la tabla correspondiente (curos o entidades_persona) y
  // el resto de las tablas simplemente las guardo en local.
  initializeItems() {
    // configuro spinner para mostrar mientras se consultan los datos 
    const loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    loading.present(); 

    if(this.selectedOption == "dia"){
      // En este caso, los datos no cambian asique manejo un array estático.
      this.filteredItems = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sabado' ];
      this.getDBData("entidades_persona");
      this.getDBData("cursos");
    }else if(this.selectedOption == "alumno" || this.selectedOption == "docente"){
      this.getDBData("entidades_persona",true);
      this.getDBData("cursos");
    }else {
      this.getDBData("entidades_persona");
      this.getDBData("cursos",true);
    }

      this.getDBData("cursadas_alumnos");
      this.getDBData("cursadas");

      setTimeout(() => {
        loading.dismiss();
      }, 2000);

  }//initializeItems()


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
  }//searchItems()

 
  // Consulta contra BBDD, si la tabla es "entidades_persona" filtro por alumno o docente.
  //  Todas las consultas las persisto en localStorage
  getDBData(entityName,itemsToShow? :boolean){
    this.dataservice.getItems(entityName).subscribe(
      datos => {
        if(itemsToShow){
          if(entityName == "entidades_persona"){
            this.auxItems = datos.filter((item) => item.tipo_entidad == this.selectedOption);
          }else{
            this.auxItems = datos;
          }
          this.filteredItems = this.auxItems;
        } 
        // guardo las tablas para luego poder obtener las comisiones
        if(entityName=="cursos"){
          this.tbCursos = datos;
        }else if (entityName=="cursadas"){
          this.tbCursada = datos;
        }else{
          this.tbCursadasAlumno = datos;
        }        
      },
      error => console.error(error),
      () => console.log("ok")
    );
  }//getDBData


// obtengo la lista de comisiones según los filtros q eligió el usuario
 getComision(option,filter){
  let auxCursadasAlumno,auxCursada,auxCursos : any;
  this.comisiones = [];

  switch(option) { 
    case 'aula': { 
      auxCursos = this.tbCursos.filter((item) => item.aula == filter );
      auxCursos.forEach(element => {
        this.comisiones.push(element.comision + "-" + element.sigla_materia);
      });
       break; 
    } 
    case 'dia': { 
      auxCursos = this.tbCursos.filter((item) => {
        return (item.dia_horario.trim().toLowerCase().indexOf(filter.toLowerCase()) > -1);
       });
       auxCursos.forEach(element => {
        this.comisiones.push(element.comision + "-" + element.sigla_materia);
      });
      break; 
    } 
    case 'docente': { 
      auxCursos = this.tbCursos.filter((item) => item.legajo_docente == filter );
      auxCursos.forEach(element => {
        this.comisiones.push(element.comision + "-" + element.sigla_materia);
      });
      break; 
    } 
    case 'materia': { 
      auxCursos = this.tbCursos.filter((item) => item.sigla_materia == filter );
      auxCursos.forEach(element => {
        this.comisiones.push(element.comision + "-" + element.sigla_materia);
      });
      break; 
    } 
    case 'alumno': {      
      auxCursadasAlumno = this.tbCursadasAlumno.filter((item) => item.legajo_alumno == filter);

      auxCursadasAlumno.forEach(element => {
        auxCursada = this.tbCursada.find((item) => item.id_cursada == element.id_cursada);
        auxCursos = this.tbCursos.find((item)=> item.id_curso == auxCursada.id_curso);
        this.comisiones.push(auxCursos.comision + "-" + auxCursos.sigla_materia);
      });
      break; 
    } 
   } //switch
 } //getComision

 
 sendCourseList(item){
    this.navCtrl.push(ControlAsistenciaPage,{comision:item})
    .then(() => {
      // first we find the index of the current view controller:
      const index = this.viewCtrl.index;
      // then we remove it from the navigation stack
      this.navCtrl.remove(index);
    });
 }//sendCourseList()


 close(){
    this.navCtrl.push(ControlAsistenciaPage) 
    .then(() => {
      // first we find the index of the current view controller:
      const index = this.viewCtrl.index;
      // then we remove it from the navigation stack
      this.navCtrl.remove(index);
    });
 }//close()

 test(){
   console.log("ok");
 }


}//class

