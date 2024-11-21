import { useState } from 'react';

interface ImportLinkProps {
  onClose: () => void;
  onSubmit: (link: string) => void;
}

export default function ImportLink({ onClose, onSubmit }: ImportLinkProps) {
  const [link, setLink] = useState('');

  const handleSubmit = async () => {
    if (link) {
      onSubmit(link);
      // @ts-ignore
      const response = await window.electron.generateConfig(link); 
      console.log('Generated config saved to:', response); 
      onClose(); // Close the popup
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Import Link</h2>
        <input
          type="text"
          placeholder="Enter link here"
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
