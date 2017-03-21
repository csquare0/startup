import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BucketsService, Bucket } from './buckets.service';
import { ObjectsService, Object } from './objects.service';
import { ViewsService, View } from './views.service';

@Component({
  selector: 'app-buckets',
  templateUrl: './buckets.component.html',
  styleUrls: ['./buckets.component.css'],
  providers: [BucketsService, ObjectsService]
})
export class BucketsComponent implements OnInit {
  buckets : Bucket [] = [];
  objects: Object [] = [];
  views:   String [] = [];
  isLoading = true;
  curBucketKey : string = '';
  showObjectsPanel : boolean = false;
  newBucketName : string = '';
  showViewsPanel: boolean = false;
  curSceneId : string = '';

  constructor(private bucketsService: BucketsService,
              private objectsService: ObjectsService) { }

  ngOnInit() {
      this.getBuckets();
  }

  getBuckets() {
    this.bucketsService.getBuckets().subscribe(
      buckets => {this.buckets = buckets; this.isLoading=false;}
    );
  }

  addBucket() {

  }

  deleteBucket(){

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
  }

  registerScene(obj: Object) {
    obj.status = 1;
    this.objectsService.registerScene(obj.objectId).subscribe(
        regRes => {
          if(regRes!=='error'){
            obj.sceneId = regRes;
            setInterval(function(){ this.monitor(obj); }, 2000);
            this.monitor(obj);
          }
          else{
            obj.status = 3;
          }
        }
    );
  }

  monitor(obj: Object) {
    this.objectsService.getSceneStatus(obj.sceneId).subscribe(
      resobj => {
        if( resobj.error === undefined ){
          if(resobj.status==='success'){
            obj.status = 2;
          }
          else if(resobj.status==='error'){
            resobj.status = 3;
          }
          else{
            setInterval(function(){ this.monitor(obj); }, 2000);
          }
        }
        else{
          obj.status = 3;
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
      this.showViewsPanel = false;
    }
  }

  getViews(sceneId: string){
    this.views = [];
  }

  renderScene(view: View) {

  }
}
