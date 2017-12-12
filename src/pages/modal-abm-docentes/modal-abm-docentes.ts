import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController ,LoadingController} from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { AbmProfesoresPage } from '../abm-profesores/abm-profesores';
/**
 * Generated class for the ModalAbmDocentesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-abm-docentes',
  templateUrl: 'modal-abm-docentes.html',
})
export class ModalAbmDocentesPage {

  public accion;
  public legajo;
  public nombre_apellido;
  public email;
  public clave;
  public tipo_entidad = "docente";

  public ultimoIDEntidadesPersona;
  public arrEntidadesPersona;

  public ultimoIDUsuarios;
  public arrUsuarios;

  public items;
  public itemsUsuarios; 

  constructor(public navCtrl    : NavController,     private viewCtrl: ViewController,    public navParams: NavParams,
    public loadingCtrl: LoadingController ,public dataProvider : DataProvider) {
    this.accion =  this.navParams.get('accion');

    if (this.accion == 'Modificacion'){
      this.legajo =  this.navParams.get('legajo');
      this.nombre_apellido =  this.navParams.get('nombre');
      this.email =  this.navParams.get('email');
      this.clave =  this.navParams.get('clave');
    }else{
      this.legajo =  "";
      this.nombre_apellido =  "";
      this.email =  "";
      this.clave =  "";
    }

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ModalAbmDocentesPage');
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
    
            this.navCtrl.push(AbmProfesoresPage);
          } catch (error) {
            alert("Algo ha fallado, verifique su conexión a internet.");
          }      
        }
      }

}
