import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

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
                    .catch(this.handleError);
    }
    
    getObjects(bucketKey: string) : Observable<Object[]>{
        this.bucketKey = bucketKey;
        var bucketURL:string = 'buckets/' + bucketKey + '/objects'
        return this.http.get(bucketURL)
                    .map(this.extractData)
                    .catch(this.handleError);
    }

    private extractData(res: Response) {
      let body = res.json();
      return body || [];
    }
    
    private handleError (error: Response | any) {
      let errMsg: string;
      if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      } else {
        errMsg = error.message ? error.message : error.toString();
      }
      console.error(errMsg);
      return Observable.throw(errMsg);
    }
}

export class Bucket {
    bucketKey : string;
    createdDate : string;
    policyKey: string
}
