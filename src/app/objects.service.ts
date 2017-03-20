import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ObjectsService {
    private bucketKey : string = ''; 

    constructor (private http: Http) {}
    getObjects(bucketKey: string) : Observable<Object[]>{
        this.bucketKey = bucketKey;
        var bucketURL:string = 'buckets/' + bucketKey + '/objects'
        return this.http.get(bucketURL)
                    .map(this.extractData);
    }
    private extractData(res: Response) {
        let body = res.json();
        return body || [];
    }
}

export class Object {
    bucketKey: string;
    objectKey: string;
    objectId:  string;
    sha1:      string;
    size:      number;
    location:  string;
    status:    number;
}