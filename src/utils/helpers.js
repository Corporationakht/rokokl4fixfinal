// src/utils/helpers.js

export const formatRupiah = (angka) => {
  if (!angka && angka !== 0) return 'Rp 0';
  const num = parseFloat(angka) || 0;
  return 'Rp ' + num.toLocaleString('id-ID');
};

export const formatTanggal = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTanggalPendek = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};

export const getTanggalHariIni = () => {
  return new Date().toISOString().split('T')[0];
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const generateNoTransaksi = (index) => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `TRX-${year}${month}${day}-${String(index).padStart(3, '0')}`;
};

export const hitungKeuntungan = (qty, hargaJual, hargaModal) => {
  const totalJual = qty * hargaJual;
  const totalModal = qty * hargaModal;
  return {
    totalJual,
    totalModal,
    keuntungan: totalJual - totalModal,
    margin: totalJual > 0 ? ((totalJual - totalModal) / totalJual) * 100 : 0,
  };
};

export const rekapBulanan = (transaksi) => {
  const rekap = {};
  transaksi.forEach((t) => {
    const date = new Date(t.tanggal);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!rekap[key]) {
      rekap[key] = {
        key,
        tahun: date.getFullYear(),
        bulan: date.getMonth(),
        totalQty: 0,
        totalPenjualan: 0,
        totalModal: 0,
        totalKeuntungan: 0,
        jumlahTransaksi: 0,
      };
    }
    rekap[key].totalQty += t.qty;
    rekap[key].totalPenjualan += t.totalPenjualan;
    rekap[key].totalModal += t.totalModal;
    rekap[key].totalKeuntungan += t.keuntungan;
    rekap[key].jumlahTransaksi += 1;
  });
  return Object.values(rekap).sort((a, b) => b.key.localeCompare(a.key));
};

export const rekapHarian = (transaksi, bulanKey) => {
  return transaksi
    .filter((t) => {
      const date = new Date(t.tanggal);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return key === bulanKey;
    })
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
};

export const generateCSV = (transaksi, pengaturan) => {
  const headers = ['No', 'Tanggal', 'No Transaksi', 'Pembeli', 'Qty', 'Harga Satuan', 'Total Penjualan', 'Total Modal', 'Keuntungan'];
  const rows = transaksi.map((t, i) => [
    i + 1,
    t.tanggal,
    t.noTransaksi,
    t.pembeli || '-',
    t.qty,
    t.hargaJual,
    t.totalPenjualan,
    t.totalModal,
    t.keuntungan,
  ]);
  const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');
  return csvContent;
};
