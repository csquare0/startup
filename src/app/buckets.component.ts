import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-buckets',
  templateUrl: './buckets.component.html',
  styleUrls: ['./buckets.component.css']
})
export class BucketsComponent implements OnInit {

  buckets = [];
  isLoading = true;

  constructor(private http: Http) { }

  ngOnInit() {
      this.getBuckets();
  }

  getBuckets() {
    this.buckets.push(["Bucket1","Bucket2"]);
    this.isLoading = false;
  }
}