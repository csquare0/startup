import * as express from "express";
import * as http from "http";
import * as request from "request";
import * as Q from "q";
import * as config from "./config";
import * as auth from "./auth";

export function route() : express.Router {
    let router = express.Router();
    router.get('/list', function (req: express.Request, res: express.Response, next) {
        auth.authentication().then(function (token: auth.IToken) {
            getBuckets(token.token)
            .then(function(buckets: IBucket[]){
                res.json(buckets);
            }, function(error){
                res.sendStatus(400);
            });
        });
    });
    router.get('/:bucketKey/objects', function (req: express.Request, res: express.Response, next) {
        auth.authentication().then(function (token: auth.IToken) {
            getObjects(token.token, req.params.bucketKey)
            .then(function(objects: IObject[]){
                res.json(objects);
            }, function(error){
                res.sendStatus(400);
            });
        });
    });

    router.get('/:bucketKey/objects/:objectName', function (req: express.Request, res: express.Response, next) {
        auth.authentication().then(function (token: auth.IToken) {
            deleteObject(token.token, req.params.bucketKey, req.params.objectName)
            .then(function(code : number){
                res.sendStatus(code);
            }, function(code : number){
                res.sendStatus(code);
            });
        });
    });
    return router;
}

function getBuckets(token:string) : Q.Promise<IBucket[]> {
    let deferred = Q.defer<IBucket[]>();

    request.get({
        url: config.getBucketURL(),
        headers: {'Authorization': 'Bearer '+ token}
   },function (error, response, body) {
        if (error) {
            console.log(error);
            deferred.reject(error);
        }
        try {
            let resobj = JSON.parse(body);
            let bucketList = resobj.items;
            for(let i in bucketList){
                let a : number = bucketList[i].createdDate;
                bucketList[i].createdDate = new Date(a).toString();
            }
            deferred.resolve(bucketList);
        } catch (error) {
            console.log(error);
            deferred.reject(error);
        }
    });

    return deferred.promise;
}

function getObjects(token:string, bucketKey:string) : Q.Promise<IObject[]> {
    let deferred = Q.defer<IObject[]>();
    let objectUrl = config.getBucketURL() + '/' + bucketKey + '/objects';
    request.get({
        url: objectUrl,
        headers: {'Authorization': 'Bearer '+ token}
   },function (error, response, body) {
        if (error) {
            console.log(error);
            deferred.reject(error);
        }
        try {
            let resobj = JSON.parse(body);
            let objectList = resobj.items;
            deferred.resolve(objectList);
        } catch (error) {
            console.log(error);
            deferred.reject(error);
        }
    });

    return deferred.promise;
}

function deleteObject(token:string, bucketKey:string, objectName:string) : Q.Promise<number>{
    let deferred = Q.defer<number>();
    let objectUrl = config.getBucketURL() + '/' + bucketKey + '/objects/' + objectName;
    request.delete({
        url: objectUrl,
        headers: {'Authorization': 'Bearer '+ token}
   },function (error, response, body) {
        if (error) {
            console.log(error);
            deferred.reject(response.statusCode);
        }
        try {
            deferred.resolve(response.statusCode);
        } catch (error) {
            console.log(error);
            deferred.reject(500);
        }
    });

    return deferred.promise;
}
export interface IBucket {
    bucketKey: string;
    createDate: string;
    policyKey: string;
}

export interface IObject {
    bucketKey: string;
    objectKey: string;
    objectId:  string;
    sha1:      string;
    size:      number;
    location:  string;
}