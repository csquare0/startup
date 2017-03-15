
var config : any;

export function getConfig(){
    if (config===undefined){
        config = require("./config.json");
    }
    return config;
}

export function getBucketURL() : string {
    let c = getConfig();
    return c.BASE_URL + c.BUCKET_URL;
}

export function getAuthURL() : string {
    let c = getConfig();
    return c.BASE_URL + c.AUTH_URL;
}

export function getDerivativeURL() : string {
    let c = getConfig();
    return c.BASE_URL + c.DERIVATIVE_URL;
}

export function getRenderURL() : string {
    let c = getConfig();
    return c.BASE_URL + c.RENDER_URL;
}
