// src/screens/TransaksiScreen.js
import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  TextInput, Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Card, EmptyState, Badge } from '../components/UIComponents';
import { COLORS, SPACING, FONTS, RADIUS } from '../utils/constants';
import { formatRupiah, formatTanggalPendek } from '../utils/helpers';

export default function TransaksiScreen({ navigation }) {
  const { transaksi, hapusTransaksi } = useApp();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return transaksi;
    const q = search.toLowerCase();
    return transaksi.filter(
      (t) =>
        t.noTransaksi.toLowerCase().includes(q) ||
        (t.pembeli && t.pembeli.toLowerCase().includes(q)) ||
        t.tanggal.includes(q)
    );
  }, [transaksi, search]);

  const handleHapus = (id, noTransaksi) => {
    Alert.alert(
      'Hapus Transaksi',
      `Yakin ingin menghapus ${noTransaksi}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => hapusTransaksi(id),
        },
      ]
    );
  };

  const renderItem = ({ item: t }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate('DetailTransaksi', { transaksi: t })}
    >
      <Card style={styles.card}>
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.noTrx}>{t.noTransaksi}</Text>
            <Text style={styles.tgl}>{formatTanggalPendek(t.tanggal)}</Text>
            {t.pembeli ? <Text style={styles.pembeli}>👤 {t.pembeli}</Text> : null}
          </View>
          <View style={styles.cardRight}>
            <Badge label={`${t.qty} unit`} color={COLORS.primary} />
            <Text style={styles.total}>{formatRupiah(t.totalPenjualan)}</Text>
            <Text style={styles.untung}>+{formatRupiah(t.keuntungan)}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleHapus(t.id, t.noTransaksi)}
          style={styles.hapusBtn}
        >
          <Text style={styles.hapusText}>🗑️ Hapus</Text>
        </TouchableOpacity>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Semua Transaksi</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('TambahTransaksi')}
          style={styles.addBtn}
        >
          <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.xl }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Cari transaksi..."
          placeholderTextColor={COLORS.textMuted}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.count}>
        {filtered.length} transaksi {search ? '(hasil pencarian)' : 'total'}
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: SPACING.xl, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={search ? '🔍' : '🧾'}
            title={search ? 'Tidak ditemukan' : 'Belum ada transaksi'}
            subtitle={search ? `Tidak ada hasil untuk "${search}"` : 'Tap + untuk menambah transaksi pertama'}
            action={!search ? '+ Catat Sekarang' : undefined}
            onAction={() => navigation.navigate('TambahTransaksi')}
          />
        }
      />
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
  addBtn: {
    width: 40, height: 40, borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: SPACING.xl,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  searchIcon: { fontSize: 16, marginRight: SPACING.sm },
  searchInput: { flex: 1, paddingVertical: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
  clearSearch: { color: COLORS.textMuted, fontSize: FONTS.sizes.lg, padding: SPACING.xs },

  count: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xs,
  },

  card: { marginBottom: SPACING.sm },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  noTrx: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.primary },
  tgl: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  pembeli: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  cardRight: { alignItems: 'flex-end', gap: 4 },
  total: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  untung: { fontSize: FONTS.sizes.xs, color: COLORS.success, fontWeight: '600' },
  hapusBtn: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignSelf: 'flex-end',
  },
  hapusText: { fontSize: FONTS.sizes.xs, color: COLORS.danger },
});
