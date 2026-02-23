// src/screens/TambahTransaksiScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { InputField, Button, Card, RowInfo, Divider } from '../components/UIComponents';
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS } from '../utils/constants';
import { formatRupiah, getTanggalHariIni, hitungKeuntungan } from '../utils/helpers';

export default function TambahTransaksiScreen({ navigation }) {
  const { pengaturan, tambahTransaksi } = useApp();

  const [form, setForm] = useState({
    qty: '',
    pembeli: '',
    tanggal: getTanggalHariIni(),
    catatanTambahan: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const qty = parseInt(form.qty) || 0;
  const preview = qty > 0 ? hitungKeuntungan(qty, pengaturan.hargaJual, pengaturan.hargaModal) : null;

  const validate = () => {
    const err = {};
    if (!form.qty || parseInt(form.qty) <= 0) err.qty = 'Qty harus lebih dari 0';
    if (!form.tanggal) err.tanggal = 'Tanggal harus diisi';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSimpan = async () => {
    if (!validate()) return;
    setLoading(true);
    const result = await tambahTransaksi(form);
    setLoading(false);
    if (result) {
      Alert.alert(
        '✅ Berhasil!',
        `Transaksi ${result.noTransaksi} berhasil disimpan.\nKeuntungan: ${formatRupiah(result.keuntungan)}`,
        [
          { text: 'Tambah Lagi', onPress: () => setForm({ qty: '', pembeli: '', tanggal: getTanggalHariIni(), catatanTambahan: '' }) },
          { text: 'Kembali', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      Alert.alert('❌ Gagal', 'Terjadi kesalahan. Coba lagi.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Catat Penjualan</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ padding: SPACING.xl, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Produk */}
          <Card style={styles.productCard}>
            <View style={styles.productRow}>
              <Text style={styles.productIcon}>🛍️</Text>
              <View>
                <Text style={styles.productName}>{pengaturan.namaBarang}</Text>
                <Text style={styles.productPrice}>Harga Jual: {formatRupiah(pengaturan.hargaJual)}</Text>
              </View>
            </View>
          </Card>

          {/* Form */}
          <InputField
            label="Jumlah (Qty)"
            value={form.qty}
            onChangeText={(v) => setForm({ ...form, qty: v.replace(/[^0-9]/g, '') })}
            placeholder="Masukkan jumlah unit"
            keyboardType="numeric"
            suffix="unit"
            error={errors.qty}
            required
          />

          <InputField
            label="Tanggal Transaksi"
            value={form.tanggal}
            onChangeText={(v) => setForm({ ...form, tanggal: v })}
            placeholder="YYYY-MM-DD"
            error={errors.tanggal}
            required
          />

          <InputField
            label="Nama Pembeli"
            value={form.pembeli}
            onChangeText={(v) => setForm({ ...form, pembeli: v })}
            placeholder="Opsional"
          />

          <InputField
            label="Catatan Tambahan"
            value={form.catatanTambahan}
            onChangeText={(v) => setForm({ ...form, catatanTambahan: v })}
            placeholder="Catatan opsional..."
            multiline
            numberOfLines={3}
          />

          {/* Preview Kalkulasi */}
          {preview && (
            <Card style={styles.previewCard}>
              <Text style={styles.previewTitle}>📊 Preview Transaksi</Text>
              <Divider margin={SPACING.sm} />
              <RowInfo label="Qty" value={`${qty} unit`} />
              <RowInfo label="Harga Satuan" value={formatRupiah(pengaturan.hargaJual)} />
              <RowInfo label="Total Penjualan" value={formatRupiah(preview.totalJual)} bold />
              <Divider margin={SPACING.xs} />
              <RowInfo label="Total Modal" value={formatRupiah(preview.totalModal)} />
              <RowInfo
                label="Keuntungan"
                value={formatRupiah(preview.keuntungan)}
                valueColor={COLORS.success}
                bold
              />
              <RowInfo
                label="Margin"
                value={`${preview.margin.toFixed(1)}%`}
                valueColor={COLORS.primaryLight}
              />
            </Card>
          )}

          <Button
            title="Simpan Transaksi"
            onPress={handleSimpan}
            loading={loading}
            icon="💾"
            style={{ marginTop: SPACING.md }}
          />
          <Button
            title="Batal"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={{ marginTop: SPACING.sm }}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  headerTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.white },

  productCard: {
    backgroundColor: COLORS.primary + '10',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  productRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  productIcon: { fontSize: 32 },
  productName: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.primary },
  productPrice: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },

  previewCard: {
    backgroundColor: COLORS.successLight,
    borderWidth: 1.5,
    borderColor: COLORS.success + '40',
    marginTop: SPACING.md,
  },
  previewTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
});
