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
    <div className="px-3 pt-3 pb-4 space-y-3 h-full overflow-y-auto overscroll-contain">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 min-h-[70px]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium text-blue-700">Toplam Servis</h3>
              <p className="text-base font-bold text-blue-900">{servicesCount}</p>
            </div>
            <DatabaseIcon className="h-4 w-4 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-3 border border-green-200 min-h-[70px]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium text-green-700">Toplam Not</h3>
              <p className="text-base font-bold text-green-900">{notesCount}</p>
            </div>
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
          </div>
        </div>
      </div>

      {/* Backup Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-3">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Yedekleme İşlemleri</h2>
          
          <div className="space-y-3">
            {/* Export */}
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Veri Yedekleme</h3>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    Tüm servis kayıtlarınızı ve notlarınızı JSON dosyası olarak indirin.
                  </p>
                  <button
                    onClick={onExportData}
                    className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1.5 text-xs min-h-[36px]"
                  >
                    <DownloadIcon className="h-3.5 w-3.5" />
                    <span>Yedek Al</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Import */}
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Veri Geri Yükleme</h3>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    Daha önce aldığınız yedek dosyasını sisteme geri yükleyin.
                  </p>
                  <button
                    onClick={handleImportClick}
                    className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-1.5 text-xs min-h-[36px]"
                  >
                    <UploadIcon className="h-3.5 w-3.5" />
                    <span>Geri Yükle</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
        <h3 className="text-xs font-medium text-yellow-800 mb-1">Önemli Notlar</h3>
        <ul className="text-xs text-yellow-700 space-y-1 leading-relaxed">
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