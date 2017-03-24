import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HandleError } from './util';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class BucketsService {
    private bucketsListUrl = 'buckets/list';  // URL to web API
    private bucketKey = '';

    constructor (private http: Http) {}
    getBuckets() : Observable<Bucket[]>{
        return this.http.get(this.bucketsListUrl)
                    .map(this.extractData)
                    .catch(HandleError);
    }
    
    getObjects(bucketKey: string) : Observable<Object[]>{
        this.bucketKey = bucketKey;
        var bucketURL:string = 'buckets/' + bucketKey + '/objects'
        return this.http.get(bucketURL)
                    .map(this.extractData)
                    .catch(HandleError);
    }

    private extractData(res: Response) {
      let body = res.json();
      return body || [];
    }

}

export class Bucket {
    bucketKey : string;
    createdDate : string;
    policyKey: string;
    loaded:    boolean;
    objects:   Object [];
}
