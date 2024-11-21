/**
 * From jiunkoon anothertesting.py
 * Not finalized yet, still got bugs (eg: shadowsocks no address shown)
 */

interface LinkParsed {
    password: string;
    address: string;
    port: number;
    params: Record<string, string>;
    remarks: string;
  }

export function detectLinkType(link: string) {
    if (link.startsWith('vmess://')) return 'vmess';
    if (link.startsWith('trojan://')) return 'trojan';
    if (link.startsWith('vless://')) return 'vless';
    if (link.startsWith('ss://')) return 'shadowsocks';
    return null;
}

export function parseVlessLink(link: string) {
    try {
        const parsedUrl = new URL(link);

        let uuid: string;
        let netloc: string;
    
        if (parsedUrl.username && parsedUrl.hostname) {
            uuid = parsedUrl.username;
            netloc = parsedUrl.hostname + (parsedUrl.port ? `:${parsedUrl.port}` : '');
        } else {
            uuid = parsedUrl.hostname;
            netloc = '';
        }

        let address: string;
        let oldport: string;
        let port: number;
    
        if (netloc.includes(':')) {
            [address, oldport] = netloc.split(':');
            port = parseInt(oldport, 10);
        } else {
            address = netloc;
            port = 443;
        }

        const params: Record<string, string> = {};
        parsedUrl.searchParams.forEach((value, key) => {
            params[key] = value;
        });

        const remarks: string = parsedUrl.hash ? decodeURIComponent(parsedUrl.hash.slice(1)) : '';
    
        return { uuid, address, port, params, remarks};
        
        } catch (error: any) {
        console.error('Error parsing Trojan link:', error.message);
        return null;
    }
}

export function parseSsLink(link: string) {
    const mainPart = link.slice(5).split('#')[0];
    const decoded = Buffer.from(mainPart, 'base64').toString('utf8');
    const [methodPassword, addressPort] = decoded.split('@');
    const [method, password] = methodPassword.split(':');
    const [address, port] = addressPort.split(':');
    return { method, password, address, port: parseInt(port, 10) };
}

export function parseVmessLink(link: string) {
    const encodedConfig = link.slice(8);
    const decodedConfig = Buffer.from(encodedConfig, 'base64').toString('utf8');
    return JSON.parse(decodedConfig);
}
  
export function parseTrojanLink(link: string) {
    try {
        const parsedUrl = new URL(link);
    
        let password: string;
        let netloc: string;
    
        if (parsedUrl.username && parsedUrl.hostname) {
            password = parsedUrl.username;
            netloc = parsedUrl.hostname + (parsedUrl.port ? `:${parsedUrl.port}` : '');
        } else {
            password = parsedUrl.hostname;
            netloc = '';
        }

        let address: string;
        let oldport: string;
        let port: number;
    
        if (netloc.includes(':')) {
            [address, oldport] = netloc.split(':');
            port = parseInt(oldport, 10);
        } else {
            address = netloc;
            port = 443;
        }

        const params: Record<string, string> = {};
        parsedUrl.searchParams.forEach((value, key) => {
            params[key] = value;
        });

        const remarks: string = parsedUrl.hash ? decodeURIComponent(parsedUrl.hash.slice(1)) : '';
    
        return { password, address, port, params, remarks};

        } catch (error: any) {
        console.error('Error parsing Trojan link:', error.message);
        return null;
    }
  }