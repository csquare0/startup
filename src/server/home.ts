import * as express from "express";
import * as path from "path";

export function route() : express.Router {
    let router = express.Router();
    router.get('/', function (req: express.Request, res: express.Response, next) {
        res.sendFile(path.resolve(__dirname+'/../../dist/index.html'));
    });
    return router;
}