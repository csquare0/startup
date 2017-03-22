import * as config from "./config";
import * as Q from "q";
import * as request from "request";
import * as express from "express";

var token: string;
var expiretime: number;
var starttime : number;

export function route() : express.Router {
    let router = express.Router();
    router.get('/', function (req: express.Request, res: express.Response, next) {
        authentication().then(function (token: IToken) {
            res.send(token.token);
        });
    });
    return router;
}

export function authentication() : Q.Promise<IToken> {
    let deferred = Q.defer<IToken>();

    let payload = [ `client_id=${config.getConfig().CLIENT_ID}`,
                    `client_secret=${config.getConfig().CLIENT_SECRET}`,
                    'grant_type=client_credentials',
                    `scope=${encodeURIComponent('bucket:read bucket:create data:read data:write')}`];
    let payloadStr = payload.join('&');
    request.post({
            url: config.getAuthURL(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:   payloadStr
        }, function (error, response, body) {
            if (error) {
                console.log(error);
                deferred.reject("error");
            }
            try {
                let result = JSON.parse(body);
                token = result.access_token;
                expiretime = result.expires_in;
                starttime = Date.now()/1000;
                let tokeninfo = {
                    token: token,
                    expire_in: expiretime
                }
                deferred.resolve(tokeninfo);
            } catch (error) {
                console.log(error);
                deferred.reject("error");
            }
        });
    return deferred.promise;
}

export interface IToken {
    token: string;
    expire_in: number;
}