import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ModalController,ActionSheetController } from 'ionic-angular';
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
  itemsLengthAux  : number = 0;
  initialItemsLength : number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, db: AngularFireDatabase,
     public dataservice : DataProvider,public loadingCtrl: LoadingController, public modalCtrl: ModalController,
     public actionSheetCtrl: ActionSheetController) {
  
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ControlAsistenciaPage');
  }


  select(){
    let optionModal = this.modalCtrl.create(ModalCtrlAsistenciaPage);
    optionModal.present();
  }


  




  addValidatedItem(e){
   if(e.checked){
    this.itemsLengthAux = this.itemsLengthAux + 1;
    }else{
      this.itemsLengthAux = this.itemsLengthAux - 1;
    }
  }


  validateGrid(){
    if(this.items.length == this.itemsLengthAux){
      alert("Desea enviar los datos?");
    }else{

      alert("No verificó todos los alumnos.");
    }
  }


  addAbsence(parValue,legajo){
    this.items.forEach(element => {
      if (element.legajo==legajo) {
       element.inasistencias =  Number.parseFloat(parValue);
      }
    });
        
  }


  presentActionSheet() {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Selección de comisión por...',
      buttons: [
        {
          text: 'Día',
          icon: 'calendar',
          role: 'dia',
          handler: () => {
            let optionModal = this.modalCtrl.create(ModalCtrlAsistenciaPage,{selectedOption : 'dia'});
            optionModal.present();
          }
        },
        {
          text: 'Materia',
          icon: 'book',
          handler: () => {
            let optionModal = this.modalCtrl.create(ModalCtrlAsistenciaPage,{selectedOption : 'materia'});
            optionModal.present();
          }
        },
        {
          text: 'Aula',
          icon: 'locate',
          handler: () => {
            let optionModal = this.modalCtrl.create(ModalCtrlAsistenciaPage,{selectedOption : 'aula'});
            optionModal.present();
          }
        },
        {
          text: 'Docente',
          icon: 'person',
          handler: () => {
            let optionModal = this.modalCtrl.create(ModalCtrlAsistenciaPage,{selectedOption : 'docente'});
            optionModal.present();
          }
        },
        {
          text: 'Alumno',
          icon: 'school',
          handler: () => {
            let optionModal = this.modalCtrl.create(ModalCtrlAsistenciaPage,{selectedOption : 'alumno'});
            optionModal.present();
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
  }


  test(){
    alert("prueba");
  }


}//class
