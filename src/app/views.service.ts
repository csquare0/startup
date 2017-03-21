import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from './config';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ViewsService {
    constructor (private http: Http,
                 private authService: AuthService) {}

    getViews(sceneId: string) : Observable<View[]>{
        let url = Config.GetSceneURL + sceneId;
        return this.http.get(url).map(this.extractData);
    }
    
    extractData(res: Response) {
        return [];
    }
    
}

export class View {
    name:      string;
    renderId:  string;
    status:    number;
    result:    string;
    errormsg:  string;
}