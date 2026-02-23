// src/context/AppContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId, generateNoTransaksi, hitungKeuntungan } from '../utils/helpers';

const AppContext = createContext();

const STORAGE_KEYS = {
  PENGATURAN: '@catatan_penjualan:pengaturan',
  TRANSAKSI: '@catatan_penjualan:transaksi',
};

const DEFAULT_PENGATURAN = {
  namaToko: 'Toko Saya',
  namaBarang: 'Produk A',
  hargaJual: 50000,
  hargaModal: 30000,
  stokAwal: 100,
  targetBulanan: 200,
  namaPemilik: '',
};

export const AppProvider = ({ children }) => {
  const [pengaturan, setPengaturan] = useState(DEFAULT_PENGATURAN);
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data dari storage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedPengaturan, storedTransaksi] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PENGATURAN),
        AsyncStorage.getItem(STORAGE_KEYS.TRANSAKSI),
      ]);
      if (storedPengaturan) setPengaturan(JSON.parse(storedPengaturan));
      if (storedTransaksi) setTransaksi(JSON.parse(storedTransaksi));
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  };

  const simpanPengaturan = async (data) => {
    try {
      const updated = { ...pengaturan, ...data };
      await AsyncStorage.setItem(STORAGE_KEYS.PENGATURAN, JSON.stringify(updated));
      setPengaturan(updated);
      return true;
    } catch (e) {
      console.error('Error saving pengaturan:', e);
      return false;
    }
  };

  const tambahTransaksi = async ({ qty, pembeli, tanggal, catatanTambahan }) => {
    try {
      const index = transaksi.length + 1;
      const kalkulasi = hitungKeuntungan(qty, pengaturan.hargaJual, pengaturan.hargaModal);
      const newTransaksi = {
        id: generateId(),
        noTransaksi: generateNoTransaksi(index),
        tanggal: tanggal || new Date().toISOString().split('T')[0],
        pembeli: pembeli || '',
        qty: parseInt(qty),
        hargaJual: pengaturan.hargaJual,
        hargaModal: pengaturan.hargaModal,
        ...kalkulasi,
        catatanTambahan: catatanTambahan || '',
        createdAt: new Date().toISOString(),
      };
      const updated = [newTransaksi, ...transaksi];
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSAKSI, JSON.stringify(updated));
      setTransaksi(updated);
      return newTransaksi;
    } catch (e) {
      console.error('Error tambah transaksi:', e);
      return null;
    }
  };

  const hapusTransaksi = async (id) => {
    try {
      const updated = transaksi.filter((t) => t.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSAKSI, JSON.stringify(updated));
      setTransaksi(updated);
      return true;
    } catch (e) {
      return false;
    }
  };

  const editTransaksi = async (id, data) => {
    try {
      const kalkulasi = hitungKeuntungan(data.qty, pengaturan.hargaJual, pengaturan.hargaModal);
      const updated = transaksi.map((t) =>
        t.id === id ? { ...t, ...data, ...kalkulasi } : t
      );
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSAKSI, JSON.stringify(updated));
      setTransaksi(updated);
      return true;
    } catch (e) {
      return false;
    }
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.PENGATURAN, STORAGE_KEYS.TRANSAKSI]);
      setPengaturan(DEFAULT_PENGATURAN);
      setTransaksi([]);
    } catch (e) {}
  };

  // Statistik global
  const stats = {
    totalQty: transaksi.reduce((s, t) => s + t.qty, 0),
    totalPenjualan: transaksi.reduce((s, t) => s + t.totalPenjualan, 0),
    totalModal: transaksi.reduce((s, t) => s + t.totalModal, 0),
    totalKeuntungan: transaksi.reduce((s, t) => s + t.keuntungan, 0),
    jumlahTransaksi: transaksi.length,
    stokTersisa: pengaturan.stokAwal - transaksi.reduce((s, t) => s + t.qty, 0),
    margin: transaksi.length > 0
      ? (transaksi.reduce((s, t) => s + t.keuntungan, 0) /
         transaksi.reduce((s, t) => s + t.totalPenjualan, 0)) * 100
      : 0,
  };

  return (
    <AppContext.Provider
      value={{
        pengaturan,
        transaksi,
        loading,
        stats,
        simpanPengaturan,
        tambahTransaksi,
        hapusTransaksi,
        editTransaksi,
        clearAllData,
        reloadData: loadData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
