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

export interface IBucket {
    bucketKey: number;
    createDate: string;
    policyKey: string;
}