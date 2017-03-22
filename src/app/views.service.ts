import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from './config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as _ from 'underscore';

@Injectable()
export class ViewsService {
    constructor (private http: Http) {}

    getViews(token: string, sceneId: string) : Observable<View[]>{
        let h = new Headers();
        h.append('Authorization', 'Bearer ' + token);
        let url = Config.GetSceneURL + sceneId;
        return this.http.get(url, {headers: h}).map(this.extractData);
    }
    
    render(token: string, sceneId: string, viewname: string, camname: string) : Observable<any>{
        let h = new Headers();
        h.append('Authorization', 'Bearer ' + token);
        h.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: h });
        let url = Config.GetSceneURL + sceneId + '/renders';
        let payload = {view: viewname,
                       camera: camname};
        return this.http.post(url, payload, options).map(this.extractRenderData);
    }

    getRender(token: string, sceneId: string, renderId: string) : Observable<any> {
        let h = new Headers();
        h.append('Authorization', 'Bearer ' + token);
        let options = new RequestOptions({ headers: h });
        let url = Config.GetSceneURL + sceneId + '/renders/' + renderId;
        return this.http.get(url, options).map(this.extractRenderStatusData);
    }

    extractRenderStatusData(res: Response){
        let body = res.json();
        if ( res.status !== 200 ){
            return {error: body.error};
        }
        else{
            if ( body.info.status !== 'success' ){
                return {status: body.info.status};
            }
            let urn = body.info.children.map((child)=>{
                if(child.role==='image'){
                    return child.urn;
                }
            });
            urn = _.compact(urn)[0];
            let retBody = {status: body.info.status,
                           urn:    urn};
            return retBody;
        }
    }
    extractRenderData(res: Response){
        let body = res.json();
        if ( res.status !== 201 ){
            return {error: body.error};
        }
        else{
            return {renderId: body.renderId};
        }
    }
    extractData(res: Response) {
        let body = res.json();
        if (body.views===undefined){
            return [];
        }
        return _.flatten(body.views.map((view)=>{
            if (view.cameras===undefined){
                return [];
            }
            return view.cameras.map((camera)=>{
                let oneViewCam = new View();
                oneViewCam.viewname = view.name;
                oneViewCam.camname = camera;
                oneViewCam.status = 0;
                return oneViewCam;
            });
        }));
    }
}

export class View {
    viewname:  string;
    camname:   string;
    renderId:  string;
    status:    number;
    urn:       string;
    statusmsg: string;
}