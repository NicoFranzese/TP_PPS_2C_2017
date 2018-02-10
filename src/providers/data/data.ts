import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { LoadingController } from 'ionic-angular';
import { GlobalFxProvider } from '../../providers/global-fx/global-fx';

@Injectable()
export class DataProvider {

  private DBalumnos = this.db.list('alumnos');
  private item: Observable<any>;
  private items: Observable<any[]>;
  private itemsAux: any[] ;
  private obsDB = new Subject();
  
  constructor(private db: AngularFireDatabase ,public loadingCtrl: LoadingController,private gFx: GlobalFxProvider) {
  }

  public setItem(votacion) {
    // this.items.push(votacion);
  }
  
  public getItems(entityName) {
    this.items = this.db.list(entityName).valueChanges();
    return this.items;
  }


  public getItem(path) {
    // retorna un solo item
    this.item = this.db.list(path).valueChanges();
    return this.item;
  }

  //MÈTODO PARA DAR DE ALTA y MODIFICACIÒN
  //entityName: nombre de la entidad del json de firebase
  //object: objeto a insertar en el json de firebase
  public addItem(entityName, object)
  {
    this.db.database.ref(entityName).set(object);
  }//end addItem()

  public addItemPromise(entityName, object)
  {
   return  this.db.database.ref(entityName).set(object);
  }//end addItem()

  public pushItem(entityName,object){
    this.db.database.ref(entityName).push(object);
  }


    //El path puede ser por ejemplo:
  //'cuestionarios/1'
  //'cuestionaris'/arrRespuestas/2
  public deleteItem(path)
  {
    this.db.database.ref(path).remove();
  }


  //El entityName puede ser por ejemplo:
  //'cuestionarios/'
  //'cuestionarios/arrRespuestas'
  public deleteItemByDocket(entityName, docket)
  {

    // recupero la tabla actual 
    this.getItems(entityName).subscribe(
      datos => {
        
            this.itemsAux =  datos;
            // elimino el item en cuestion de mi array
            this.itemsAux.splice(docket,1);
            // borro la tabla entera
            this.db.database.ref(entityName).remove();
  
            //subo mi array aux sin el item que queria eliminar
            for (let i=0;i<this.itemsAux.length;i++){  
                this.addItemPromise( entityName + "/" + i ,this.itemsAux[i]).then(
                  ()=> this.waitItemAdded(entityName + "/" + i),
                  () => console.error("error"),
                );          
            }
  
     
        },
      error => console.error(error),
      () => console.log("ok")
    );
     
  }//end deleteItem()


  public updateItem(path,item)
  {
    this.db.database.ref(path).update(item);
  }//end updateItem()
  

  // funcion que valida la existencia de un item en firebase.
  public waitItemAdded(itemPath){
    let i : number = 0;
    while(i < 10) { 
      this.getItem(itemPath).subscribe(
        datos => {
          this.item =  datos;
          if(this.item != null){
            i = 11;
            }else{
              this.gFx.delay(500);
              i++;
            }   
          },
        error => console.error(error),
        () => console.log("ok")
      );  
    }//end while
  }//end waitItemAdded


}
