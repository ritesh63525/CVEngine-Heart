import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ScreenContainer
  from '../../components/ScreenContainer';

import AppHeader
  from '../../components/AppHeader';

import AppButton
  from '../../components/AppButton';

import {colors}
  from '../../theme/colors';

type Props = {
  sessionId?: number | null;
  avgBpm?: number | null;
  minBpm?: number | null;
  maxBpm?: number | null;
  avgSpo2?: number | null;
  onDone: () => void;
};

export default function SessionSummaryScreen({
  sessionId = null,
  avgBpm = null,
  minBpm = null,
  maxBpm = null,
  avgSpo2 = null,
  onDone,
}: Props) {
  return (
    <ScreenContainer>

      <AppHeader
        title="Session Summary"
        subtitle="Your monitoring results"
      />

      {/* =====================================
          SUCCESS HERO
      ====================================== */}

      <View style={styles.heroCard}>

        <View style={styles.heroDecorationOne} />
        <View style={styles.heroDecorationTwo} />

        <View style={styles.successOuter}>
          <View style={styles.successCircle}>
            <Text style={styles.check}>
              ✓
            </Text>
          </View>
        </View>

        <Text style={styles.heroLabel}>
          SESSION COMPLETE
        </Text>

        <Text style={styles.title}>
          Monitoring Complete
        </Text>

        <Text style={styles.subtitle}>
          Your valid monitoring readings
          have been saved successfully on
          this device.
        </Text>

        <View style={styles.sessionBadge}>
          <View style={styles.sessionDot} />

          <Text style={styles.sessionText}>
            {sessionId !== null
              ? `SESSION #${sessionId}`
              : 'MONITORING SESSION'}
          </Text>
        </View>

      </View>

      {/* =====================================
          OVERVIEW
      ====================================== */}

      <View style={styles.sectionHeader}>

        <View style={styles.sectionIcon}>
          <Text style={styles.sectionHeart}>
            ♥
          </Text>
        </View>

        <View>
          <Text style={styles.sectionTitle}>
            Session Overview
          </Text>

          <Text style={styles.sectionSubtitle}>
            Summary of recorded measurements
          </Text>
        </View>

      </View>

      {/* =====================================
          HEART RATE
      ====================================== */}

      <View style={styles.heartCard}>

        <View style={styles.cardHeader}>

          <View style={styles.heartIcon}>
            <Text style={styles.heartSymbol}>
              ♥
            </Text>
          </View>

          <View style={styles.cardHeaderContent}>
            <Text style={styles.metricLabel}>
              HEART RATE
            </Text>

            <Text style={styles.cardTitle}>
              BPM Summary
            </Text>
          </View>

          <View style={styles.metricBadge}>
            <Text style={styles.metricBadgeText}>
              BPM
            </Text>
          </View>

        </View>

        <View style={styles.divider} />

        <View style={styles.row}>

          <SummaryItem
            label="AVERAGE"
            value={
              avgBpm !== null
                ? Math.round(
                    avgBpm,
                  ).toString()
                : '--'
            }
            unit="BPM"
            highlight
          />

          <View style={styles.verticalDivider} />

          <SummaryItem
            label="MINIMUM"
            value={
              minBpm !== null
                ? Math.round(
                    minBpm,
                  ).toString()
                : '--'
            }
            unit="BPM"
          />

          <View style={styles.verticalDivider} />

          <SummaryItem
            label="MAXIMUM"
            value={
              maxBpm !== null
                ? Math.round(
                    maxBpm,
                  ).toString()
                : '--'
            }
            unit="BPM"
          />

        </View>

      </View>

      {/* =====================================
          BLOOD OXYGEN
      ====================================== */}

      <View style={styles.oxygenCard}>

        <View style={styles.cardHeader}>

          <View style={styles.oxygenIcon}>
            <Text style={styles.oxygenSymbol}>
              O₂
            </Text>
          </View>

          <View style={styles.cardHeaderContent}>

            <Text style={styles.oxygenLabel}>
              BLOOD OXYGEN
            </Text>

            <Text style={styles.cardTitle}>
              SpO₂ Summary
            </Text>

          </View>

          <View style={styles.oxygenBadge}>
            <Text style={styles.oxygenBadgeText}>
              SpO₂
            </Text>
          </View>

        </View>

        <View style={styles.divider} />

        <View style={styles.oxygenContent}>

          <Text style={styles.averageLabel}>
            AVERAGE
          </Text>

          <View style={styles.oxygenValueRow}>

            <Text style={styles.oxygenValue}>
              {avgSpo2 !== null
                ? avgSpo2.toFixed(1)
                : '--'}
            </Text>

            <Text style={styles.oxygenPercent}>
              %
            </Text>

          </View>

          <Text style={styles.oxygenUnit}>
            Average Blood Oxygen
          </Text>

        </View>

      </View>

      {/* =====================================
          SAVED STATUS
      ====================================== */}

      <View style={styles.savedCard}>

        <View style={styles.savedIcon}>
          <Text style={styles.savedCheck}>
            ✓
          </Text>
        </View>

        <View style={styles.savedContent}>

          <Text style={styles.savedLabel}>
            DATA SAVED
          </Text>

          <Text style={styles.savedTitle}>
            Session Saved Successfully
          </Text>

          <Text style={styles.savedText}>
            Your valid BPM and SpO₂ readings
            are available in Reading History
            and Health Reports.
          </Text>

        </View>

      </View>

      {/* =====================================
          INFORMATION
      ====================================== */}

      <View style={styles.infoCard}>

        <View style={styles.infoIcon}>
          <Text style={styles.infoIconText}>
            i
          </Text>
        </View>

        <View style={styles.infoContent}>

          <Text style={styles.infoTitle}>
            About Your Results
          </Text>

          <Text style={styles.infoText}>
            Session values are calculated
            from valid sensor measurements
            collected during monitoring.
          </Text>

        </View>

      </View>

      {/* =====================================
          BUTTON
      ====================================== */}

      <AppButton
        title="Back to Dashboard"
        onPress={onDone}
        style={styles.doneButton}
      />

      {/* =====================================
          DISCLAIMER
      ====================================== */}

      <View style={styles.disclaimerCard}>

        <Text style={styles.disclaimerTitle}>
          MEDICAL DISCLAIMER
        </Text>

        <Text style={styles.disclaimer}>
          These measurements are intended
          for health monitoring and project
          purposes. They should not be
          treated as a medical diagnosis or
          emergency assessment.
        </Text>

      </View>

      {/* =====================================
          FOOTER
      ====================================== */}

      <View style={styles.footer}>

        <Text style={styles.footerHeart}>
          ♥
        </Text>

        <Text style={styles.footerText}>
          HEART MONITOR
        </Text>

        <Text style={styles.footerCompany}>
          by CVengine
        </Text>

      </View>

    </ScreenContainer>
  );
}

// ==========================================
// SUMMARY ITEM
// ==========================================

function SummaryItem({
  label,
  value,
  unit,
  highlight = false,
}: {
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.summaryItem}>

      <Text style={styles.itemLabel}>
        {label}
      </Text>

      <Text
        style={[
          styles.itemValue,
          highlight &&
            styles.itemValueHighlight,
        ]}>
        {value}
      </Text>

      <Text style={styles.itemUnit}>
        {unit}
      </Text>

    </View>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  // ========================================
  // HERO
  // ========================================

  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginBottom: 23,
    overflow: 'hidden',

    shadowColor: colors.primaryDark,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.16,
    shadowRadius: 9,
    elevation: 3,
  },

  heroDecorationOne: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor:
      'rgba(255,255,255,0.08)',
    right: -45,
    top: -55,
  },

  heroDecorationTwo: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor:
      'rgba(255,255,255,0.06)',
    left: -30,
    bottom: -35,
  },

  successOuter: {
    width: 75,
    height: 75,
    borderRadius: 25,
    backgroundColor:
      'rgba(255,255,255,0.17)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  successCircle: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  check: {
    color: colors.success,
    fontSize: 27,
    fontWeight: '900',
  },

  heroLabel: {
    color:
      'rgba(255,255,255,0.68)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 13,
  },

  title: {
    color: colors.white,
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 3,
  },

  subtitle: {
    color:
      'rgba(255,255,255,0.80)',
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 5,
    maxWidth: 260,
  },

  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 13,
  },

  sessionDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.white,
    marginRight: 5,
  },

  sessionText: {
    color: colors.white,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  // ========================================
  // SECTION
  // ========================================

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  sectionIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor:
      colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  sectionHeart: {
    color: colors.primary,
    fontSize: 14,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },

  sectionSubtitle: {
    color: colors.textLight,
    fontSize: 8,
    marginTop: 1,
  },

  // ========================================
  // HEART CARD
  // ========================================

  heartCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 15,
    marginBottom: 13,

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.03,
    shadowRadius: 7,
    elevation: 1,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heartIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor:
      colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  heartSymbol: {
    color: colors.primary,
    fontSize: 20,
  },

  cardHeaderContent: {
    flex: 1,
  },

  metricLabel: {
    color: colors.primary,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  cardTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 2,
  },

  metricBadge: {
    backgroundColor:
      colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },

  metricBadgeText: {
    color: colors.primary,
    fontSize: 7,
    fontWeight: '900',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },

  verticalDivider: {
    width: 1,
    height: 48,
    backgroundColor: colors.border,
  },

  itemLabel: {
    color: colors.textLight,
    fontSize: 6,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  itemValue: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 4,
  },

  itemValueHighlight: {
    color: colors.primary,
  },

  itemUnit: {
    color: colors.textSecondary,
    fontSize: 7,
    fontWeight: '700',
    marginTop: 1,
  },

  // ========================================
  // OXYGEN
  // ========================================

  oxygenCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 15,
    marginBottom: 13,
  },

  oxygenIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor:
      colors.oxygenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  oxygenSymbol: {
    color: colors.oxygen,
    fontSize: 13,
    fontWeight: '900',
  },

  oxygenLabel: {
    color: colors.oxygen,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  oxygenBadge: {
    backgroundColor:
      colors.oxygenSoft,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },

  oxygenBadgeText: {
    color: colors.oxygen,
    fontSize: 7,
    fontWeight: '900',
  },

  oxygenContent: {
    alignItems: 'center',
    paddingVertical: 3,
  },

  averageLabel: {
    color: colors.textLight,
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  oxygenValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },

  oxygenValue: {
    color: colors.oxygen,
    fontSize: 38,
    fontWeight: '900',
  },

  oxygenPercent: {
    color: colors.oxygen,
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 3,
  },

  oxygenUnit: {
    color: colors.textSecondary,
    fontSize: 8,
    marginTop: 1,
  },

  // ========================================
  // SAVED CARD
  // ========================================

  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      colors.successSoft,
    borderWidth: 1,
    borderColor: '#D2F2E2',
    borderRadius: 17,
    padding: 14,
    marginBottom: 12,
  },

  savedIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  savedCheck: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '900',
  },

  savedContent: {
    flex: 1,
  },

  savedLabel: {
    color: colors.success,
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  savedTitle: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 2,
  },

  savedText: {
    color: colors.textSecondary,
    fontSize: 8,
    lineHeight: 13,
    marginTop: 3,
  },

  // ========================================
  // INFO
  // ========================================

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      colors.oxygenSoft,
    borderWidth: 1,
    borderColor: '#D9E9FF',
    borderRadius: 17,
    padding: 13,
    marginBottom: 14,
  },

  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  infoIconText: {
    color: colors.oxygen,
    fontSize: 14,
    fontWeight: '900',
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '900',
  },

  infoText: {
    color: colors.textSecondary,
    fontSize: 8,
    lineHeight: 13,
    marginTop: 2,
  },

  doneButton: {
    marginTop: 3,
  },

  // ========================================
  // DISCLAIMER
  // ========================================

  disclaimerCard: {
    backgroundColor:
      colors.warningSoft,
    borderWidth: 1,
    borderColor: '#FDE7B2',
    borderRadius: 14,
    padding: 12,
    marginTop: 11,
  },

  disclaimerTitle: {
    color: colors.warning,
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  disclaimer: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 8,
    lineHeight: 13,
    marginTop: 4,
  },

  // ========================================
  // FOOTER
  // ========================================

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },

  footerHeart: {
    color: colors.primary,
    fontSize: 11,
    marginRight: 5,
  },

  footerText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  footerCompany: {
    color: colors.textLight,
    fontSize: 9,
    marginLeft: 5,
  },
});