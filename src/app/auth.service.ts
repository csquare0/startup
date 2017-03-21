import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from './config';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService {
    constructor (private http: Http) {}

    getToken() : Promise<string>{
        let url = './auth';
        return this.http.get(url).map(this.extractData).toPromise();
    }

    extractData(res: Response) {
        return res.toString();
    }
    
}