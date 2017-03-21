import * as express from "express";
import * as http from "http";
import * as request from "request";
import * as Q from "q";
import * as config from "./config";
import * as auth from "./auth";

export function route() : express.Router {
    let router = express.Router();
    router.post('/register', function (req: express.Request, res: express.Response, next) {
        auth.authentication().then(function (token: auth.IToken) {
            let urn = req.body.objurn;
            registerObject(token.token,urn)
            .then(function(sceneId: string){
                res.send(sceneId);
            }, function(error){
                res.sendStatus(500);
            });
        });
    });

    router.get('/:sceneId', function (req: express.Request, res: express.Response, next) {
        auth.authentication().then(function (token: auth.IToken) {
            getSceneStatus(token.token,req.params.sceneId)
            .then(function(getSceneRes:any){
                res.send(getSceneRes);
            }, function(error){
                res.sendStatus(500);
            });
        });
    });
    return router;
}


function registerObject(token:string, objectURN:string) : Q.Promise<string> {
    let deferred = Q.defer<string>();
    let registerUrl = config.getRenderURL() + '/scenes';
    let payload =  { 'source' : objectURN };
    console.log(JSON.stringify(payload));
    request.post({
        url: registerUrl,
        headers: {'Authorization': `Bearer ${token}`,
                  'Content-Type'  : 'application/json'},
        body: JSON.stringify(payload)
   },function (error, response, body) {
        if (error) {
            console.log(error);
            deferred.reject(error);
        }
        try {
            deferred.resolve(body);
        } catch (error) {
            console.log(error);
            deferred.reject(error);
        }
    });

    return deferred.promise;
}

function getSceneStatus(token:string, sceneId:string) : Q.Promise<object> {
    let deferred = Q.defer<object>();
    let getSceneUrl = config.getRenderURL() + '/scenes/' + sceneId;
    request.get({
        url: getSceneUrl,
        headers: {'Authorization': 'Bearer '+ token}
   },function (error, response, body) {
        if (error) {
            console.log(error);
            deferred.reject(error);
        }
        try {
            let resobj = JSON.parse(body);
            let sceneId = resobj.sceneId;
            let res = {};
            if (sceneId!==undefined && resobj.status!==undefined){
                res['status'] = resobj.status;
            }
            else{
                res['error'] = resobj.error;
            }
            deferred.resolve(res); 
        }catch (error) {
            console.log(error);
            deferred.reject(error);
        }
    });

    return deferred.promise;
}
