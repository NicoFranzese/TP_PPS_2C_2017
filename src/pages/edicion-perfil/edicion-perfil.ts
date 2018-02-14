import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController ,LoadingController, Platform} from 'ionic-angular';
import { LocalNotifications }       from '@ionic-native/local-notifications';
import { DataProvider }             from '../../providers/data/data';
import { GlobalFxProvider }         from '../../providers/global-fx/global-fx';
import { PrincipalPage }            from '../principal/principal';
import { AlmacenDatosProvider } from '../../providers/almacen-datos/almacen-datos';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';


/**
 * Generated class for the EdicionPerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 declare var $;

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
  public tipo_entidad;
  public id_persona;
  public id_usuario;
  public foto;

  public ultimoIDEntidadesPersona;
  public arrEntidadesPersona;
  public ultimoIDUsuarios;
  public arrUsuarios;
  public arrImages;
  public items;
  public itemsUsuarios; 
  public selectedImage;
  public arrAvisos;


  //Traducciones
  public traduccionTitulo;
  public traduccionLegajo;
  public traduccionNomYApe;
  public traduccionEmail;
  public traduccionClave;
  public traduccionAceptar;

  constructor(public navCtrl: NavController,    
              private viewCtrl: ViewController,    
              public navParams: NavParams,
              public loadingCtrl: LoadingController ,
              public dataProvider : DataProvider,
              private gFx: GlobalFxProvider,
              public  platform: Platform,
              public  localNoti: LocalNotifications,
              private almacenDatos: AlmacenDatosProvider) {

        console.clear();

        //Si aún no se presionó ningún lenguaje, se setea por defecto Español
        if ((localStorage.getItem("Lenguaje") == "") || (localStorage.getItem("Lenguaje") == null) || (localStorage.getItem("Lenguaje") == undefined)){
          localStorage.setItem("Lenguaje", "Es");
        }
        //Le paso el lenguaje que se presionó en sesiones anteriores dentro de la APP
        this.traducir(localStorage.getItem("Lenguaje"));

        this.obtenerAvisos();

        this.legajo =  this.navParams.get('legajo');
        this.nombre_apellido = this.navParams.get('nombre');
        this.tipo_entidad = this.navParams.get('tipo_entidad');  
        this.id_persona = this.navParams.get('id_persona');
        this.id_usuario = this.navParams.get('id_usuario');

        this.getItemsEntidadesPersonas();
        this.getItemsUsuarios();
        this.getFotos();  

        $("#carouselExampleControls").carousel('pause')
  }

  @ViewChild(Slides) slides: Slides;

  ionViewDidLoad() {
    this.slides.update();
    // console.log('ionViewDidLoad ModalAbmDocentesPage');
  }
  
  goToSlide(slideNumber) {
    this.slides.slideTo(slideNumber, 500);
  }

  slideChanged() {
    let slideIndex = this.slides.getActiveIndex(); 
    if (slideIndex > this.arrImages.length- 1){
      this.selectedImage =this.arrImages.length - 1;
    }else{
      this.selectedImage = slideIndex;
    }
      
  }

  getFotos()  {
     // configuro spinner para mientras se cargan los datos 
     const loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    loading.present();

    //recupero los datos, mientras muestra spinner
    this.dataProvider.getItems("fotoPerfil/"+this.legajo).subscribe(
      datos => {      
        this.arrImages = datos[0];
        this.selectedImage = 0;        
        console.info("arrImages",this.arrImages);
        setTimeout(() => {
          loading.dismiss();
        }, 3000);

      },
      error => console.error(error),
      () => console.log("ok")
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

  openCamera(){

    // data es el base64 de la foto
    this.gFx.getPhoto().subscribe(
      data => {
      
          if(data.length >1){
            this.arrImages.push(data);
            this.goToSlide(this.arrImages.length -1);
            this.dataProvider.updateItem('fotoPerfil/'+ this.legajo+'/arrFotos',this.arrImages);
          }
          
      }
    );

  }

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
            'id_persona' : this.id_persona,
            'legajo': this.legajo,
            'nombre_apellido': this.nombre_apellido,
            'tipo_entidad': this.tipo_entidad
          };        
          
          let objUsu = 
          {
            'id_usuario': this.id_usuario,
            'legajo': this.legajo,
            'email': this.email,
            'clave': this.clave
          };   

          let ObjImag =
          {
            posicion: this.selectedImage
          }
          
      
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


          this.dataProvider.updateItem('fotoPerfil/'+this.legajo+'/fotoElegida/',ObjImag);
         

          this.almacenDatos.usuarioLogueado.email = this.email;
          this.almacenDatos.usuarioLogueado.clave = this.clave;
          this.almacenDatos.usuarioLogueado.nombre = this.nombre_apellido;
                   

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
  }//Aceptar()

  close(){
      this.navCtrl.push(PrincipalPage).then(() => {
        // first we find the index of the current view controller:
        const index = this.viewCtrl.index;
        // then we remove it from the navigation stack
        this.navCtrl.remove(index);
      });
  }//close()
  
  test(){
    console.log("ok");
  }
  
  obtenerAvisos(){
        this.dataProvider.getItems('avisos_importancia').subscribe(
          data => 
          {
            // this.arrPersonas = data;
    
            if(data == undefined)
            {
              // alert("No existen personas cargadas en la BD");
            }
            else
            {
              this.arrAvisos = data;
    
              for (let i=0;i<this.arrAvisos.length;i++){ 
                let legajo = this.arrAvisos[i].legajo;
                if ((legajo < localStorage.getItem("legajoLogueado").toString()) || 
                    (legajo > localStorage.getItem("legajoLogueado").toString())){
                    }else{
                      this.platform.ready().then(() => {
                        this.localNoti.schedule({
                          title: 'Alerta de Gestión Académica!',
                          text: this.arrAvisos[i].mensaje,
                          at: new Date(new Date().getTime() + 3600),
                          led: 'FF0000',
                          icon:'', //ruta del icono
                          sound: 'assets/sonidos/notificacion.mp3' //Ruta del archivo de sonido
                        });
                      //Elimino aviso para que no vuelva a enviarlo.
                        // this.dataProvider.deleteItem('avisos_importancia/'+this.arrAvisos[i].id);
                      });
                    }
              }
    
              for (let i=0;i<this.arrAvisos.length;i++){ 
                let legajo = this.arrAvisos[i].legajo;
                if ((legajo < localStorage.getItem("legajoLogueado").toString()) || 
                    (legajo > localStorage.getItem("legajoLogueado").toString())){
                      
                    }else{
                      this.platform.ready().then(() => {
                      //Elimino aviso para que no vuelva a enviarlo.
                        this.dataProvider.deleteItem('avisos_importancia/'+this.arrAvisos[i].id);
                      });
                    }
              }
            }
            // console.log(this.arrAvisos);
          },
          err => console.log(err)
        );
  }//obtenerAvisos()

  //Método que traduce objetos de la pagina 
  traducir(lenguaje){    

      //Según lenguaje seleccionado se traducen los objetos.
      if(lenguaje == 'Es'){
        this.traduccionTitulo = "Editar perfil del usuario";
        this.traduccionLegajo ="Legajo";
        this.traduccionNomYApe ="Nombre y Ap.";
        this.traduccionEmail = "eMail";
        this.traduccionClave = "Clave";
        this.traduccionAceptar = "Aceptar";

      }else if(lenguaje == 'Usa'){
        this.traduccionTitulo = "Edit user profile";
        this.traduccionLegajo ="File";
        this.traduccionNomYApe ="Name and surname";
        this.traduccionEmail = "e-mail";
        this.traduccionClave = "Key";
        this.traduccionAceptar = "To accept";
      }else if(lenguaje == 'Br'){
        this.traduccionTitulo = "Editar perfil de usuário";
        this.traduccionLegajo ="Arquivo";
        this.traduccionNomYApe ="Nome e sobrenome";
        this.traduccionEmail = "eMail";
        this.traduccionClave = "Chave";
        this.traduccionAceptar = "Aceitar";
      }
  
  }//traducir()




}//end Class
