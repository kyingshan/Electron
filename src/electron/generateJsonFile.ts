import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';
import { protocol } from 'electron';

interface VmessConfigData {
  add: string; 
  port: string; 
  id: string; 
  aid?: string; 
  scy?: string; 
  net?: string; 
  tls?: string; 
  type?: string; 
}

interface TrojanConfigData {
  address: string;
  port: number;
  password: string;
  params: {
    type?: string;
    security?: string;
    headerType?: string;
  };
}

interface VlessConfigData {
  address: string;
  port: number;
  uuid: string;
  params: {
    encryption?: string;
    flow?: string;
    type?: string;
    security?: string;
    headerType?: string;
  };
}

interface ShadowsocksConfigData {
  server: string;
  port: number;
  method: string;
  password: string;
}

export function saveConfigToFile(config: object, outputDir: string) {
  const outputPath = path.join(outputDir, 'output');
  const filePath = path.join(outputPath, `config.json`);

  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

  return filePath; 
}

export function generateConfig(
  protocol: string,
  configData: VmessConfigData | TrojanConfigData | VlessConfigData | ShadowsocksConfigData // why so many, can have a fixed structure mahh
): object {

  if (protocol === 'vmess') {
    const data = configData as VmessConfigData; 
    return {
      log: {
        access: '',
        error: '',
        loglevel: 'warning',
      },
      inbounds: [
        {
          tag: 'http',
          port: 20809,
          listen: '127.0.0.1',
          protocol: 'http',
          sniffing: {
            enabled: true,
            destOverride: ['http', 'tls'],
          },
          settings: {
            auth: 'noauth',
            udp: true,
            allowTransparent: false,
          },
        },
      ],
      outbounds: [
        {
          tag: 'proxy20809',
          protocol: 'vmess',
          settings: {
            vnext: [
              {
                address: data.add,
                port: Number(data.port),
                users: [
                  {
                    id: data.id,
                    alterId: Number(data.aid ?? 0),
                    security: data.scy ?? 'auto',
                  },
                ],
              },
            ],
          },
          streamSettings: {
            network: data.net ?? 'tcp',
            security: data.tls ?? 'none',
            [`${data.net ?? 'tcp'}Settings`]: {
              header: {
                type: data.type ?? 'none',
              },
            },
          },
          mux: {
            enabled: false,
            concurrency: -1,
          },
        },
        {
          tag: 'direct',
          protocol: 'freedom',
          settings: {},
        },
        {
          tag: 'block',
          protocol: 'blackhole',
          settings: {
            response: {
              type: 'http',
            },
          },
        },
      ],
      routing: {},
    };
  } else if (protocol === 'trojan') {
    const data = configData as TrojanConfigData;
    return {
      log: {
        access: '',
        error: '',
        loglevel: 'warning',
      },
      inbounds: [
        {
          tag: 'http',
          port: 20809,
          listen: '127.0.0.1',
          protocol: 'http',
          sniffing: {
            enabled: true,
            destOverride: ['http', 'tls'],
          },
          settings: {
            auth: 'noauth',
            udp: true,
            allowTransparent: false,
          },
        },
      ],
      outbounds: [
        {
          tag: 'proxy20809',
          protocol: 'trojan',
          settings: {
            servers: [
              {
                address: data.address,
                port: data.port,
                password: data.password,
              },
            ],
          },
          streamSettings: {
            network: data.params.type ?? 'tcp',
            security: data.params.security ?? 'none',
            [`${data.params.type ?? 'tcp'}Settings`]: {
              header: {
                type: data.params.headerType ?? 'none',
              },
            },
          },
          mux: {
            enabled: false,
            concurrency: -1,
          },
        },
        {
          tag: 'direct',
          protocol: 'freedom',
          settings: {},
        },
        {
          tag: 'block',
          protocol: 'blackhole',
          settings: {
            response: {
              type: 'http',
            },
          },
        },
      ],
      routing: {},
    };
  } else if (protocol === 'vless') {
    const data = configData as VlessConfigData;
    return {
      log: {
        access: '',
        error: '',
        loglevel: 'warning',
      },
      inbounds: [
        {
          tag: 'http',
          port: 20809,
          listen: '127.0.0.1',
          protocol: 'http',
          sniffing: {
            enabled: true,
            destOverride: ['http', 'tls'],
          },
          settings: {
            auth: 'noauth',
            udp: true,
            allowTransparent: false,
          },
        },
      ],
      outbounds: [
        {
          tag: 'proxy20809',
          protocol: 'vless',
          settings: {
            vnext: [
              {
                address: data.address,
                port: data.port,
                users: [
                  {
                    id: data.uuid,
                    encryption: data.params.encryption ?? 'none',
                    flow: data.params.flow ?? '',
                  },
                ],
              },
            ],
          },
          streamSettings: {
            network: data.params.type ?? 'tcp',
            security: data.params.security ?? 'none',
            [`${data.params.type ?? 'tcp'}Settings`]: {
              header: {
                type: data.params.headerType ?? 'none',
              },
            },
          },
          mux: {
            enabled: false,
            concurrency: -1,
          },
        },
        {
          tag: 'direct',
          protocol: 'freedom',
          settings: {},
        },
        {
          tag: 'block',
          protocol: 'blackhole',
          settings: {
            response: {
              type: 'http',
            },
          },
        },
      ],
      routing: {},
    };
  } else if (protocol === 'shadowsocks') {
    const data = configData as ShadowsocksConfigData;
    return {
      log: {
        access: '',
        error: '',
        loglevel: 'warning',
      },
      inbounds: [
        {
          tag: 'http',
          port: 20809,
          listen: '127.0.0.1',
          protocol: 'http',
          sniffing: {
            enabled: true,
            destOverride: ['http', 'tls'],
          },
          settings: {
            auth: 'noauth',
            udp: true,
            allowTransparent: false,
          },
        },
      ],
      outbounds: [
        {
          tag: 'proxy20809',
          protocol: 'shadowsocks',
          settings: {
            servers: [
              {
                address: data.server,
                port: data.port,
                method: data.method,
                password: data.password,
                level: 1,
                ota: false,
              },
            ],
          },
          streamSettings: {
            network: 'tcp',
            security: 'none',
          },
          mux: {
            enabled: false,
            concurrency: -1,
          },
        },
        {
          tag: 'direct',
          protocol: 'freedom',
          settings: {},
        },
        {
          tag: 'block',
          protocol: 'blackhole',
          settings: {
            response: {
              type: 'http',
            },
          },
        },
      ],
      routing: {},
    };
  } else {
    throw new Error('Unsupported protocol');
    // show a pop up
  }
}