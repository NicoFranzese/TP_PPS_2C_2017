import { Component } from '@angular/core';
import { IonicPage,NavController,NavParams,ModalController,ActionSheetController,ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { DataProvider } from '../../providers/data/data';
import { LoadingController } from 'ionic-angular';
import { ModalCtrlAsistenciaPage} from '../../pages/modal-ctrl-asistencia/modal-ctrl-asistencia';
import { Subject } from 'rxjs/Subject';

@IonicPage()
@Component({
  selector: 'page-control-asistencia',
  templateUrl: 'control-asistencia.html',
})
export class ControlAsistenciaPage {
  
  items:                any[];
  arrAusencias:         any[];
  tbAsistencias:        any[];
  tbEntidadesPersona:   any[];
  tbCursadasAlumno:     any[];
  tbCursada :           any[];
  tbCursos :            any[];

  lastId :              any;
  itemsLengthAux  :     number = 0;
  initialItemsLength :  number = 0;
  comision :            string;
  fechaActual :         string;

  obsDB = new Subject();


  constructor(public navCtrl: NavController,                  public navParams: NavParams,           public db: AngularFireDatabase,
              public dataservice : DataProvider,              public loadingCtrl: LoadingController, public modalCtrl: ModalController,
              public actionSheetCtrl: ActionSheetController,  private viewCtrl: ViewController,     ) {
         
    console.clear(); 
    this.getDate();
    this.comision = this.navParams.get("comision");
    
    if(this.comision!=null){this.initializeItems();}

      this.obsDB.subscribe(
        terminoOperacion =>  this.getListaAlumnos(this.comision)
      );   

  }


  ionViewDidLoad(){
   
  }

  getDate(){
    let d = new Date();
    this.fechaActual = d.getDate()+"/"+(Number(d.getMonth())+1)+"/"+d.getFullYear();
    console.log(this.fechaActual);
  }

  // Carga inicial de datos.
   initializeItems(){
    // configuro spinner para mostrar mientras se consultan los datos
      console.log("initializeItems");

      const loading = this.loadingCtrl.create({
        content: 'Espere por favor...'
      });
      loading.present(); 
      
      this.getDBData("cursadas_alumnos");
      this.getDBData("entidades_persona");
      this.getDBData("cursadas");
      this.getDBData("cursos");
      this.getDBData("asistencias");

    

      setTimeout(() => {
        loading.dismiss();
      }, 2000);

      
  }//initializeItems()


  getListaAlumnos(comision){
    console.log("getListaAlumnos:"+comision);

    let auxCursos,auxCursadasAlumno,auxCursada,auxCursos2,auxAlumno : any;
    let com = comision.toString().trim().split("-");
    this.items = [];
    this.arrAusencias  = [];

    //filtro los cursos de la comisión (x ej "4A")
    auxCursos = this.tbCursos.filter((item)=> item.comision == com[0]);
    // obtengo el curso para la materia especificada (x ej "PPS")
    auxCursos2 =  auxCursos.find((item)=> item.sigla_materia == com[1]);
    // obtengo la cursada de ese curso
    auxCursada = this.tbCursada.find((item)=> item.id_curso == auxCursos2.id_curso);
    // filtro todos los alumnos de esa cursada
    auxCursadasAlumno = this.tbCursadasAlumno.filter((item)=> item.id_cursada == auxCursada.id_cursada);

    console.info("auxCursadasAlumno:",auxCursadasAlumno);

    // ya tengo los alumnos que cursan la comision recibida por param
    auxCursadasAlumno.forEach(element => {
      auxAlumno = this.tbEntidadesPersona.find((item)=> item.legajo == element.legajo_alumno);
      this.items.push(auxAlumno);
      this.initialItemsLength = 1;

      // inicializo el array para toma de asistencia
      let obj = 
        {
          'id_asistencia': this.lastId ,
          'id_cursada_alumno' : element.id_cursada_alumno,
          'fecha': this.fechaActual,
          'inasistencia' : 1
        };
      this.lastId = this.lastId + 1;      
      this.arrAusencias.push(obj);  
    }); //foreach
   
  }//getListaAlumnos


  getDBData(entityName){
 
    this.dataservice.getItems(entityName).subscribe(
      datos => {
          
            // guardo las tablas para luego poder obtener las comisiones
            switch(entityName) { 
              case 'cursos': { 
                this.tbCursos = datos;
                break; 
              } 
              case 'cursadas':{
                this.tbCursada = datos;
                break;
              }
              case 'cursadas_alumnos':{
                this.tbCursadasAlumno = datos;
                break;
              }
              case 'entidades_persona':{
                this.tbEntidadesPersona = datos;
                break;
              }
              case 'asistencias':{
                this.tbAsistencias = datos;
                this.lastId = (datos.length == 0 ? 1 : datos[datos.length-1].id_asistencia );
                this.obsDB.next();
                break;
              }
            }     
      },
      error => console.error(error),
      () => console.log("ok")
    );

  }//getDBData

  
  sendList(){
    this.arrAusencias.forEach(element => {
      this.dataservice.addItem('asistencias/' + element.id_asistencia , element);
    });
  }

  addAbsence(parLegajo){
    let auxAlumno : any;
    auxAlumno = this.tbCursadasAlumno.find((item)=> item.legajo_alumno == parLegajo);

    this.arrAusencias.forEach(element => {
      if (element.id_cursada_alumno==auxAlumno.id_cursada_alumno) {
        if (element.inasistencia == 1){
          element.inasistencia= 0
        }else if (element.inasistencia == 0){
          element.inasistencia = Number.parseFloat("0.5");
        }else{
          element.inasistencia= 1;
        }
      }
    });
   
  }//addAbsence()

  getStyle(parLegajo,styleType){
    let result : any;
    let auxAlumno : any;
    auxAlumno = this.tbCursadasAlumno.find((item)=> item.legajo_alumno == parLegajo);
    this.arrAusencias.forEach(element => {
      if (element.id_cursada_alumno==auxAlumno.id_cursada_alumno) {
          if(Number.parseFloat(element.inasistencia) == 0.0){
              result = styleType == "icon" ? 0 : "#367F4F";
          }else if(Number.parseFloat(element.inasistencia) == 1.0){
              result = styleType == "icon" ? 2 : "#FF7A66";
          }else {
              result = styleType == "icon" ? 1 : "#BF9D38";
          }
      }
    });
    return result;
  }

  clear(){
    this.arrAusencias.forEach(element => {
      element.inasistencia = 1;
    });
  }

  presentActionSheet() {
    let viewIndex = this.viewCtrl.index;

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Selección de comisión por...',
      buttons: [
        {
          text: 'Día',
          icon: 'calendar',
          handler: () => {
            let optionModal = this.modalCtrl.create(ModalCtrlAsistenciaPage,{selectedOption:'dia' });
            optionModal.present()
            .then(() => {
              // first we find the index of the current view controller:
              const index = this.viewCtrl.index;
              // then we remove it from the navigation stack
              this.navCtrl.remove(index);
            });
          }
        },
        {
          text: 'Materia',
          icon: 'book',
          handler: () => {
            let optionModal = this.modalCtrl.create(ModalCtrlAsistenciaPage,{selectedOption:'materia' });
            optionModal.present()
            .then(() => {
              // first we find the index of the current view controller:
              const index = this.viewCtrl.index;
              // then we remove it from the navigation stack
              this.navCtrl.remove(index);
            });
          }
        },
        {
          text: 'Aula',
          icon: 'locate',
          handler: () => {
            let optionModal = this.modalCtrl.create(ModalCtrlAsistenciaPage,{selectedOption:'aula' });
            optionModal.present() 
            .then(() => {
              // first we find the index of the current view controller:
              const index = this.viewCtrl.index;
              // then we remove it from the navigation stack
              this.navCtrl.remove(index);
            });
          }
        },
        {
          text: 'Docente',
          icon: 'person',
          handler: () => {
            let optionModal = this.modalCtrl.create(ModalCtrlAsistenciaPage,{selectedOption:'docente' });
            optionModal.present() 
            .then(() => {
              // first we find the index of the current view controller:
              const index = this.viewCtrl.index;
              // then we remove it from the navigation stack
              this.navCtrl.remove(index);
            });
          }
        },
        {
          text: 'Alumno',
          icon: 'school',
          handler: () => {
            let optionModal = this.modalCtrl.create(ModalCtrlAsistenciaPage,{selectedOption:'alumno' });
            optionModal.present()
            .then(() => {
              // first we find the index of the current view controller:
              const index = this.viewCtrl.index;
              // then we remove it from the navigation stack
              this.navCtrl.remove(index);
            });
          }
        },

        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();    
  }//presentActionSheet()


  test(){
    alert("prueba");
  }


}//class
