"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base64url_1 = require("base64url");
function decodeVmessLink(link) {
    // Split the link at the first occurrence of "://"
    var _a = link.split('://'), protocol = _a[0], base64String = _a[1];
    var decodedString = atob(base64String);
    var newString = base64url_1.default.decode(base64String);
    console.log(JSON.parse(newString));
    console.log("------------------------");
    var _b = JSON.parse(decodedString), add = _b.add, aid = _b.aid, id = _b.id, net = _b.net, port = _b.port, ps = _b.ps, scy = _b.scy, tls = _b.tls, type = _b.type, v = _b.v;
    return { ps: ps, protocol: protocol, add: add, port: port };
}
// Example usage
var vmessLink = "vmess://eyJhZGQiOiAiMTM5LjE4MC4xMzIuMTMxIiwgImFpZCI6ICIwIiwgImlkIjogIjQxZDMxNGQzLWY3YjgtMzhmZS1hM2IxLTRlYzYwMDEwY2NkYiIsICJuZXQiOiAidGNwIiwgInBvcnQiOiAyMDg2LCAicHMiOiAiXHVkODNkXHVkZTgwIE1hcnogKGFkbWluKSBbVk1lc3MgLSB0Y3BdIiwgInNjeSI6ICJhdXRvIiwgInRscyI6ICJub25lIiwgInR5cGUiOiAiaHR0cCIsICJ2IjogIjIifQ==";
console.log(decodeVmessLink(vmessLink));
// vmess://eyJhZGQiOiAiMTM5LjE4MC4xMzIuMTMxIiwgImFpZCI6ICIwIiwgImlkIjogIjQxZDMxNGQzLWY3YjgtMzhmZS1hM2IxLTRlYzYwMDEwY2NkYiIsICJuZXQiOiAidGNwIiwgInBvcnQiOiAyMDg2LCAicHMiOiAiXHVkODNkXHVkZTgwIE1hcnogKGFkbWluKSBbVk1lc3MgLSB0Y3BdIiwgInNjeSI6ICJhdXRvIiwgInRscyI6ICJub25lIiwgInR5cGUiOiAiaHR0cCIsICJ2IjogIjIifQ==
// {
//     add: '139.180.132.131',
//     aid: '0',
//     id: '41d314d3-f7b8-38fe-a3b1-4ec60010ccdb',
//     net: 'tcp',
//     port: 2086,
//     ps: ' Marz (admin) [VMess - tcp]',
//     scy: 'auto',
//     tls: 'none',
//     type: 'http',
//     v: '2'
//   }
/**
add: Server address (139.180.132.131)
port: Server port (2086)
id: UUID for authentication (41d314d3-f7b8-38fe-a3b1-4ec60010ccdb)
net: Network type (tcp)
ps: Description or name of the connection
tls: TLS settings (none or tls)
 */
function decodeVlessLink(link) {
    var _a = link.split('://'), protocol = _a[0], rest = _a[1];
    // Split the rest by '@' to get the UUID and host:port
    var _b = rest.split('?'), uuidAndHost = _b[0], params = _b[1];
    // Split UUID and host:port
    var _c = uuidAndHost.split('@'), uuid = _c[0], hostAndPort = _c[1];
    var _d = hostAndPort.split(':'), host = _d[0], port = _d[1];
    // Parse the query parameters
    var queryParams = new URLSearchParams(params.split('#')[0]); // Remove the hash part
    var security = queryParams.get('security');
    var type = queryParams.get('type');
    var headerType = queryParams.get('headerType');
    // Decode the hash part (URL-encoded)
    var hash = decodeURIComponent(params.split('#')[1]);
    // Save the prefix and the decoded information
    // return { protocol,uuid,host,port,security,type,headerType,hash};
    return { hash: hash, protocol: protocol, host: host, port: port };
}
var vlessLink = "vless://41d314d3-f7b8-38fe-a3b1-4ec60010ccdb@139.180.132.131:2088?security=none&type=tcp&headerType=http#%F0%9F%9A%80%20Marz%20%28admin%29%20%5BVLESS%20-%20tcp%5D";
console.log(decodeVlessLink(vlessLink));
/*
{
  protocol: 'vless',
  uuid: '41d314d3-f7b8-38fe-a3b1-4ec60010ccdb',
  host: '139.180.132.131',
  port: '2088',
  security: 'none',
  type: 'tcp',
  headerType: 'http',
  hash: ' Marz (admin) [VLESS - tcp]'
}
*/
function decodeShadowsocksLink(link) {
    var _a = link.split('://'), protocol = _a[0], rest = _a[1];
    var _b = rest.split('#'), base64Data = _b[0], hash = _b[1];
    var decodedData = atob(base64Data);
    var _c = decodedData.split('@'), methodPassword = _c[0], hostAndPort = _c[1];
    var _d = methodPassword.split(':'), method = _d[0], password = _d[1];
    var _e = hostAndPort.split(':'), host = _e[0], port = _e[1];
    var description = hash ? decodeURIComponent(hash) : null;
    // return { protocol, method, password, host, port, description };
    return { description: description, protocol: protocol, host: host, port: port };
}
var ssLink = "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTo0MWQzMTRkM2Y3YjgzOGZlYTNiMTRlYzYwMDEwY2NkYkAxMzkuMTgwLjEzMi4xMzE6MjA4Nw==#%F0%9F%9A%80%20Marz%20%28admin%29%20%5BShadowsocks%20-%20tcp%5D";
console.log(decodeShadowsocksLink(ssLink));
/**
{
  protocol: 'ss',
  method: 'chacha20-ietf-poly1305',
  password: '41d314d3f7b838fea3b14ec60010ccdb',
  host: '139.180.132.131',
  port: '2087',
  description: 'Marz (admin) [Shadowsocks - tcp]'
}
 */
function decodeTrojanLink(link) {
    var _a = link.split('://'), protocol = _a[0], rest = _a[1];
    // Split the rest by '@' to get the UUID and host:port
    var _b = rest.split('?'), uuidAndHost = _b[0], params = _b[1];
    // Split UUID and host:port
    var _c = uuidAndHost.split('@'), uuid = _c[0], hostAndPort = _c[1];
    var _d = hostAndPort.split(':'), host = _d[0], port = _d[1];
    // Parse the query parameters
    var queryParams = new URLSearchParams(params.split('#')[0]); // Remove the hash part
    var security = queryParams.get('security');
    var type = queryParams.get('type');
    var headerType = queryParams.get('headerType');
    // Decode the hash part (URL-encoded)
    var hash = decodeURIComponent(params.split('#')[1]);
    // Save the prefix and the decoded information
    return { protocol: protocol, uuid: uuid, host: host, port: port, security: security, type: type, headerType: headerType, hash: hash };
    // return { hash, protocol, host, port };
}
var trojanLink = "trojan://41d314d3f7b838fea3b14ec60010ccdb@139.180.132.131:2089?security=none&type=tcp&headerType=http#%F0%9F%9A%80%20Marz%20%28admin%29%20%5BTrojan%20-%20tcp%5D";
console.log(decodeVlessLink(trojanLink));
