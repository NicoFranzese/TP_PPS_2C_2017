import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController ,LoadingController} from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { AbmAlumnosPage } from '../abm-alumnos/abm-alumnos';
import { GlobalFxProvider } from '../../providers/global-fx/global-fx';

/**
 * Generated class for the ModalAbmAlumnosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-abm-alumnos',
  templateUrl: 'modal-abm-alumnos.html',
})
export class ModalAbmAlumnosPage {

  public accion;
  public legajo;
  public nombre_apellido;
  public email;
  public clave;
  public tipo_entidad = "alumno";

  public ultimoIDEntidadesPersona;
  public arrEntidadesPersona;

  public ultimoIDUsuarios;
  public arrUsuarios;

  public items;
  public itemsUsuarios; 

  //traduccciones
  public traduccionTitulo;
  public traduccionLegajo;
  public traduccionNomYApe;
  public traduccionEmail;
  public traduccionClave;
  public traduccionAceptar;
  
  constructor(public navCtrl    : NavController,     private viewCtrl: ViewController,    public navParams: NavParams,
    public loadingCtrl: LoadingController ,public dataProvider : DataProvider,           private gFx: GlobalFxProvider) {
      //Si aún no se presionó ningún lenguaje, se setea por defecto Español
      if ((localStorage.getItem("Lenguaje") == "") || (localStorage.getItem("Lenguaje") == null) || (localStorage.getItem("Lenguaje") == undefined)){
        localStorage.setItem("Lenguaje", "Es");
      }
      //Le paso el lenguaje que se presionó en sesiones anteriores dentro de la APP
      this.traducir(localStorage.getItem("Lenguaje"));

      this.obtenerUltimoIDEntidadesPersona();
      this.obtenerUltimoIDUsuarios();
      this.getItemsEntidadesPersonas();
      this.getItemsUsuarios();

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

  //Método que traduce objetos de la pagina 
  traducir(lenguaje){    
    //Según lenguaje seleccionado se traducen los objetos.
    if(lenguaje == 'Es'){
      this.traduccionLegajo = "Legajo";
      this.traduccionNomYApe = "Nombre y Apellido";
      this.traduccionEmail = "Email";
      this.traduccionClave = "Clave";
      this.traduccionAceptar = "Aceptar";
      this.traduccionTitulo = "Alumno";
    }else if(lenguaje == 'Usa'){
      this.traduccionLegajo = "File";
      this.traduccionNomYApe = "Name and surname";
      this.traduccionEmail = "E-mail";
      this.traduccionClave = "Password";
      this.traduccionAceptar = "Accept";
      this.traduccionTitulo = "Student";
    }else if(lenguaje == 'Br'){
      this.traduccionLegajo = "Arquivo";
      this.traduccionNomYApe = "Nome e sobrenome";
      this.traduccionEmail = "E-mail";
      this.traduccionClave = "senha";
      this.traduccionAceptar = "Aceitar";
      this.traduccionTitulo = "Estudante";
    }

    console.log(lenguaje);
    console.log(this.traduccionTitulo);
    console.log(this.traduccionAceptar);
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

  // Alta o modificación
  Aceptar(){
    
        // this.obtenerUltimoIDEntidadesPersona();
        // this.obtenerUltimoIDUsuarios();
    
        if((this.legajo == null) || (this.legajo == undefined) || (this.legajo == "") ||
          (this.nombre_apellido == null) || (this.nombre_apellido == undefined) || (this.nombre_apellido == "") ||
        (this.email == null) || (this.email == undefined) || (this.email == "") ||
          (this.clave == null) || (this.clave == undefined) || (this.clave == "")){
            this.gFx.presentToast("Hay campos incompletos.");
        }else{
          try {

            
            let obj = 
            {
              'legajo': this.legajo,
              'nombre_apellido': this.nombre_apellido,
              'tipo_entidad': this.tipo_entidad
            };        
           
      
            let objUsu = 
            {
              'legajo': this.legajo,
              'email': this.email,
              'clave': this.clave
            };                

            if (this.accion=="Alta"){
              this.dataProvider.addItem('entidades_persona/' +  this.ultimoIDEntidadesPersona, obj);
              this.dataProvider.addItem('fotoPerfil/'+ this.legajo+'/arrFotos/',{"0": "./assets/img/anonimo.jpg"});
              this.dataProvider.addItem('fotoPerfil/'+ this.legajo+'/fotoLeida/',{"posicion": 0});
              this.dataProvider.addItem('usuarios/' +  this.ultimoIDUsuarios, objUsu);  
            }else{ //Modificacion
              for (let i=0;i<this.items.length;i++){ 
                if (this.items[i].legajo==this.legajo) {
                  // this.dataProvider.deleteItem('entidades_persona/'+i);
                  this.dataProvider.updateItem('entidades_persona/'+i,obj);
                }
              }
          
              for (let i=0;i<this.itemsUsuarios.length;i++){ 
                if (this.itemsUsuarios[i].legajo==this.legajo) {
                  // this.dataProvider.deleteItem('usuarios/'+i);
                  this.dataProvider.updateItem('usuarios/'+i,objUsu);
                }
              }
            }
           
            //limpio los input
            this.legajo="";
            this.nombre_apellido="";
            this.email="";
            this.clave="";
    
            
            this.gFx.presentToast("Guardado correctamente");
    
            //regreso al form padre
            this.close();
          

          } catch (error) {
            this.gFx.presentToast(error);
            
          }      
        }
      }

      close(){
        this.navCtrl.push(AbmAlumnosPage).then(() => {
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
