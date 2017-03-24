
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

export function HandleError (error: Response | any) {
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

export class MyResponse{
    status:  number;
    message: string;
    data:    any;

    constructor (){
        this.status = 0;
        this.message = '';
        this.data = null;
    }

    constructor (d){
        this.status = 0;
        this.message = '';
        this.data = null;
    }
}