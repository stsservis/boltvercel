import React, { useRef } from 'react';
import { DownloadIcon, UploadIcon, DatabaseIcon, CheckCircleIcon } from 'lucide-react';

interface BackupProps {
  onExportData: () => void;
  onImportData: (file: File) => void;
  servicesCount: number;
  notesCount: number;
}

const Backup: React.FC<BackupProps> = ({ onExportData, onImportData, servicesCount, notesCount }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportData(file);
    }
  };

  return (
    <div className="px-2 pt-2 pb-3 space-y-2">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-1.5">
        <div className="bg-blue-50 rounded-md p-2.5 border border-blue-200 min-h-[60px]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium text-blue-700 leading-tight">Toplam Servis</h3>
              <p className="text-sm font-bold text-blue-900">{servicesCount}</p>
            </div>
            <DatabaseIcon className="h-3.5 w-3.5 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-md p-2.5 border border-green-200 min-h-[60px]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium text-green-700 leading-tight">Toplam Not</h3>
              <p className="text-sm font-bold text-green-900">{notesCount}</p>
            </div>
            <CheckCircleIcon className="h-3.5 w-3.5 text-green-600" />
          </div>
        </div>
      </div>

      {/* Backup Actions */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200">
        <div className="p-2.5">
          <h2 className="text-xs font-semibold text-gray-900 mb-2">Yedekleme İşlemleri</h2>
          
          <div className="space-y-2">
            {/* Export */}
            <div className="border border-gray-200 rounded-md p-2.5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-gray-900 mb-1">Veri Yedekleme</h3>
                  <p className="text-xs text-gray-600 mb-2 leading-snug">
                    Tüm servis kayıtlarınızı ve notlarınızı JSON dosyası olarak indirin.
                  </p>
                  <button
                    onClick={onExportData}
                    className="bg-blue-600 text-white px-2.5 py-1.5 rounded-sm hover:bg-blue-700 transition-colors flex items-center space-x-1 text-xs min-h-[28px]"
                  >
                    <DownloadIcon className="h-3 w-3" />
                    <span>Yedek Al</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Import */}
            <div className="border border-gray-200 rounded-md p-2.5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-gray-900 mb-1">Veri Geri Yükleme</h3>
                  <p className="text-xs text-gray-600 mb-2 leading-snug">
                    Daha önce aldığınız yedek dosyasını sisteme geri yükleyin.
                  </p>
                  <button
                    onClick={handleImportClick}
                    className="bg-green-600 text-white px-2.5 py-1.5 rounded-sm hover:bg-green-700 transition-colors flex items-center space-x-1 text-xs min-h-[28px]"
                  >
                    <UploadIcon className="h-3 w-3" />
                    <span>Geri Yükle</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 rounded-md p-2.5 border border-yellow-200">
        <h3 className="text-xs font-medium text-yellow-800 mb-1">Önemli Notlar</h3>
        <ul className="text-xs text-yellow-700 space-y-0.5 leading-snug">
          <li className="break-words">• Yedekleme işlemi tüm verilerinizi güvenli bir şekilde kaydeder</li>
          <li className="break-words">• Geri yükleme işlemi mevcut verilerin üzerine yazar</li>
          <li className="break-words">• Düzenli yedekleme almanızı öneririz</li>
        </ul>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default Backup;