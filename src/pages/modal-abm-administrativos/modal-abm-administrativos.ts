import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController ,LoadingController} from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { AbmAdministrativosPage } from '../abm-administrativos/abm-administrativos';
import { GlobalFxProvider } from '../../providers/global-fx/global-fx';

/**
 * Generated class for the ModalAbmAdministrativosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-abm-administrativos',
  templateUrl: 'modal-abm-administrativos.html',
})
export class ModalAbmAdministrativosPage {

  public accion;
  public legajo;
  public nombre_apellido;
  public email;
  public clave;
  public tipo_entidad = "administrativo";
  public id_persona ;
  public id_usuario;

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
    public loadingCtrl: LoadingController ,public dataProvider : DataProvider, private gFx: GlobalFxProvider) {
      //Si aún no se presionó ningún lenguaje, se setea por defecto Español
      if ((localStorage.getItem("Lenguaje") == "") || (localStorage.getItem("Lenguaje") == null) || (localStorage.getItem("Lenguaje") == undefined)){
        localStorage.setItem("Lenguaje", "Es");
      }
      //Le paso el lenguaje que se presionó en sesiones anteriores dentro de la APP
      this.traducir(localStorage.getItem("Lenguaje"));
      this.accion =  this.navParams.get('accion');

      if (this.accion == 'Modificacion'){
        this.legajo =  this.navParams.get('legajo');
        this.nombre_apellido =  this.navParams.get('nombre');
        this.email =  this.navParams.get('email');
        this.clave =  this.navParams.get('clave');
        this.id_persona = this.navParams.get('id_persona');
        this.id_usuario = this.navParams.get('id_usuario');
      }else{
        this.legajo =  "";
        this.nombre_apellido =  "";
        this.email =  "";
        this.clave =  "";
      }

      this.getItemsEntidadesPersonas();
      this.getItemsUsuarios();  


  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ModalAbmAdministrativosPage');
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
        this.traduccionTitulo = "Administrativo";
    }else if(lenguaje == 'Usa'){
      this.traduccionLegajo = "File";
      this.traduccionNomYApe = "Name and surname";
      this.traduccionEmail = "E-mail";
      this.traduccionClave = "Password";
      this.traduccionAceptar = "Accept";
        this.traduccionTitulo = "Administrative";
    }else if(lenguaje == 'Br'){
      this.traduccionLegajo = "Arquivo";
      this.traduccionNomYApe = "Nome e sobrenome";
      this.traduccionEmail = "E-mail";
      this.traduccionClave = "senha";
      this.traduccionAceptar = "Aceitar";
        this.traduccionTitulo = "Administrativo";
    }

    // console.log("Lenguaje= "+ lenguaje);

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
        // obtengo el último ID 
        if(this.items.length == 0)        {
          this.ultimoIDEntidadesPersona = 1;
        }else{
          this.ultimoIDEntidadesPersona= this.items[this.items.length-1].id_persona;
        }
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
           // obtengo el último ID 
        if(this.itemsUsuarios.length == 0){
          this.ultimoIDUsuarios = 1;
        }else{
          this.ultimoIDUsuarios= this.itemsUsuarios[this.itemsUsuarios.length-1].id_usuario;
        }
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
    

        if((this.legajo == null) || (this.legajo == undefined) || (this.legajo == "") ||
          (this.nombre_apellido == null) || (this.nombre_apellido == undefined) || (this.nombre_apellido == "") ||
        (this.email == null) || (this.email == undefined) || (this.email == "") ||
          (this.clave == null) || (this.clave == undefined) || (this.clave == "")){
            this.gFx.presentToast("Hay campos incompletos.");
        }else{
          try {

            
            let obj = 
            {
              // si es un alta genero id nuevo, sino utilizo el recibido por navParam
              'id_persona' : this.accion=="Alta"?(Number(this.ultimoIDEntidadesPersona) + 1) : this.id_persona,
              'legajo': this.legajo,
              'nombre_apellido': this.nombre_apellido,
              'tipo_entidad': this.tipo_entidad
            };        
            
            let objUsu = 
            {
               // si es un alta genero id nuevo, sino utilizo el recibido por navParam
              'id_usuario': this.accion == "Alta"? (Number(this.ultimoIDUsuarios)+1):this.id_usuario,
              'legajo': this.legajo,
              'email': this.email,
              'clave': this.clave
            };   
            
            if (this.accion=="Alta"){
    

              this.dataProvider.addItem('entidades_persona/' +  (Number(this.ultimoIDEntidadesPersona) + 1), obj);
              this.dataProvider.addItem('fotoPerfil/'+ this.legajo+'/arrFotos/',{"0": "./assets/img/anonimo.jpg"});
              this.dataProvider.addItem('fotoPerfil/'+ this.legajo+'/fotoLeida/',{"posicion": 0});
              this.dataProvider.addItem('usuarios/' +  (Number(this.ultimoIDUsuarios)+1), objUsu);  
            }else{ //Modificacion 

              for (let i=0;i<this.items.length;i++){ 
                if (this.items[i].legajo==this.legajo) {
                  this.dataProvider.updateItem('entidades_persona/'+this.items[i].id_persona,obj);
                }
              }
          
              for (let i=0;i<this.itemsUsuarios.length;i++){ 
                if (this.itemsUsuarios[i].legajo==this.legajo) {
                   this.dataProvider.updateItem('usuarios/'+this.itemsUsuarios[i].id_usuario,objUsu);
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
        this.navCtrl.push(AbmAdministrativosPage).then(() => {
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
