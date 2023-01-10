import Hashids from 'hashids/cjs';
let hashids = new Hashids("", 6);

export const decodeHashIds= (text) => {
    let id = hashids.decode(text);

    let joinId = id.join(",");
    return joinId;
}

export const encodeHashIds = (text) => {
    let id = hashids.encode(text);
    return id;
}