// src/screens/PengaturanScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Alert, Share, KeyboardAvoidingView, Platform,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useApp } from '../context/AppContext';
import { InputField, Button, Card, Divider } from '../components/UIComponents';
import { COLORS, SPACING, FONTS, RADIUS } from '../utils/constants';
import { formatRupiah, generateCSV } from '../utils/helpers';

export default function PengaturanScreen({ navigation }) {
  const { pengaturan, simpanPengaturan, transaksi, clearAllData } = useApp();

  const [form, setForm] = useState({ ...pengaturan });
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleSimpan = async () => {
    if (!form.namaBarang || !form.hargaJual || !form.hargaModal) {
      Alert.alert('❌ Data tidak lengkap', 'Nama barang, harga jual, dan harga modal wajib diisi.');
      return;
    }
    setSaving(true);
    const result = await simpanPengaturan({
      ...form,
      hargaJual: parseFloat(form.hargaJual) || 0,
      hargaModal: parseFloat(form.hargaModal) || 0,
      stokAwal: parseInt(form.stokAwal) || 0,
      targetBulanan: parseInt(form.targetBulanan) || 0,
    });
    setSaving(false);
    if (result) {
      Alert.alert('✅ Tersimpan!', 'Pengaturan berhasil disimpan.');
    }
  };

  const handleExportCSV = async () => {
    if (transaksi.length === 0) {
      Alert.alert('❌ Tidak ada data', 'Belum ada transaksi untuk diekspor.');
      return;
    }
    setExporting(true);
    try {
      const csv = generateCSV(transaksi, pengaturan);
      const filename = `catatan_penjualan_${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Export Catatan Penjualan' });
      } else {
        Alert.alert('✅ File disimpan', `File tersimpan di: ${fileUri}`);
      }
    } catch (e) {
      Alert.alert('❌ Gagal', 'Terjadi kesalahan saat mengekspor data.');
    }
    setExporting(false);
  };

  const handleExportJSON = async () => {
    if (transaksi.length === 0) {
      Alert.alert('❌ Tidak ada data', 'Belum ada transaksi untuk diekspor.');
      return;
    }
    try {
      const data = JSON.stringify({ pengaturan, transaksi }, null, 2);
      const filename = `backup_penjualan_${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(fileUri, data, { encoding: FileSystem.EncodingType.UTF8 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'application/json', dialogTitle: 'Backup Data' });
      }
    } catch (e) {
      Alert.alert('❌ Gagal', 'Terjadi kesalahan saat backup data.');
    }
  };

  const handleReset = () => {
    Alert.alert(
      '⚠️ Hapus Semua Data',
      'Semua transaksi dan pengaturan akan dihapus permanen. Tindakan ini tidak dapat dibatalkan!',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Hapus Semua',
          style: 'destructive',
          onPress: () => {
            clearAllData();
            setForm({
              namaToko: 'Toko Saya',
              namaBarang: 'Produk A',
              hargaJual: 50000,
              hargaModal: 30000,
              stokAwal: 100,
              targetBulanan: 200,
              namaPemilik: '',
            });
            Alert.alert('✅ Selesai', 'Semua data berhasil dihapus.');
          },
        },
      ]
    );
  };

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pengaturan</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: SPACING.xl, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* Info Toko */}
          <Card>
            <Text style={styles.sectionTitle}>🏪 Info Toko</Text>
            <Divider margin={SPACING.sm} />
            <InputField label="Nama Toko" value={form.namaToko} onChangeText={set('namaToko')} placeholder="Nama toko Anda" />
            <InputField label="Nama Pemilik" value={form.namaPemilik} onChangeText={set('namaPemilik')} placeholder="Nama pemilik" />
          </Card>

          {/* Info Produk */}
          <Card>
            <Text style={styles.sectionTitle}>🛍️ Info Produk</Text>
            <Divider margin={SPACING.sm} />
            <InputField label="Nama Barang" value={form.namaBarang} onChangeText={set('namaBarang')} placeholder="Nama produk" required />
            <InputField
              label="Harga Jual"
              value={String(form.hargaJual)}
              onChangeText={set('hargaJual')}
              placeholder="50000"
              keyboardType="numeric"
              prefix="Rp"
              required
            />
            <InputField
              label="Harga Modal"
              value={String(form.hargaModal)}
              onChangeText={set('hargaModal')}
              placeholder="30000"
              keyboardType="numeric"
              prefix="Rp"
              required
            />
            {/* Preview margin */}
            {form.hargaJual > 0 && (
              <View style={styles.marginPreview}>
                <Text style={styles.marginLabel}>
                  Margin: {(((form.hargaJual - form.hargaModal) / form.hargaJual) * 100).toFixed(1)}%
                </Text>
                <Text style={styles.marginLabel}>
                  Untung/unit: {formatRupiah(form.hargaJual - form.hargaModal)}
                </Text>
              </View>
            )}
          </Card>

          {/* Target & Stok */}
          <Card>
            <Text style={styles.sectionTitle}>🎯 Target & Stok</Text>
            <Divider margin={SPACING.sm} />
            <InputField
              label="Stok Awal"
              value={String(form.stokAwal)}
              onChangeText={set('stokAwal')}
              placeholder="100"
              keyboardType="numeric"
              suffix="unit"
            />
            <InputField
              label="Target Penjualan/Bulan"
              value={String(form.targetBulanan)}
              onChangeText={set('targetBulanan')}
              placeholder="200"
              keyboardType="numeric"
              suffix="unit"
            />
          </Card>

          <Button title="Simpan Pengaturan" onPress={handleSimpan} loading={saving} icon="💾" />

          {/* Export */}
          <Card style={{ marginTop: SPACING.lg }}>
            <Text style={styles.sectionTitle}>📤 Export & Backup Data</Text>
            <Divider margin={SPACING.sm} />
            <Text style={styles.exportDesc}>
              Ekspor {transaksi.length} transaksi ke file CSV atau JSON.
            </Text>
            <Button
              title="Export CSV (Excel)"
              onPress={handleExportCSV}
              loading={exporting}
              icon="📊"
              style={{ marginTop: SPACING.sm }}
            />
            <Button
              title="Backup JSON"
              onPress={handleExportJSON}
              icon="💾"
              variant="outline"
              style={{ marginTop: SPACING.sm }}
            />
          </Card>

          {/* Danger Zone */}
          <Card style={[styles.dangerCard]}>
            <Text style={[styles.sectionTitle, { color: COLORS.danger }]}>⚠️ Zona Berbahaya</Text>
            <Divider margin={SPACING.sm} />
            <Text style={styles.dangerDesc}>
              Menghapus semua data transaksi dan pengaturan. Tidak dapat dibatalkan!
            </Text>
            <Button
              title="Hapus Semua Data"
              onPress={handleReset}
              variant="danger"
              icon="🗑️"
              style={{ marginTop: SPACING.sm }}
            />
          </Card>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50, paddingBottom: 16, paddingHorizontal: SPACING.xl,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: RADIUS.full,
    backgroundColor: COLORS.white + '22', alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  headerTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.white },

  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  marginPreview: {
    backgroundColor: COLORS.successLight,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  marginLabel: { fontSize: FONTS.sizes.sm, color: COLORS.success, fontWeight: '600' },
  exportDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  dangerCard: { borderWidth: 1.5, borderColor: COLORS.danger + '40' },
  dangerDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
});
