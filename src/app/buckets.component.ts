import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BucketsService, Bucket} from './buckets.service';
@Component({
  selector: 'app-buckets',
  templateUrl: './buckets.component.html',
  styleUrls: ['./buckets.component.css']
})
export class BucketsComponent implements OnInit {

  buckets : Bucket [] = [];
  isLoading = true;

  constructor(private bucketsService: BucketsService) { }

  ngOnInit() {
      this.getBuckets();
  }

  getBuckets() {
    this.bucketsService.getBuckets().subscribe(
      data => {this.buckets = data; this.isLoading=true;},
      err => console.log(err),
      () => console.log('getBuckets complete')
    );
  }
}