import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ModalController,ActionSheetController ,ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { DataProvider } from '../../providers/data/data';
import { LoadingController } from 'ionic-angular';
import { ModalCtrlAsistenciaPage} from '../../pages/modal-ctrl-asistencia/modal-ctrl-asistencia';

@IonicPage()
@Component({
  selector: 'page-control-asistencia',
  templateUrl: 'control-asistencia.html',
})
export class ControlAsistenciaPage {
  
  items: any[];
  arrAusencias: any[] = [];
  lastId : number;
  itemsLengthAux  : number = 0;
  initialItemsLength : number = 0;
  tbCursadasAlumno : any;
  comision : string;

  constructor(public navCtrl: NavController,                  public navParams: NavParams,           public db: AngularFireDatabase,
              public dataservice : DataProvider,              public loadingCtrl: LoadingController, public modalCtrl: ModalController,
              public actionSheetCtrl: ActionSheetController,  private viewCtrl: ViewController) {
       
        console.clear(); 
       this.comision = navParams.get("comision");
       if(this.comision!=null){this.getListaAlumnos(this.comision)}
  }

  ionViewDidLoad() {}

  getListaAlumnos(comision){
    let tbEntidadesPersona,tbCursada,tbCursos,auxCursos,auxCursadasAlumno,auxCursada,auxCursos2,auxAlumno : any;
    let com = comision.toString().split("-");
    this.items = [];
    this.getDBData("asistencias");
    this.lastId = Number(localStorage.getItem("lastId"));

    tbEntidadesPersona  = JSON.parse(localStorage.getItem("entidades_persona"));
    this.tbCursadasAlumno    = JSON.parse(localStorage.getItem("cursadas_alumnos"));
    tbCursada           = JSON.parse(localStorage.getItem("cursadas"));
    tbCursos            = JSON.parse(localStorage.getItem("cursos")); 

    auxCursos = tbCursos.filter((item)=> item.comision == com[0]);
    auxCursos2 =  auxCursos.find((item)=> item.sigla_materia == com[1]);
	
    auxCursada = tbCursada.find((item)=> item.id_curso == auxCursos2.id_curso);
    auxCursadasAlumno = this.tbCursadasAlumno.filter((item)=> item.id_cursada == auxCursada.id_cursada);

    // ya tengo los alumnos que cursan la comision recibida por param
    console.info("auxCursadasAlumno",auxCursadasAlumno);
    auxCursadasAlumno.forEach(element => {
      auxAlumno = tbEntidadesPersona.find((item)=> item.legajo == element.legajo_alumno);
      this.items.push(auxAlumno);

      this.initialItemsLength = 1;

      // inicializo el array para toma de asistencia
      let obj = 
        {
          'id_asistencia': this.lastId + 1,
          'id_cursada_alumno' : element.id_cursada_alumno,
          'fecha': Date(),
          'inasistencia' : 1
        };
      this.lastId = this.lastId + 1;
        
      this.arrAusencias.push(obj);  
      
     }); 
   

  }//getListaAlumnos


  getDBData(entityName){
    // configuro spinner para mostrar mientras se consultan los datos 
    const loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    loading.present(); 
 
    this.dataservice.getItems(entityName).subscribe(
      datos => {
          localStorage.setItem(entityName,JSON.stringify(datos));
          localStorage.setItem("lastId",datos[datos.length -1].id_asistencia);
          setTimeout(() => {
            loading.dismiss();
          }, 2000);
      },
      error => console.error(error),
      () => console.log("ok")
    );

  }//getDBData

  
  addValidatedItem(e){
   if(e.checked){
    this.itemsLengthAux = this.itemsLengthAux + 1;
    }else{
      this.itemsLengthAux = this.itemsLengthAux - 1;
    }
  }//addValidatedItem()


  validateGrid(){
    if(this.items.length == this.itemsLengthAux){
      alert("Desea enviar los datos?");
    }else{
      alert("No verificó todos los alumnos.");
    }
  }//validateGrid()


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
