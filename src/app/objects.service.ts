import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ObjectsService {
    private bucketKey : string = ''; 
    private bucketURL : string = '';
    private registerURL : string = 'scenes/register';
    private getSceneURL : string = 'scenes/';
    constructor (private http: Http) {}
    getObjects(bucketKey: string) : Observable<Object[]>{
        this.bucketKey = bucketKey;
        this.bucketURL = 'buckets/' + bucketKey + '/objects'
        return this.http.get(this.bucketURL)
                    .map(this.extractData);
    }
    private extractData(res: Response) {
        let body = res.json();
        return body || [];
    }

    registerScene(objURN: string) : Observable<string>{
        let payload = {objurn: objURN};
        return this.http.post(this.registerURL,payload).map((res:Response)=>{
            let body = res.json();
            if (body.sceneId===undefined)
            {
                return "error";
            }
            return body.sceneId;
        });
    }

    getSceneStatus(sceneId: string) : Observable<any>{
        var getStatusURL = this.getSceneURL + sceneId;
        return this.http.get(getStatusURL).map((res:Response)=>{
            let body = res.json();
            return body;
        });
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
    sceneId:   string;
}