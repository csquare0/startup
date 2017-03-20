import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BucketsService, Bucket } from './buckets.service';
import { ObjectsService, Object } from './objects.service';

@Component({
  selector: 'app-buckets',
  templateUrl: './buckets.component.html',
  styleUrls: ['./buckets.component.css'],
  providers: [BucketsService, ObjectsService]
})
export class BucketsComponent implements OnInit {
  buckets : Bucket [] = [];
  objects: Object [] = [];
  isLoading = true;
  curBucketKey : string = '';
  showObjectsPanel : boolean = false;
  newBucketName : string = '';

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

  register(object: Object) {
    object.status = 1;
  }

  render(object: Object) {

  }
}
