import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';


import { AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';


@Injectable()
export class GlobalFxProvider {

  private subjectFoto = new BehaviorSubject("");
  // public obsFoto = this.subjectFoto.asObservable();
  public loader;


  constructor(public http: Http,
              private alertCtrl: AlertController,
              private camera: Camera,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController) {
  
  }


  public getPhoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.subjectFoto.next('data:image/jpeg;base64,' + imageData);
    }, (err) => {
     // Handle error
    });
    return this.subjectFoto.asObservable();
    
  }//getPhoto

  //toast customizable
  public presentToast(msj) {
    let toast = this.toastCtrl.create({
      message: msj,
      duration: 3000
    });
    toast.present();
  }

  public presentLoading(msj) {
    let loader = this.loadingCtrl.create({
      content: msj,
      duration: 3000
    });
    this.loader.present();
  }

  //alert customizable
  public  presentConfirm(title,msj): boolean {
    let result : boolean;
    let alert = this.alertCtrl.create({
      title: title,
      message: msj,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            result = false;
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
           result = true;
          }
        }
      ]
    });
    alert.present();
    return result;
  }



}
