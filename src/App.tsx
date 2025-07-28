import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ServiceListView from './components/ServiceListView';
import ServiceForm from './components/ServiceForm';
import Notes from './components/Notes';
import Reports from './components/Reports';
import Backup from './components/Backup';
import ServiceDetail from './components/ServiceDetail';
import { ServiceRecord } from './types';
import { saveServiceOrder, applySavedOrder, generateId } from './utils/helpers';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

function App() {
  const [page, setPage] = useState('dashboard');
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceRecord | undefined>(undefined);
  const [missingParts, setMissingParts] = useState<string[]>([]);
  const [viewingService, setViewingService] = useState<ServiceRecord | null>(null);
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'workshop' | 'completed'>('all');

  // Load data from localStorage on component mount
  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setLoading(true);
      loadServices();
      loadNotes();
      loadMissingParts();
    } catch (error) {
      console.error('❌ Failed to load data:', error);
      setError('Veriler yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // Listen for navigation events from Dashboard
    const handleNavigate = (event: CustomEvent) => {
      setPage(event.detail);
    };
    
    // Listen for add new service events
    const handleAddNewService = () => {
      setSelectedService(undefined);
      setPage('newService');
    };
    
    window.addEventListener('navigate', handleNavigate as EventListener);
    window.addEventListener('addNewService', handleAddNewService as EventListener);
    
    return () => {
      window.removeEventListener('navigate', handleNavigate as EventListener);
      window.removeEventListener('addNewService', handleAddNewService as EventListener);
    };
  }, []);

  const loadServices = () => {
    try {
      setError(null);
      console.log('🔄 Loading services from localStorage...');
      
      const savedServices = localStorage.getItem('sts_services');
      const servicesData = savedServices ? JSON.parse(savedServices) : [];
      
      // Migrate legacy data to new structure
      const migratedServices = servicesData.map((service: any) => ({
        ...service,
        // Migrate legacy fields to new structure
        customerPhone: service.customerPhone || service.phoneNumber || '',
        address: service.address || service.description || '',
        cost: service.cost || service.feeCollected || 0,
        createdAt: service.createdAt || service.date || new Date().toISOString(),
        updatedAt: service.updatedAt || new Date().toISOString(),
        // Keep legacy fields for backward compatibility
        phoneNumber: service.phoneNumber || service.customerPhone || '',
        description: service.description || service.address || '',
        feeCollected: service.feeCollected || service.cost || 0,
        date: service.date || service.createdAt || new Date().toISOString().split('T')[0],
      }));
      
      // Apply saved order from localStorage
      const orderedServices = applySavedOrder(migratedServices);
      setServices(orderedServices);
      
      console.log('✅ Successfully loaded', orderedServices.length, 'services from localStorage');
    } catch (error) {
      console.error('❌ Failed to load services:', error);
      setError('Servisler yüklenirken hata oluştu.');
    }
  };

  const loadNotes = () => {
    try {
      const savedNotes = localStorage.getItem('sts_notes');
      const notesData = savedNotes ? JSON.parse(savedNotes) : [];
      setNotes(notesData);
      console.log('✅ Successfully loaded', notesData.length, 'notes from localStorage');
    } catch (error) {
      console.error('❌ Failed to load notes from localStorage:', error);
    }
  };

  const loadMissingParts = () => {
    try {
      const savedParts = localStorage.getItem('sts_missing_parts');
      const partsData = savedParts ? JSON.parse(savedParts) : [];
      setMissingParts(partsData);
      console.log('✅ Successfully loaded', partsData.length, 'missing parts from localStorage');
    } catch (error) {
      console.error('❌ Failed to load missing parts from localStorage:', error);
    }
  };

  const handleAddService = () => {
    setSelectedService(undefined);
    setSelectedService(undefined);
    setPage('newService');
  };

  const handleEditService = (service: ServiceRecord) => {
    setSelectedService(service);
    setPage('newService');
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Bu servis kaydını silmek istediğinizden emin misiniz?')) {
      deleteService(id);
    }
  };

  const handleSaveService = (service: ServiceRecord) => {
    if (selectedService) {
      updateService(service);
    } else {
      createService(service);
    }
  };

  const handleReorderServices = (reorderedServices: ServiceRecord[]) => {
    // Update services state and save to localStorage
    setServices(reorderedServices);
    saveServiceOrder(reorderedServices);
    localStorage.setItem('sts_services', JSON.stringify(reorderedServices));
    // Clear selected service to prevent form contamination
    setSelectedService(undefined);
  };

  const handleAddMissingPart = (missingPart: string) => {
    const updatedParts = [...missingParts, missingPart];
    setMissingParts(updatedParts);
    localStorage.setItem('sts_missing_parts', JSON.stringify(updatedParts));
  };

  const handleRemoveMissingPart = (index: number) => {
    const updatedParts = missingParts.filter((_, i) => i !== index);
    setMissingParts(updatedParts);
    localStorage.setItem('sts_missing_parts', JSON.stringify(updatedParts));
  };

  const handleViewService = (service: ServiceRecord) => {
    setViewingService(service);
  };

  const handleCloseServiceDetail = () => {
    setViewingService(null);
  };

  const handleEditFromDetail = (service: ServiceRecord) => {
    setSelectedService(service);
    setViewingService(null);
    setPage('newService');
  };

  const handleStatusCardClick = (status: 'ongoing' | 'workshop' | 'completed') => {
    setStatusFilter(status);
  };

  const handleBackToAll = () => {
    setStatusFilter('all');
  };

  const createService = (service: ServiceRecord) => {
    try {
      setError(null);
      console.log('🔄 Creating new service in localStorage:', service);
      
      const newService = { 
        ...service, 
        id: service.id || generateId(),
        createdAt: service.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const updatedServices = [...services, newService];
      setServices(updatedServices);
      localStorage.setItem('sts_services', JSON.stringify(updatedServices));
      setPage('dashboard');
      
      console.log('✅ Successfully created service in localStorage:', newService);
    } catch (error) {
      console.error('❌ Failed to create service:', error);
      setError('Servis kaydı oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const updateService = (service: ServiceRecord) => {
    try {
      setError(null);
      console.log('🔄 Updating service in localStorage:', service);
      
      const updatedServices = services.map(s => 
        s.id === service.id 
          ? { ...service, updatedAt: new Date().toISOString() }
          : s
      );
      setServices(updatedServices);
      localStorage.setItem('sts_services', JSON.stringify(updatedServices));
      setPage('dashboard');
      
      console.log('✅ Successfully updated service in localStorage:', service);
    } catch (error) {
      console.error('❌ Failed to update service:', error);
      setError('Servis kaydı güncellenirken hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const deleteService = (id: string) => {
    try {
      setError(null);
      console.log('🔄 Deleting service from localStorage:', id);
      
      const updatedServices = services.filter(s => s.id !== id);
      setServices(updatedServices);
      localStorage.setItem('sts_services', JSON.stringify(updatedServices));
      
      console.log('✅ Successfully deleted service from localStorage:', id);
    } catch (error) {
      console.error('❌ Failed to delete service:', error);
      setError('Servis kaydı silinirken hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  // Notes handlers
  const handleAddNote = (note: Note) => {
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    localStorage.setItem('sts_notes', JSON.stringify(updatedNotes));
  };

  const handleEditNote = (updatedNote: Note) => {
    const updatedNotes = notes.map(note => note.id === updatedNote.id ? updatedNote : note);
    setNotes(updatedNotes);
    localStorage.setItem('sts_notes', JSON.stringify(updatedNotes));
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem('sts_notes', JSON.stringify(updatedNotes));
    }
  };

  const handleExportData = () => {
    try {
      // Transform services to ensure they use the new structure
      const transformedServices = services.map(service => ({
        id: service.id,
        customerPhone: service.customerPhone || service.phoneNumber || '',
        address: service.address || service.description || '',
        color: service.color || 'white',
        cost: service.cost || service.feeCollected || 0,
        expenses: service.expenses || 0,
        status: service.status,
        createdAt: service.createdAt || service.date || new Date().toISOString(),
        updatedAt: service.updatedAt || new Date().toISOString()
      }));

      const data = {
        services: transformedServices,
        notes,
        missingParts,
        exportDate: new Date().toISOString()
      };
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `servis-yedek-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('Yedekleme başarıyla tamamlandı');
    } catch (error) {
      alert('Yedekleme sırasında bir hata oluştu');
    }
  };

  const handleImportData = (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          
          // Check if this is a lovable.json format (nested data structure)
          const actualData = data.data ? data.data : data;
          
          // Import data to localStorage
          if (actualData.services) {
            localStorage.setItem('sts_services', JSON.stringify(actualData.services));
          }
          if (actualData.notes) {
            localStorage.setItem('sts_notes', JSON.stringify(actualData.notes));
          }
          if (actualData.missingParts) {
            localStorage.setItem('sts_missing_parts', JSON.stringify(actualData.missingParts));
          }
          
          // Reload all data from localStorage to ensure proper state update
          loadData();
          
          const serviceCount = actualData.services ? actualData.services.length : 0;
          const noteCount = actualData.notes ? actualData.notes.length : 0;
          alert(`Veriler başarıyla yüklendi!\n${serviceCount} servis kaydı ve ${noteCount} not geri yüklendi.`);
        } catch (error) {
          alert('Dosya formatı geçersiz');
        }
      };
      reader.readAsText(file);
    } catch (error) {
      alert('Dosya yüklenirken bir hata oluştu');
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return (
          <ServiceListView
            services={services} 
            statusFilter={statusFilter}
            onEditService={handleEditService}
            onDeleteService={handleDeleteService}
            onViewService={handleViewService}
            onReorderServices={handleReorderServices}
            onBackToAll={handleBackToAll}
          />
        );
      case 'notes':
        return (
          <Notes
            notes={notes}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
          />
        );
      case 'reports':
        return (
          <Reports services={services} onViewService={handleViewService} />
        );
      case 'backup':
        return (
          <Backup
            onExportData={handleExportData}
            onImportData={handleImportData}
            servicesCount={services.length}
            notesCount={notes.length}
          />
        );
      case 'newService':
        return (
          <ServiceForm
            service={selectedService}
            onSave={handleSaveService}
            onCancel={() => setPage('dashboard')}
          />
        );
      default:
        return (
          <ServiceListView services={services} statusFilter={statusFilter} onEditService={handleEditService} onDeleteService={handleDeleteService} onViewService={handleViewService} onReorderServices={handleReorderServices} onBackToAll={handleBackToAll} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Veriler yükleniyor...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">⚠️</div>
            <div>
              <h3 className="text-red-800 font-medium">Hata</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <button 
                onClick={loadServices}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Yeniden yükle
              </button>
            </div>
          </div>
        </div>
      )}

      <Header 
        onNavigate={setPage} 
        currentPage={page}
      />
      
      <div className="flex flex-col">
        {/* Always render Dashboard for status cards and navigation */}
        <Dashboard 
          services={services} 
          missingParts={missingParts}
          onAddMissingPart={handleAddMissingPart}
          onRemoveMissingPart={handleRemoveMissingPart}
          currentPage={page}
          statusFilter={statusFilter}
          onStatusCardClick={handleStatusCardClick}
        />
        
        <main className="flex-1">
          {renderPage()}
        </main>
      </div>
      
      {/* Service Detail Modal */}
      {viewingService && (
        <ServiceDetail
          service={viewingService}
          onClose={handleCloseServiceDetail}
          onEdit={handleEditFromDetail}
        />
      )}
    </div>
  );
}

export default App;