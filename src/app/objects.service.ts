import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HandleError, MyResponse } from './util';
import { Config } from './config';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ObjectsService {
    private registerURL : string = 'scenes/register';
    private getSceneURL : string = 'scenes/';
    constructor (private http: Http) {}
    getObjects(bucketKey: string) : Observable<Object[]>{
        let bucketURL = 'buckets/' + encodeURIComponent(bucketKey) + '/objects'
        return this.http.get(bucketURL)
                    .map(this.extractData)
                    .catch(HandleError);
    }
    private extractData(res: Response) {
        let body = res.json();
        return body || [];
    }

    deleteObject(token: string, bucketKey: string, objectKey: string) : Observable<MyResponse>{
        let h = new Headers();
        h.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: h });
        let url = Config.OSSURL + 'buckets/' + encodeURIComponent(bucketKey) + '/objects/' + encodeURIComponent(objectKey);
        return this.http.delete(url, options)
                .map(this.extractDeleteObjectData)
                .catch(HandleError);
    }

    private extractDeleteObjectData(res: Response){
        let r = new MyResponse();
        if ( res.status === 200 ){
            return r;
        }
        else{
            r.status = res.status;
            r.message = res.statusText;
        }
        return r;
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
    statusmsg: string;
    sceneId:   string;
    selected:  boolean;
}