import base64url from 'base64url';

function decodeVmessLink(link: string) {
    // Split the link at the first occurrence of "://"
    const [protocol, base64String] = link.split('://');
    const decodedString = atob(base64String);
    // const newString = base64url.decode(base64String)
    // console.log(JSON.parse(newString));
    // console.log("------------------------")
    const { add, aid, id, net, port, ps, scy, tls, type, v } = JSON.parse(decodedString);
  
    return { ps, protocol, add, port };
  }

// Example usage
const vmessLink = "vmess://eyJhZGQiOiAiMTM5LjE4MC4xMzIuMTMxIiwgImFpZCI6ICIwIiwgImlkIjogIjQxZDMxNGQzLWY3YjgtMzhmZS1hM2IxLTRlYzYwMDEwY2NkYiIsICJuZXQiOiAidGNwIiwgInBvcnQiOiAyMDg2LCAicHMiOiAiXHVkODNkXHVkZTgwIE1hcnogKGFkbWluKSBbVk1lc3MgLSB0Y3BdIiwgInNjeSI6ICJhdXRvIiwgInRscyI6ICJub25lIiwgInR5cGUiOiAiaHR0cCIsICJ2IjogIjIifQ==";
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

function decodeVlessLink(link: string) {

    const [protocol, rest] = link.split('://');
    // Split the rest by '@' to get the UUID and host:port
    const [uuidAndHost, params] = rest.split('?');
    // Split UUID and host:port
    const [uuid, hostAndPort] = uuidAndHost.split('@');
    const [host, port] = hostAndPort.split(':');
    // Parse the query parameters
    const queryParams = new URLSearchParams(params.split('#')[0]); // Remove the hash part
    const security = queryParams.get('security');
    const type = queryParams.get('type');
    const headerType = queryParams.get('headerType');
    // Decode the hash part (URL-encoded)
    const hash = decodeURIComponent(params.split('#')[1]);
  
    // Save the prefix and the decoded information
    // return { protocol,uuid,host,port,security,type,headerType,hash};
    return { hash, protocol, host, port };
  }

const vlessLink = "vless://41d314d3-f7b8-38fe-a3b1-4ec60010ccdb@139.180.132.131:2088?security=none&type=tcp&headerType=http#%F0%9F%9A%80%20Marz%20%28admin%29%20%5BVLESS%20-%20tcp%5D";
console.log(decodeVlessLink(vlessLink))

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


function decodeShadowsocksLink(link: string) {

    const [protocol, rest] = link.split('://');
    const [base64Data, hash] = rest.split('#');
    const decodedData = atob(base64Data); 
    const [methodPassword, hostAndPort] = decodedData.split('@');
    const [method, password] = methodPassword.split(':');
    const [host, port] = hostAndPort.split(':');
    const description = hash ? decodeURIComponent(hash) : null;
  
    // return { protocol, method, password, host, port, description };
    return { description, protocol, host, port };
  }

const ssLink = "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTo0MWQzMTRkM2Y3YjgzOGZlYTNiMTRlYzYwMDEwY2NkYkAxMzkuMTgwLjEzMi4xMzE6MjA4Nw==#%F0%9F%9A%80%20Marz%20%28admin%29%20%5BShadowsocks%20-%20tcp%5D"
console.log(decodeShadowsocksLink(ssLink))
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

function decodeTrojanLink(link: string) {
  const [protocol, rest] = link.split('://');
  // Split the rest by '@' to get the UUID and host:port
  const [uuidAndHost, params] = rest.split('?');
  // Split UUID and host:port
  const [uuid, hostAndPort] = uuidAndHost.split('@');
  const [host, port] = hostAndPort.split(':');
  // Parse the query parameters
  const queryParams = new URLSearchParams(params.split('#')[0]); // Remove the hash part
  const security = queryParams.get('security');
  const type = queryParams.get('type');
  const headerType = queryParams.get('headerType');
  // Decode the hash part (URL-encoded)
  const hash = decodeURIComponent(params.split('#')[1]);

  // Save the prefix and the decoded information
  return { protocol,uuid,host,port,security,type,headerType,hash};
  // return { hash, protocol, host, port };
  }

const trojanLink = "trojan://41d314d3f7b838fea3b14ec60010ccdb@139.180.132.131:2089?security=none&type=tcp&headerType=http#%F0%9F%9A%80%20Marz%20%28admin%29%20%5BTrojan%20-%20tcp%5D"
console.log(decodeVlessLink(trojanLink))