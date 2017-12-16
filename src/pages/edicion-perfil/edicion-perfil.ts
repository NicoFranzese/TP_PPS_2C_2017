import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController ,LoadingController} from 'ionic-angular';
import { DataProvider }             from '../../providers/data/data';
import { GlobalFxProvider }         from '../../providers/global-fx/global-fx';
import { PrincipalPage }            from '../principal/principal';


/**
 * Generated class for the EdicionPerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edicion-perfil',
  templateUrl: 'edicion-perfil.html',
})
export class EdicionPerfilPage {

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

  constructor(public navCtrl: NavController,    
              private viewCtrl: ViewController,    
              public navParams: NavParams,
              public loadingCtrl: LoadingController ,
              public dataProvider : DataProvider,
              private gFx: GlobalFxProvider) {

    this.obtenerUltimoIDEntidadesPersona();
    this.obtenerUltimoIDUsuarios();
    this.getItemsEntidadesPersonas();
    this.getItemsUsuarios();

    this.legajo =  this.navParams.get('legajo');
    this.nombre_apellido = this.navParams.get('nombre');
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
      },
      err => console.error(err)
    );
  }

  getItemsEntidadesPersonas() {
    // configuro spinner para mientras se cargan los datos 
    const loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    loading.present();

    //recupero los datos, mientras muestra spinner
    this.dataProvider.getItems("entidades_persona").subscribe(
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

  getItemsUsuarios() {
    // configuro spinner para mientras se cargan los datos 
    const loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    loading.present();

    //recupero los datos, mientras muestra spinner
    this.dataProvider.getItems("usuarios").subscribe(
      datos => {      
        this.itemsUsuarios = datos;

        setTimeout(() => {
          loading.dismiss();
        }, 3000);

      },
      error => console.error(error),
      () => console.log("ok")
    );
  }

  Aceptar(){
    
        if((this.legajo == null) || (this.legajo == undefined) || (this.legajo == "") ||
          (this.nombre_apellido == null) || (this.nombre_apellido == undefined) || (this.nombre_apellido == "") ||
        (this.email == null) || (this.email == undefined) || (this.email == "") ||
          (this.clave == null) || (this.clave == undefined) || (this.clave == "")){

             this.gFx.presentToast("Hay campos incompletos");
      
        }else{
          try {

            for (let i=0;i<this.items.length;i++){ 
              if (this.items[i].legajo==this.legajo) {
                this.dataProvider.deleteItem('entidades_persona/'+i);
              }
            }
        
            for (let i=0;i<this.itemsUsuarios.length;i++){ 
              if (this.itemsUsuarios[i].legajo==this.legajo) {
                this.dataProvider.deleteItem('usuarios/'+i);
              }
            }

            
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
    
            this.gFx.presentToast("Se ha guardado con éxito")

            this.navCtrl.push(PrincipalPage);
          } catch (error) {
            this.gFx.presentToast("Error de conexión.")
          }      
        }
      }

}
