import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class BucketsService {
    constructor (private http: Http) {}
    getBuckets(): Observable<Bucket[]> {
        return this.http.get("./buckets/list").map((res:Response)=>res.json());
    }
}

export class Bucket {
  bucketKey: string;
  createDate: string;
  policyKey: string;
}