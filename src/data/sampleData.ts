import { ServiceRecord } from '../types';

export const sampleServiceRecords: ServiceRecord[] = [
  {
    id: '1',
    customerPhone: '0532 123 4567',
    address: 'İstanbul, Beylikdüzü - Telefon ekran değişimi ve batarya tamir',
    color: 'blue',
    cost: 450,
    expenses: 180,
    status: 'completed',
    createdAt: '2023-06-15T10:00:00Z',
    updatedAt: '2023-06-15T14:30:00Z',
  },
  {
    id: '2',
    customerPhone: '0555 987 6543',
    address: 'Ankara, Çankaya - Laptop fan temizliği ve termal macun yenileme',
    color: 'green',
    cost: 350,
    expenses: 120,
    status: 'ongoing',
    createdAt: '2023-07-22T09:15:00Z',
    updatedAt: '2023-07-22T16:45:00Z',
  },
  {
    id: '3',
    customerPhone: '0533 456 7890',
    address: 'İzmir, Konak - Anakart tamiri, RAM yükseltme',
    color: 'yellow',
    cost: 780,
    expenses: 320,
    status: 'workshop',
    createdAt: '2023-08-05T11:30:00Z',
    updatedAt: '2023-08-05T17:20:00Z',
  },
  {
    id: '4',
    customerPhone: '0532 123 4567',
    address: 'Bursa, Nilüfer - Yazılım güncellemesi, veri kurtarma',
    color: 'red',
    cost: 250,
    expenses: 90,
    status: 'completed',
    createdAt: '2023-09-10T08:45:00Z',
    updatedAt: '2023-09-10T15:10:00Z',
  },
];