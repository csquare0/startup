import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HandleError } from './util';
import { Config } from './config';
import { MyResponse } from './util';

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
    

    addBucket(token: string, bucketKey: string) : Observable<MyResponse>{
        let h = new Headers();
        h.append('Authorization', 'Bearer ' + token);
        h.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: h });
        let url = Config.OSSURL + 'buckets';
        let payload = {
          bucketKey:bucketKey,
          policyKey:"transient"
        };
        return this.http.post(url, payload, options)
                .map(this.extractAddBucketData)
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

    private extractAddBucketData(res: Response){
        let r = new MyResponse();
        if ( res.status === 200 ){
            return r;
        }
        else{
            r.status = res.status;
            r.message = res.json().reason;
        }
        return r;
    }

}

export class Bucket {
    bucketKey : string;
    createdDate : string;
    policyKey: string;
    loaded:    boolean;
    objects:   Object [];
}
