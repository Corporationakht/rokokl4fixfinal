// src/screens/DashboardScreen.js
import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  StatusBar, Dimensions,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { KPICard, SectionHeader, Card, EmptyState } from '../components/UIComponents';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../utils/constants';
import { formatRupiah, formatTanggalPendek, rekapBulanan } from '../utils/helpers';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const { pengaturan, transaksi, stats } = useApp();

  const rekapBln = useMemo(() => rekapBulanan(transaksi).slice(0, 3), [transaksi]);
  const transaksiTerbaru = useMemo(() => transaksi.slice(0, 5), [transaksi]);

  const progressTarget = Math.min((stats.totalQty / (pengaturan.targetBulanan || 1)) * 100, 100);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Halo, {pengaturan.namaPemilik || 'Pemilik'} 👋</Text>
          <Text style={styles.headerToko}>{pengaturan.namaToko}</Text>
          <View style={styles.productBadge}>
            <Text style={styles.productBadgeText}>🛍️ {pengaturan.namaBarang}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Pengaturan')}
          style={styles.settingsBtn}
        >
          <Text style={{ fontSize: 22 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Stats */}
        <View style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.heroItem}>
              <Text style={styles.heroLabel}>Total Penjualan</Text>
              <Text style={styles.heroValue}>{formatRupiah(stats.totalPenjualan)}</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroItem}>
              <Text style={styles.heroLabel}>Total Keuntungan</Text>
              <Text style={[styles.heroValue, { color: COLORS.accent }]}>
                {formatRupiah(stats.totalKeuntungan)}
              </Text>
            </View>
          </View>

          {/* Progress Target */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress Target Bulanan</Text>
              <Text style={styles.progressPercent}>{progressTarget.toFixed(0)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressTarget}%` }]} />
            </View>
            <Text style={styles.progressSubtext}>
              {stats.totalQty} / {pengaturan.targetBulanan} unit terjual
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* KPI Cards */}
          <SectionHeader title="Ringkasan" />
          <KPICard
            label="Total Unit Terjual"
            value={`${stats.totalQty.toLocaleString('id-ID')} unit`}
            icon="📦"
            color={COLORS.primary}
          />
          <KPICard
            label="Total Transaksi"
            value={`${stats.jumlahTransaksi} transaksi`}
            icon="🧾"
            color={COLORS.primaryLight}
          />
          <KPICard
            label="Margin Keuntungan"
            value={`${stats.margin.toFixed(1)}%`}
            icon="📈"
            color={COLORS.success}
          />
          <KPICard
            label="Estimasi Stok Tersisa"
            value={`${Math.max(0, stats.stokTersisa).toLocaleString('id-ID')} unit`}
            icon="🏪"
            color={stats.stokTersisa < 10 ? COLORS.danger : COLORS.warning}
            subtitle={stats.stokTersisa < 10 ? '⚠️ Stok hampir habis!' : null}
          />

          {/* Tombol Input Cepat */}
          <TouchableOpacity
            style={styles.quickAddBtn}
            onPress={() => navigation.navigate('TambahTransaksi')}
            activeOpacity={0.85}
          >
            <Text style={styles.quickAddIcon}>➕</Text>
            <Text style={styles.quickAddText}>Catat Penjualan Baru</Text>
          </TouchableOpacity>

          {/* Rekap Bulanan */}
          {rekapBln.length > 0 && (
            <>
              <SectionHeader
                title="Rekap Bulanan"
                action="Lihat Semua →"
                onAction={() => navigation.navigate('Rekap')}
              />
              {rekapBln.map((r) => (
                <Card key={r.key} style={{ marginBottom: SPACING.sm }}>
                  <View style={styles.rekapHeader}>
                    <Text style={styles.rekapBulan}>
                      {['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][r.bulan]} {r.tahun}
                    </Text>
                    <View style={styles.rekapBadge}>
                      <Text style={styles.rekapBadgeText}>{r.jumlahTransaksi} transaksi</Text>
                    </View>
                  </View>
                  <View style={styles.rekapRow}>
                    <View style={styles.rekapItem}>
                      <Text style={styles.rekapItemLabel}>Penjualan</Text>
                      <Text style={styles.rekapItemValue}>{formatRupiah(r.totalPenjualan)}</Text>
                    </View>
                    <View style={styles.rekapItem}>
                      <Text style={styles.rekapItemLabel}>Keuntungan</Text>
                      <Text style={[styles.rekapItemValue, { color: COLORS.success }]}>
                        {formatRupiah(r.totalKeuntungan)}
                      </Text>
                    </View>
                    <View style={styles.rekapItem}>
                      <Text style={styles.rekapItemLabel}>Qty</Text>
                      <Text style={styles.rekapItemValue}>{r.totalQty} unit</Text>
                    </View>
                  </View>
                </Card>
              ))}
            </>
          )}

          {/* Transaksi Terbaru */}
          <SectionHeader
            title="Transaksi Terbaru"
            action="Lihat Semua →"
            onAction={() => navigation.navigate('Transaksi')}
          />
          {transaksiTerbaru.length === 0 ? (
            <EmptyState
              icon="🧾"
              title="Belum ada transaksi"
              subtitle="Mulai catat penjualan pertama Anda!"
              action="+ Catat Sekarang"
              onAction={() => navigation.navigate('TambahTransaksi')}
            />
          ) : (
            transaksiTerbaru.map((t) => (
              <TouchableOpacity
                key={t.id}
                onPress={() => navigation.navigate('DetailTransaksi', { transaksi: t })}
                activeOpacity={0.8}
              >
                <Card style={{ marginBottom: SPACING.sm }}>
                  <View style={styles.transaksiRow}>
                    <View style={styles.transaksiLeft}>
                      <Text style={styles.transaksiNo}>{t.noTransaksi}</Text>
                      <Text style={styles.transaksiTgl}>{formatTanggalPendek(t.tanggal)}</Text>
                      {t.pembeli ? <Text style={styles.transaksiPembeli}>👤 {t.pembeli}</Text> : null}
                    </View>
                    <View style={styles.transaksiRight}>
                      <Text style={styles.transaksiQty}>{t.qty} unit</Text>
                      <Text style={styles.transaksiTotal}>{formatRupiah(t.totalPenjualan)}</Text>
                      <Text style={styles.transaksiUntung}>+{formatRupiah(t.keuntungan)}</Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerGreeting: { fontSize: FONTS.sizes.sm, color: COLORS.white + 'CC', marginBottom: 2 },
  headerToko: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.white },
  productBadge: {
    backgroundColor: COLORS.white + '22',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  productBadgeText: { fontSize: FONTS.sizes.xs, color: COLORS.white, fontWeight: '600' },
  settingsBtn: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroCard: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  heroRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
  heroItem: { flex: 1, alignItems: 'center' },
  heroLabel: { fontSize: FONTS.sizes.xs, color: COLORS.white + 'CC', marginBottom: 4 },
  heroValue: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.white },
  heroDivider: { width: 1, height: 40, backgroundColor: COLORS.white + '33', marginHorizontal: SPACING.md },

  progressSection: {},
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: FONTS.sizes.xs, color: COLORS.white + 'CC' },
  progressPercent: { fontSize: FONTS.sizes.xs, color: COLORS.white, fontWeight: '700' },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.white + '33',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: RADIUS.full },
  progressSubtext: { fontSize: FONTS.sizes.xs, color: COLORS.white + 'AA' },

  content: { padding: SPACING.xl },

  quickAddBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginVertical: SPACING.md,
    ...SHADOWS.medium,
  },
  quickAddIcon: { fontSize: 20 },
  quickAddText: { color: COLORS.primaryDark, fontWeight: '800', fontSize: FONTS.sizes.lg },

  rekapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  rekapBulan: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  rekapBadge: { backgroundColor: COLORS.primary + '15', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full },
  rekapBadgeText: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '600' },
  rekapRow: { flexDirection: 'row' },
  rekapItem: { flex: 1, alignItems: 'center' },
  rekapItemLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginBottom: 2 },
  rekapItemValue: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textPrimary },

  transaksiRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  transaksiLeft: { flex: 1 },
  transaksiNo: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.primary },
  transaksiTgl: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  transaksiPembeli: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  transaksiRight: { alignItems: 'flex-end' },
  transaksiQty: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  transaksiTotal: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textPrimary },
  transaksiUntung: { fontSize: FONTS.sizes.xs, color: COLORS.success, fontWeight: '600' },
});
