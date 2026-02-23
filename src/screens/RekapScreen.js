// src/screens/RekapScreen.js
import React, { useMemo, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Card, SectionHeader, EmptyState, RowInfo, Divider } from '../components/UIComponents';
import { COLORS, SPACING, FONTS, RADIUS, MONTHS } from '../utils/constants';
import { formatRupiah, rekapBulanan } from '../utils/helpers';

const { width } = Dimensions.get('window');

// Simple Bar Chart Component
const SimpleBarChart = ({ data, valueKey, labelKey, color = COLORS.primary }) => {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d[valueKey]));
  if (max === 0) return null;

  return (
    <View style={chartStyles.container}>
      {data.slice().reverse().map((item, i) => {
        const pct = (item[valueKey] / max) * 100;
        return (
          <View key={i} style={chartStyles.row}>
            <Text style={chartStyles.label} numberOfLines={1}>
              {item[labelKey]}
            </Text>
            <View style={chartStyles.barBg}>
              <View style={[chartStyles.bar, { width: `${pct}%`, backgroundColor: color }]} />
            </View>
            <Text style={chartStyles.value}>
              {item[valueKey] >= 1000000
                ? `${(item[valueKey] / 1000000).toFixed(1)}jt`
                : item[valueKey] >= 1000
                ? `${(item[valueKey] / 1000).toFixed(0)}rb`
                : item[valueKey]}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const chartStyles = StyleSheet.create({
  container: { marginTop: SPACING.sm },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  label: { width: 44, fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  barBg: { flex: 1, height: 20, backgroundColor: COLORS.border, borderRadius: RADIUS.full, overflow: 'hidden', marginHorizontal: SPACING.sm },
  bar: { height: '100%', borderRadius: RADIUS.full },
  value: { width: 48, fontSize: FONTS.sizes.xs, color: COLORS.textPrimary, fontWeight: '600', textAlign: 'right' },
});

export default function RekapScreen({ navigation }) {
  const { transaksi, stats, pengaturan } = useApp();
  const [activeTab, setActiveTab] = useState('penjualan');

  const rekap = useMemo(() => rekapBulanan(transaksi), [transaksi]);

  const chartData = useMemo(() =>
    rekap.slice(0, 6).map((r) => ({
      label: `${MONTHS[r.bulan].slice(0, 3)} ${r.tahun.toString().slice(-2)}`,
      penjualan: r.totalPenjualan,
      keuntungan: r.totalKeuntungan,
      qty: r.totalQty,
    })),
    [rekap]
  );

  const tabs = [
    { key: 'penjualan', label: 'Penjualan', color: COLORS.primary },
    { key: 'keuntungan', label: 'Keuntungan', color: COLORS.success },
    { key: 'qty', label: 'Qty', color: COLORS.warning },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rekap Bulanan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: SPACING.xl, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Summary */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.summaryLabel}>Total Penjualan</Text>
            <Text style={styles.summaryValue}>{formatRupiah(stats.totalPenjualan)}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: COLORS.success }]}>
            <Text style={styles.summaryLabel}>Total Keuntungan</Text>
            <Text style={styles.summaryValue}>{formatRupiah(stats.totalKeuntungan)}</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: COLORS.primaryLight }]}>
            <Text style={styles.summaryLabel}>Total Qty</Text>
            <Text style={styles.summaryValue}>{stats.totalQty} unit</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: COLORS.warning }]}>
            <Text style={styles.summaryLabel}>Avg Margin</Text>
            <Text style={styles.summaryValue}>{stats.margin.toFixed(1)}%</Text>
          </View>
        </View>

        {/* Grafik */}
        {chartData.length > 0 && (
          <Card style={{ marginTop: SPACING.md }}>
            <Text style={styles.cardTitle}>📊 Grafik 6 Bulan Terakhir</Text>
            <View style={styles.tabsRow}>
              {tabs.map((t) => (
                <TouchableOpacity
                  key={t.key}
                  onPress={() => setActiveTab(t.key)}
                  style={[styles.tab, activeTab === t.key && { backgroundColor: t.color }]}
                >
                  <Text style={[styles.tabText, activeTab === t.key && { color: COLORS.white }]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <SimpleBarChart
              data={chartData}
              valueKey={activeTab}
              labelKey="label"
              color={tabs.find((t) => t.key === activeTab)?.color || COLORS.primary}
            />
          </Card>
        )}

        {/* Rekap Per Bulan */}
        <SectionHeader title="Detail Per Bulan" />
        {rekap.length === 0 ? (
          <EmptyState
            icon="📊"
            title="Belum ada data"
            subtitle="Data rekap akan muncul setelah Anda mencatat transaksi"
          />
        ) : (
          rekap.map((r) => (
            <Card key={r.key} style={{ marginBottom: SPACING.sm }}>
              <View style={styles.rekapHeader}>
                <Text style={styles.rekapBulan}>
                  {MONTHS[r.bulan]} {r.tahun}
                </Text>
                <Text style={styles.rekapTrx}>{r.jumlahTransaksi} transaksi</Text>
              </View>
              <Divider margin={SPACING.sm} />
              <View style={styles.rekapGrid}>
                <View style={styles.rekapGridItem}>
                  <Text style={styles.rekapGridLabel}>Total Qty</Text>
                  <Text style={styles.rekapGridValue}>{r.totalQty} unit</Text>
                </View>
                <View style={styles.rekapGridItem}>
                  <Text style={styles.rekapGridLabel}>Penjualan</Text>
                  <Text style={styles.rekapGridValue}>{formatRupiah(r.totalPenjualan)}</Text>
                </View>
                <View style={styles.rekapGridItem}>
                  <Text style={styles.rekapGridLabel}>Modal</Text>
                  <Text style={styles.rekapGridValue}>{formatRupiah(r.totalModal)}</Text>
                </View>
                <View style={styles.rekapGridItem}>
                  <Text style={styles.rekapGridLabel}>Keuntungan</Text>
                  <Text style={[styles.rekapGridValue, { color: COLORS.success }]}>
                    {formatRupiah(r.totalKeuntungan)}
                  </Text>
                </View>
              </View>
              {/* Progress margin */}
              <View style={{ marginTop: SPACING.sm }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: FONTS.sizes.xs, color: COLORS.textSecondary }}>Margin</Text>
                  <Text style={{ fontSize: FONTS.sizes.xs, color: COLORS.primaryLight, fontWeight: '600' }}>
                    {r.totalPenjualan > 0 ? ((r.totalKeuntungan / r.totalPenjualan) * 100).toFixed(1) : 0}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, {
                    width: `${r.totalPenjualan > 0 ? Math.min((r.totalKeuntungan / r.totalPenjualan) * 100, 100) : 0}%`
                  }]} />
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
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

  summaryRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  summaryCard: {
    flex: 1, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center',
  },
  summaryLabel: { fontSize: FONTS.sizes.xs, color: COLORS.white + 'CC', marginBottom: 4 },
  summaryValue: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.white },

  cardTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.md },
  tabsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  tab: {
    paddingHorizontal: SPACING.md, paddingVertical: 6,
    borderRadius: RADIUS.full, backgroundColor: COLORS.border,
  },
  tabText: { fontSize: FONTS.sizes.xs, fontWeight: '600', color: COLORS.textSecondary },

  rekapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rekapBulan: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  rekapTrx: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  rekapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  rekapGridItem: { width: '48%' },
  rekapGridLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginBottom: 2 },
  rekapGridValue: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textPrimary },

  progressBar: {
    height: 5, backgroundColor: COLORS.border, borderRadius: RADIUS.full, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.full,
  },
});
