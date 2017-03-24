import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BucketsService, Bucket } from './buckets.service';
import { ObjectsService, Object } from './objects.service';
import { ViewsService, View } from './views.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-buckets',
  templateUrl: './buckets.component.html',
  styleUrls: ['./buckets.component.css'],
  providers: [BucketsService, ObjectsService, ViewsService, AuthService]
})

export class BucketsComponent implements OnInit {
  buckets : Bucket [] = [];
  objects : Object [] = [];
  views:   View [] = [];
  isLoading = true;
  curBucketKey : string = '';
  showObjectsPanel : boolean = false;
  newBucketName : string = '';
  showViewsPanel: boolean = false;
  curSceneId : string = '';
  selectedObjects = {};

  constructor(private bucketsService: BucketsService,
              private objectsService: ObjectsService,
              private viewsService: ViewsService,
              private authService: AuthService) { }

  ngOnInit() {
      this.getBuckets();
  }

  getBuckets() {
    this.bucketsService.getBuckets().subscribe(
      buckets => {this.buckets = buckets; this.isLoading=false;}
    );
  }

  addBucket(bucketKey: string) {
    this.authService.getToken().subscribe((token)=>{
      this.bucketsService.addBucket(token, bucketKey).subscribe(res=>{
        if(res.status === undefined || res.status!==0){
          console.log(res.message || res);
        }
        else{
          this.reloadObjects();
        }
      });
    });
  }

  deleteBucket(bucketKey: string){

  }

  showObjects(bucketKey:string){
    if(bucketKey===this.curBucketKey)
    {
      this.showObjectsPanel = !this.showObjectsPanel;
    }
    else
    {
      this.showObjectsPanel = true;
      this.curBucketKey = bucketKey;
      this.objects = [];
      this.getObjects(this.curBucketKey);  
    }
    if (this.showObjectsPanel === false){
      this.showViewsPanel = false;
    }
  }

  reloadObjects() {
    this.objects = [];
    this.getObjects(this.curBucketKey);
  }
  getObjects(bucketKey:string) {
    this.curBucketKey = bucketKey;
    this.showObjectsPanel = true;
    this.objectsService.getObjects(this.curBucketKey).subscribe(
            objects => {
              this.objects = objects;
              this.objects.forEach(element => {
                element.status = 0;
              });
            }
        );
    this.selectedObjects = {};
    this.views = [];
  }

  checkObject(object: Object){
    object.selected = !!!object.selected;
  }

  deleteObjectsLoop(token:string, objects: Object[]){
    if (objects.length===0){
      return;
    }
    this.objectsService.deleteObject(token,this.curBucketKey,objects.pop().objectKey).subscribe((res)=>{
      if(res.status === undefined || res.status!==0){
        console.log(res.message || res);
      }
      if(objects.length===0){
        this.reloadObjects();
      }
      else{
        this.deleteObjectsLoop(token,objects);
      }
    });
  }

  deleteObjects(){
    let selectedIndex = 0;
    this.authService.getToken().subscribe((token)=>{
      let selected : Object[] = [];
      this.objects.forEach(o=>{if(o.selected){selected.push(o);}});
      this.deleteObjectsLoop(token,selected);
    });
  }
  registerScene(obj: Object) {
    obj.status = 1;
    this.objectsService.registerScene(obj.objectId).subscribe(
        regRes => {
          if(regRes!=='error'){
            obj.sceneId = regRes;
            let self: BucketsComponent = this;
            setTimeout(function(){ self.monitor(obj,self); }, 2000);
          }
          else{
            obj.status = 3;
            obj.statusmsg = 'Translation Error!';
          }
        }
    );
  }

  monitor(obj: Object, self: BucketsComponent) {
    self.objectsService.getSceneStatus(obj.sceneId).subscribe(
      resobj => {
        if( resobj.error === undefined ){
          obj.statusmsg = resobj.status;
          if(resobj.status==='success'){
            obj.status = 2;
          }
          else if(resobj.status==='error'){
            obj.status = 3;
          }
          else{
            setTimeout(function(){ self.monitor(obj, self); }, 2000);
          }
        }
        else{
          obj.status = 3;
          obj.statusmsg = resobj.error;
        }
      }
    );
  }

  showViews(obj: Object){
    if(this.curSceneId !== obj.sceneId){
      this.curSceneId = obj.sceneId;
      this.showViewsPanel = true;
      this.getViews(this.curSceneId);
    }
    else{
      this.showViewsPanel = !this.showViewsPanel;
    }
  }

  getViews(sceneId: string){
    this.authService.getToken().subscribe((token)=>{
      this.viewsService.getViews(token,this.curSceneId).subscribe((views)=>{
        this.views = views;
      });
    });
  }

  renderScene(view: View) {
    this.authService.getToken().subscribe((token)=>{
      view.status = 1;
      this.viewsService.render(token,this.curSceneId,view.viewname,view.camname).subscribe((res)=>{
        if(res.error!==undefined){
          view.status = 3;
          view.statusmsg = res.error;
        }
        else
        {
            view.renderId = res.renderId;
            let self: BucketsComponent = this;
            setTimeout(function(){ self.monitorRender(self.curSceneId, view,self); }, 2000);
        }
      });
    });
  }

  monitorRender(sceneId: string, view: View, self: BucketsComponent) {
    this.authService.getToken().subscribe((token)=>{
      self.viewsService.getRender(token, sceneId, view.renderId).subscribe(
        resobj => {
          if (resobj.error !== undefined ){
            view.status = 3;
            view.statusmsg = resobj.error;
          }
          else{
            view.statusmsg = resobj.status;
            if(resobj.status==='success'){
              view.status = 2;
              view.urn = resobj.urn;
            }
            else if(resobj.status==='error'){
              view.status = 3;
            }
            else{
              setTimeout(function(){ self.monitorRender(sceneId, view, self); }, 2000);
            }
          }
        }
      );
    });
  }
}
