// src/components/UIComponents.js
import React from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  ActivityIndicator, StyleSheet, Animated,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../utils/constants';

// ─── KPI Card ────────────────────────────────────────────────────────────────
export const KPICard = ({ label, value, icon, color = COLORS.primary, bgColor, subtitle }) => (
  <View style={[styles.kpiCard, { borderLeftColor: color }, SHADOWS.small]}>
    <View style={[styles.kpiIconBox, { backgroundColor: bgColor || color + '20' }]}>
      <Text style={styles.kpiIcon}>{icon}</Text>
    </View>
    <View style={styles.kpiContent}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={[styles.kpiValue, { color }]}>{value}</Text>
      {subtitle ? <Text style={styles.kpiSubtitle}>{subtitle}</Text> : null}
    </View>
  </View>
);

// ─── Section Header ──────────────────────────────────────────────────────────
export const SectionHeader = ({ title, action, onAction }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.sectionAction}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Input Field ─────────────────────────────────────────────────────────────
export const InputField = ({
  label, value, onChangeText, placeholder, keyboardType = 'default',
  multiline, numberOfLines, prefix, suffix, error, required,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>
      {label} {required && <Text style={{ color: COLORS.danger }}>*</Text>}
    </Text>
    <View style={[styles.inputWrapper, error && styles.inputError]}>
      {prefix ? <Text style={styles.inputPrefix}>{prefix}</Text> : null}
      <TextInput
        style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {suffix ? <Text style={styles.inputSuffix}>{suffix}</Text> : null}
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

// ─── Button ──────────────────────────────────────────────────────────────────
export const Button = ({
  title, onPress, variant = 'primary', loading, icon, disabled, style,
}) => {
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.btn,
        isOutline && styles.btnOutline,
        isDanger && styles.btnDanger,
        (disabled || loading) && styles.btnDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? COLORS.primary : COLORS.white} size="small" />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {icon ? <Text style={{ fontSize: 16 }}>{icon}</Text> : null}
          <Text style={[styles.btnText, isOutline && styles.btnTextOutline, isDanger && styles.btnTextDanger]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style, padding = SPACING.lg }) => (
  <View style={[styles.card, { padding }, SHADOWS.small, style]}>{children}</View>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
export const Badge = ({ label, color = COLORS.primary }) => (
  <View style={[styles.badge, { backgroundColor: color + '20' }]}>
    <Text style={[styles.badgeText, { color }]}>{label}</Text>
  </View>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
export const EmptyState = ({ icon = '📭', title, subtitle, action, onAction }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>{icon}</Text>
    <Text style={styles.emptyTitle}>{title}</Text>
    {subtitle ? <Text style={styles.emptySubtitle}>{subtitle}</Text> : null}
    {action && (
      <TouchableOpacity onPress={onAction} style={styles.emptyAction}>
        <Text style={styles.emptyActionText}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Divider ─────────────────────────────────────────────────────────────────
export const Divider = ({ margin = SPACING.md }) => (
  <View style={[styles.divider, { marginVertical: margin }]} />
);

// ─── Row Info ────────────────────────────────────────────────────────────────
export const RowInfo = ({ label, value, valueColor, bold }) => (
  <View style={styles.rowInfo}>
    <Text style={styles.rowInfoLabel}>{label}</Text>
    <Text style={[styles.rowInfoValue, valueColor && { color: valueColor }, bold && { fontWeight: '700' }]}>
      {value}
    </Text>
  </View>
);

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  kpiCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    marginBottom: SPACING.sm,
  },
  kpiIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  kpiIcon: { fontSize: 20 },
  kpiContent: { flex: 1 },
  kpiLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: 2 },
  kpiValue: { fontSize: FONTS.sizes.lg, fontWeight: '700' },
  kpiSubtitle: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  sectionAction: { fontSize: FONTS.sizes.sm, color: COLORS.primaryLight, fontWeight: '600' },

  inputContainer: { marginBottom: SPACING.md },
  inputLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    minHeight: 48,
  },
  inputError: { borderColor: COLORS.danger },
  input: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.textPrimary, paddingVertical: SPACING.sm },
  inputPrefix: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, marginRight: SPACING.sm },
  inputSuffix: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, marginLeft: SPACING.sm },
  errorText: { fontSize: FONTS.sizes.xs, color: COLORS.danger, marginTop: 4 },

  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  btnDanger: { backgroundColor: COLORS.danger },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
  btnTextOutline: { color: COLORS.primary },
  btnTextDanger: { color: COLORS.white },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },

  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  badgeText: { fontSize: FONTS.sizes.xs, fontWeight: '600' },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  emptyIcon: { fontSize: 56, marginBottom: SPACING.lg },
  emptyTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
  emptySubtitle: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.sm, paddingHorizontal: SPACING.xl },
  emptyAction: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
  },
  emptyActionText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },

  divider: { height: 1, backgroundColor: COLORS.border },

  rowInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  rowInfoLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  rowInfoValue: { fontSize: FONTS.sizes.sm, color: COLORS.textPrimary, fontWeight: '600' },
});
