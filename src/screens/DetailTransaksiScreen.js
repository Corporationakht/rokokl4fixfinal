// src/screens/DetailTransaksiScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { Card, RowInfo, Divider, Button } from '../components/UIComponents';
import { COLORS, SPACING, FONTS, RADIUS } from '../utils/constants';
import { formatRupiah, formatTanggal } from '../utils/helpers';

export default function DetailTransaksiScreen({ route, navigation }) {
  const { transaksi } = route.params;
  const { hapusTransaksi } = useApp();

  const margin = transaksi.totalPenjualan > 0
    ? (transaksi.keuntungan / transaksi.totalPenjualan) * 100
    : 0;

  const handleHapus = () => {
    Alert.alert(
      'Hapus Transaksi',
      `Yakin hapus ${transaksi.noTransaksi}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus', style: 'destructive',
          onPress: async () => {
            await hapusTransaksi(transaksi.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Transaksi</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: SPACING.xl, paddingBottom: 100 }}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <Text style={styles.heroNo}>{transaksi.noTransaksi}</Text>
          <Text style={styles.heroDate}>{formatTanggal(transaksi.tanggal)}</Text>
          <Text style={styles.heroAmount}>{formatRupiah(transaksi.totalPenjualan)}</Text>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>✅ Selesai</Text>
          </View>
        </View>

        {/* Detail */}
        <Card>
          <Text style={styles.sectionTitle}>📋 Informasi Transaksi</Text>
          <Divider margin={SPACING.sm} />
          <RowInfo label="No. Transaksi" value={transaksi.noTransaksi} />
          <RowInfo label="Tanggal" value={formatTanggal(transaksi.tanggal)} />
          {transaksi.pembeli ? <RowInfo label="Pembeli" value={transaksi.pembeli} /> : null}
          <RowInfo label="Qty" value={`${transaksi.qty} unit`} />
          {transaksi.catatanTambahan ? <RowInfo label="Catatan" value={transaksi.catatanTambahan} /> : null}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>💰 Rincian Keuangan</Text>
          <Divider margin={SPACING.sm} />
          <RowInfo label="Harga Satuan" value={formatRupiah(transaksi.hargaJual)} />
          <RowInfo label="Total Penjualan" value={formatRupiah(transaksi.totalPenjualan)} bold />
          <Divider margin={SPACING.xs} />
          <RowInfo label="Modal per Unit" value={formatRupiah(transaksi.hargaModal)} />
          <RowInfo label="Total Modal" value={formatRupiah(transaksi.totalModal)} />
          <Divider margin={SPACING.xs} />
          <RowInfo
            label="Keuntungan"
            value={formatRupiah(transaksi.keuntungan)}
            valueColor={COLORS.success}
            bold
          />
          <RowInfo
            label="Margin"
            value={`${margin.toFixed(1)}%`}
            valueColor={COLORS.primaryLight}
          />
        </Card>

        <Button
          title="Hapus Transaksi"
          onPress={handleHapus}
          variant="danger"
          icon="🗑️"
          style={{ marginTop: SPACING.md }}
        />
        <Button
          title="Kembali"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={{ marginTop: SPACING.sm }}
        />
      </ScrollView>
    </View>
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
    width: 40, height: 40, borderRadius: RADIUS.full,
    backgroundColor: COLORS.white + '22', alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  headerTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.white },

  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  heroNo: { fontSize: FONTS.sizes.sm, color: COLORS.white + 'AA', marginBottom: 4 },
  heroDate: { fontSize: FONTS.sizes.md, color: COLORS.white + 'CC', marginBottom: SPACING.md },
  heroAmount: { fontSize: FONTS.sizes.xxxl, fontWeight: '800', color: COLORS.white },
  heroBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginTop: SPACING.md,
  },
  heroBadgeText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.sm },

  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
});
