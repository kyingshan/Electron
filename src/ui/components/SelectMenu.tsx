import ImportLink from './ImportLink';
import { useState } from 'react';

// Define types for the JSON structure
interface VNext {
    address: string;
    port: number;
    password: string;
  }

  interface Servers {
    address: string;
    port: number;
  }

  // interface Settings {
  //   vnext?: VNext[];
  //   servers?: Servers[]
  // }
  
  interface TcpSettings {
    header: {
      type: string;
    };
  }
  
  interface StreamSettings {
    network: string;
    security: string;
    tcpSettings: TcpSettings;
  }
  


interface Row {
    link: string;
    tag: string;
    protocol: string;
    address: string | undefined;
    port: number | undefined;
    network: string;
    security: string;
    type: string;
}
  

function flattenData(link: string, generatedConfig: any){

  const outbound = generatedConfig.outbounds[0]
  const tag = outbound.tag;
  const protocol = outbound.protocol;

  let settingDetails;
  switch (protocol) {
    case 'trojan':
      settingDetails = (outbound.settings.servers as Servers[])[0];
      break;
    case 'vmess':
      settingDetails = (outbound.settings.vnext as VNext[])[0];
      break;
    case 'vless':
      settingDetails = (outbound.settings.vnext as VNext[])[0];
      break;
    case 'shadowsocks':
      settingDetails = (outbound.settings.servers as Servers[])[0];
      break;
    default:
      settingDetails = {}
      // more
  }

  const address = settingDetails.address
  const port = settingDetails.port
  const network = (outbound.streamSettings as StreamSettings).network
  const security = (outbound.streamSettings as StreamSettings).security
  const type = (outbound.streamSettings as StreamSettings).tcpSettings.header.type

  const flattenedOutbound = { link, tag, protocol, address, port, network, security, type };

  return flattenedOutbound;
}

export default function SelectMenu() {


  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null); // Track the selected row index
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  const handleImportLink = async (link: string) => {
    try {
      // @ts-ignore
      const savedPath = await window.electron.generateConfig(link);
      // const savedPath = './dist-electron/output/config.json'
      console.log("Can reach directory")

      // @ts-ignore
      const generatedConfig = await window.electron.readConfig(savedPath); // Assuming a readConfig function exists in your Electron backend

      // Extract necessary properties from the generatedConfig
      const newOutbound = flattenData(link, generatedConfig)

      // Update rows wi
      setRows((prevRows) => {
        if (prevRows.length === 0) return [newOutbound]

        // which makes the thing unique?? --> protocol and port
        const exists = prevRows.some((row) => row.protocol === newOutbound.protocol && row.port === newOutbound.port);

        if (exists) return prevRows;
        return [...prevRows, newOutbound];
      });

    } catch (error) {
      console.error('Error processing configuration:', error);
    }
  };

  const handleRowClick  = (row: Row, index: number) => {
    setSelectedRowIndex(index);
    selectServer(row.link);
    // saveConfigToFile(row.generateConfig)
  };

  const selectServer = async (link: string) => {
    try {
      // @ts-ignore
      // const savedPath = await window.electron.generateConfig(link);
      const savedPath = './dist-electron/output/output/config_shadowsocks.json'

      // @ts-ignore
      const generatedConfig = await window.electron.readConfig(savedPath); // Assuming a readConfig function exists in your Electron backend

    } catch (error) {
      console.error('Error processing configuration:', error);
    }
  }

  const handleDeleteRow = (rowIndex: number) => {
    setRows((prevRows) => prevRows.filter((_, index) => index !== rowIndex));
  };


  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-500">
              {
                columns.slice(1).map((column) => (
                  <th
                    key={column}
                    className="text-left py-3 px-4 text-slate-100 font-semibold"
                  >
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </th>
                ))
              }
              {/* Add a header for the Actions column */}
              {columns.length !== 0 && (
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold"></th>
                )
              }
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                // className="hover:bg-zinc-300"
                className={`hover:bg-zinc-300 ${
                  selectedRowIndex === rowIndex ? 'bg-blue-200' : ''
                }`}
                onClick={() => handleRowClick(row, rowIndex)}
              >  
              {columns.slice(1).map((column) => (
                <td key={column} className="py-3 px-4">
                  {(row as Record<string, any>)[column]}
                </td>
              ))}

                <td className="py-3 px-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering row click
                      handleDeleteRow(rowIndex);
                    }}
                    className="w-5 h-5 flex items-center justify-center bg-zinc-600 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
    title="Delete"
                  >
                    <span className="text-sm font-bold">✕</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >Add</button>
      </div>
      {isPopupOpen && (
        <ImportLink
          onClose={() => setIsPopupOpen(false)}
          onSubmit={handleImportLink}
        />
      )}
    </div>
  );
}