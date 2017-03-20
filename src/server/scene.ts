import * as express from "express";
import * as http from "http";
import * as request from "request";
import * as Q from "q";
import * as config from "./config";
import * as auth from "./auth";

export function route() : express.Router {
    let router = express.Router();
    router.post('/register/:objurn', function (req: express.Request, res: express.Response, next) {
        auth.authentication().then(function (token: auth.IToken) {
            registerObject(token.token,req.params.objurn)
            .then(function(sceneId: string){
                res.send(sceneId);
            }, function(error){
                res.sendStatus(400);
            });
        });
    });
    return router;
}


function registerObject(token:string, objectURN:string) : Q.Promise<string> {
    let deferred = Q.defer<string>();
    let registerUrl = config.getRenderURL() + '/scenes';
    let payload =  { "source" : objectURN};
    request.post({
        url: registerUrl,
        headers: {'Authorization': 'Bearer '+ token},
        data: JSON.stringify(payload)
   },function (error, response, body) {
        if (error) {
            console.log(error);
            deferred.reject(error);
        }
        try {
            let resobj = JSON.parse(body);
            let sceneId = resobj.sceneId;
            deferred.resolve(sceneId);
        } catch (error) {
            console.log(error);
            deferred.reject(error);
        }
    });

    return deferred.promise;
}

function getSceneStatus(token:string, sceneId:string) : Q.Promise<string> {
    let deferred = Q.defer<string>();
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
            deferred.resolve(sceneId);
        } catch (error) {
            console.log(error);
            deferred.reject(error);
        }
    });

    return deferred.promise;
}
