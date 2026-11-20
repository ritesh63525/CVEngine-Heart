import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import ScreenContainer
  from '../../components/ScreenContainer';

import AppHeader
  from '../../components/AppHeader';

import EmptyState
  from '../../components/EmptyState';

import {
  getReadings,
} from '../../db/database';

import {
  colors,
} from '../../theme/colors';

type Reading = {
  reading_id: number;
  heart_rate: number;
  spo2: number;
  recorded_at: string;
};

export default function ReportsScreen() {
  const [
    readings,
    setReadings,
  ] = useState<Reading[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  // ==========================================
  // LOAD REPORT DATA
  // ==========================================

  const loadReport =
    useCallback(async () => {
      try {
        setLoading(true);

        const data =
          await getReadings();

        setReadings(
          data as unknown as Reading[],
        );
      } catch (error) {
        console.warn(
          'Unable to load report:',
          error,
        );

        setReadings([]);
      } finally {
        setLoading(false);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      void loadReport();
    }, [loadReport]),
  );

  // ==========================================
  // CLEAN NUMERIC VALUES
  // ==========================================

  const heartRates =
    readings
      .map(item =>
        Number(item.heart_rate),
      )
      .filter(value =>
        Number.isFinite(value),
      );

  const oxygenValues =
    readings
      .map(item =>
        Number(item.spo2),
      )
      .filter(value =>
        Number.isFinite(value),
      );

  // ==========================================
  // HELPERS
  // ==========================================

  const average = (
    values: number[],
  ) => {
    if (!values.length) {
      return null;
    }

    return (
      values.reduce(
        (total, value) =>
          total + value,
        0,
      ) / values.length
    );
  };

  const avgBpm =
    average(heartRates);

  const avgSpo2 =
    average(oxygenValues);

  const minBpm =
    heartRates.length
      ? Math.min(...heartRates)
      : null;

  const maxBpm =
    heartRates.length
      ? Math.max(...heartRates)
      : null;

  const minSpo2 =
    oxygenValues.length
      ? Math.min(...oxygenValues)
      : null;

  const maxSpo2 =
    oxygenValues.length
      ? Math.max(...oxygenValues)
      : null;

  // ==========================================
  // LATEST READING
  // ==========================================

  const latestReading =
    readings.length > 0
      ? readings[0]
      : null;

  function formatDate(
    value: string,
  ) {
    const date =
      new Date(value);

    return date.toLocaleDateString(
      [],
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    );
  }

  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <ScreenContainer>

      <AppHeader
        title="Health Reports"
        subtitle="Monitoring insights & statistics"
      />

      {/* ======================================
          REPORT HERO
      ======================================= */}

      <View style={styles.heroCard}>

        <View style={styles.heroTop}>

          <View style={styles.heroIconOuter}>

            <View style={styles.heroIcon}>
              <Text style={styles.heroHeart}>
                ♥
              </Text>
            </View>

          </View>

          <View style={styles.heroContent}>

            <Text style={styles.heroLabel}>
              HEALTH REPORT
            </Text>

            <Text style={styles.heroTitle}>
              Monitoring Overview
            </Text>

            <Text style={styles.heroText}>
              A summary of your saved heart
              rate and blood oxygen readings.
            </Text>

          </View>

        </View>

        <View style={styles.heroDivider} />

        <View style={styles.heroBottom}>

          <View>

            <Text style={styles.heroBottomLabel}>
              TOTAL SAVED READINGS
            </Text>

            <Text style={styles.heroTotal}>
              {loading
                ? '--'
                : readings.length}
            </Text>

          </View>

          <View style={styles.heroStatus}>

            <View style={styles.heroStatusDot} />

            <Text style={styles.heroStatusText}>
              LOCAL DATA
            </Text>

          </View>

        </View>

      </View>

      {/* ======================================
          LOADING
      ======================================= */}

      {loading ? (
        <View style={styles.loadingCard}>

          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.loadingTitle}>
            Preparing Health Report
          </Text>

          <Text style={styles.loadingText}>
            Calculating your monitoring
            statistics...
          </Text>

        </View>
      ) : readings.length === 0 ? (

        <EmptyState
          title="No report available"
          message="Complete a monitoring session first. Your saved readings will be summarized here."
        />

      ) : (
        <>

          {/* ==================================
              SUMMARY
          =================================== */}

          <View style={styles.sectionHeader}>

            <View>

              <Text style={styles.sectionTitle}>
                Health Summary
              </Text>

              <Text style={styles.sectionSubtitle}>
                Based on saved sensor readings
              </Text>

            </View>

            <View style={styles.readingsBadge}>
              <Text style={styles.readingsBadgeText}>
                {readings.length}{' '}
                {readings.length === 1
                  ? 'READING'
                  : 'READINGS'}
              </Text>
            </View>

          </View>

          {/* ==================================
              AVERAGE SUMMARY
          =================================== */}

          <View style={styles.averageRow}>

            <View style={styles.averageHeartCard}>

              <View style={styles.averageIconHeart}>
                <Text style={styles.averageHeartIcon}>
                  ♥
                </Text>
              </View>

              <Text style={styles.averageLabel}>
                AVG HEART RATE
              </Text>

              <View style={styles.averageValueRow}>

                <Text style={styles.averageHeartValue}>
                  {avgBpm !== null
                    ? avgBpm.toFixed(1)
                    : '--'}
                </Text>

                <Text style={styles.averageUnit}>
                  BPM
                </Text>

              </View>

              <Text style={styles.averageDescription}>
                Average recorded pulse
              </Text>

            </View>

            <View style={styles.averageOxygenCard}>

              <View style={styles.averageIconOxygen}>
                <Text style={styles.averageOxygenIcon}>
                  O₂
                </Text>
              </View>

              <Text style={styles.averageLabel}>
                AVG BLOOD OXYGEN
              </Text>

              <View style={styles.averageValueRow}>

                <Text style={styles.averageOxygenValue}>
                  {avgSpo2 !== null
                    ? avgSpo2.toFixed(1)
                    : '--'}
                </Text>

                <Text style={styles.averageUnit}>
                  %
                </Text>

              </View>

              <Text style={styles.averageDescription}>
                Average recorded SpO₂
              </Text>

            </View>

          </View>

          {/* ==================================
              HEART RATE REPORT
          =================================== */}

          <View style={styles.reportCard}>

            <View style={styles.reportHeader}>

              <View style={styles.reportTitleArea}>

                <View style={styles.heartIconBox}>
                  <Text style={styles.heart}>
                    ♥
                  </Text>
                </View>

                <View>

                  <Text style={styles.reportLabel}>
                    HEART METRIC
                  </Text>

                  <Text style={styles.cardTitle}>
                    Heart Rate
                  </Text>

                </View>

              </View>

              <View style={styles.bpmBadge}>
                <Text style={styles.bpmBadgeText}>
                  BPM
                </Text>
              </View>

            </View>

            <View style={styles.divider} />

            <View style={styles.row}>

              <ReportValue
                label="Average"
                value={
                  avgBpm !== null
                    ? avgBpm.toFixed(1)
                    : '--'
                }
                unit="BPM"
                type="heart"
              />

              <View style={styles.verticalDivider} />

              <ReportValue
                label="Minimum"
                value={
                  minBpm !== null
                    ? minBpm.toString()
                    : '--'
                }
                unit="BPM"
                type="neutral"
              />

              <View style={styles.verticalDivider} />

              <ReportValue
                label="Maximum"
                value={
                  maxBpm !== null
                    ? maxBpm.toString()
                    : '--'
                }
                unit="BPM"
                type="neutral"
              />

            </View>

          </View>

          {/* ==================================
              OXYGEN REPORT
          =================================== */}

          <View style={styles.reportCard}>

            <View style={styles.reportHeader}>

              <View style={styles.reportTitleArea}>

                <View style={styles.oxygenIconBox}>
                  <Text style={styles.oxygen}>
                    O₂
                  </Text>
                </View>

                <View>

                  <Text style={styles.reportLabel}>
                    OXYGEN METRIC
                  </Text>

                  <Text style={styles.cardTitle}>
                    Blood Oxygen
                  </Text>

                </View>

              </View>

              <View style={styles.oxygenBadge}>
                <Text style={styles.oxygenBadgeText}>
                  SpO₂
                </Text>
              </View>

            </View>

            <View style={styles.divider} />

            <View style={styles.row}>

              <ReportValue
                label="Average"
                value={
                  avgSpo2 !== null
                    ? avgSpo2.toFixed(1)
                    : '--'
                }
                unit="%"
                type="oxygen"
              />

              <View style={styles.verticalDivider} />

              <ReportValue
                label="Minimum"
                value={
                  minSpo2 !== null
                    ? minSpo2.toString()
                    : '--'
                }
                unit="%"
                type="neutral"
              />

              <View style={styles.verticalDivider} />

              <ReportValue
                label="Maximum"
                value={
                  maxSpo2 !== null
                    ? maxSpo2.toString()
                    : '--'
                }
                unit="%"
                type="neutral"
              />

            </View>

          </View>

          {/* ==================================
              LATEST DATA
          =================================== */}

          {latestReading ? (
            <View style={styles.latestCard}>

              <View style={styles.latestIcon}>
                <Text style={styles.latestIconText}>
                  ✓
                </Text>
              </View>

              <View style={styles.latestContent}>

                <Text style={styles.latestTitle}>
                  Latest Data Included
                </Text>

                <Text style={styles.latestText}>
                  Most recent saved reading
                  {' • '}
                  {formatDate(
                    latestReading.recorded_at,
                  )}
                </Text>

              </View>

            </View>
          ) : null}

          {/* ==================================
              REPORT INFORMATION
          =================================== */}

          <View style={styles.infoCard}>

            <View style={styles.infoIcon}>
              <Text style={styles.infoIconText}>
                i
              </Text>
            </View>

            <View style={styles.infoContent}>

              <Text style={styles.infoTitle}>
                About this report
              </Text>

              <Text style={styles.infoText}>
                These statistics are calculated
                only from valid sensor readings
                saved during monitoring
                sessions. No dummy readings are
                used in this report.
              </Text>

            </View>

          </View>

        </>
      )}

      {/* ======================================
          DISCLAIMER
      ======================================= */}

      <View style={styles.disclaimerCard}>

        <View style={styles.disclaimerIcon}>
          <Text style={styles.disclaimerSymbol}>
            !
          </Text>
        </View>

        <View style={styles.disclaimerContent}>

          <Text style={styles.disclaimerTitle}>
            Medical Disclaimer
          </Text>

          <Text style={styles.disclaimer}>
            This report summarizes sensor
            measurements and is not a medical
            diagnosis or emergency assessment.
          </Text>

        </View>

      </View>

      {/* ======================================
          FOOTER
      ======================================= */}

      <Text style={styles.footer}>
        HEART MONITOR
        {'  '}
        <Text style={styles.footerCompany}>
          by CVengine
        </Text>
      </Text>

    </ScreenContainer>
  );
}

// ==========================================
// REPORT VALUE
// ==========================================

function ReportValue({
  label,
  value,
  unit,
  type,
}: {
  label: string;
  value: string;
  unit: string;
  type:
    | 'heart'
    | 'oxygen'
    | 'neutral';
}) {
  return (
    <View style={styles.valueBox}>

      <Text style={styles.valueLabel}>
        {label}
      </Text>

      <Text
        style={[
          styles.value,

          type === 'heart' &&
            styles.heartValue,

          type === 'oxygen' &&
            styles.oxygenValue,
        ]}>
        {value}
      </Text>

      <Text style={styles.unit}>
        {unit}
      </Text>

    </View>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles =
  StyleSheet.create({
    // ========================================
    // HERO
    // ========================================

    heroCard: {
      backgroundColor:
        colors.primary,

      borderRadius: 24,

      padding: 18,

      marginBottom: 22,

      shadowColor:
        colors.primaryDark,

      shadowOffset: {
        width: 0,
        height: 6,
      },

      shadowOpacity: 0.16,

      shadowRadius: 10,

      elevation: 4,
    },

    heroTop: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    heroIconOuter: {
      width: 62,
      height: 62,

      borderRadius: 20,

      backgroundColor:
        'rgba(255,255,255,0.16)',

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 13,
    },

    heroIcon: {
      width: 48,
      height: 48,

      borderRadius: 15,

      backgroundColor:
        colors.white,

      justifyContent: 'center',

      alignItems: 'center',
    },

    heroHeart: {
      color:
        colors.primary,

      fontSize: 28,

      lineHeight: 32,
    },

    heroContent: {
      flex: 1,
    },

    heroLabel: {
      color:
        'rgba(255,255,255,0.70)',

      fontSize: 7,

      fontWeight: '900',

      letterSpacing: 1,
    },

    heroTitle: {
      color:
        colors.white,

      fontSize: 17,

      fontWeight: '900',

      marginTop: 3,
    },

    heroText: {
      color:
        'rgba(255,255,255,0.78)',

      fontSize: 9,

      lineHeight: 14,

      marginTop: 4,
    },

    heroDivider: {
      height: 1,

      backgroundColor:
        'rgba(255,255,255,0.18)',

      marginVertical: 15,
    },

    heroBottom: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'flex-end',
    },

    heroBottomLabel: {
      color:
        'rgba(255,255,255,0.65)',

      fontSize: 7,

      fontWeight: '800',

      letterSpacing: 0.6,
    },

    heroTotal: {
      color:
        colors.white,

      fontSize: 27,

      fontWeight: '900',

      marginTop: 2,
    },

    heroStatus: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        'rgba(255,255,255,0.16)',

      borderRadius: 12,

      paddingHorizontal: 9,

      paddingVertical: 6,
    },

    heroStatusDot: {
      width: 6,
      height: 6,

      borderRadius: 3,

      backgroundColor:
        colors.white,

      marginRight: 5,
    },

    heroStatusText: {
      color:
        colors.white,

      fontSize: 7,

      fontWeight: '900',
    },

    // ========================================
    // LOADING
    // ========================================

    loadingCard: {
      alignItems: 'center',

      backgroundColor:
        colors.white,

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        colors.border,

      padding: 32,

      marginBottom: 18,
    },

    loadingTitle: {
      color:
        colors.text,

      fontSize: 13,

      fontWeight: '900',

      marginTop: 13,
    },

    loadingText: {
      color:
        colors.textSecondary,

      fontSize: 9,

      marginTop: 4,
    },

    // ========================================
    // SECTION
    // ========================================

    sectionHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      marginBottom: 12,
    },

    sectionTitle: {
      color:
        colors.text,

      fontSize: 16,

      fontWeight: '900',
    },

    sectionSubtitle: {
      color:
        colors.textLight,

      fontSize: 8,

      marginTop: 2,
    },

    readingsBadge: {
      backgroundColor:
        colors.primarySoft,

      borderRadius: 10,

      paddingHorizontal: 8,

      paddingVertical: 5,
    },

    readingsBadgeText: {
      color:
        colors.primary,

      fontSize: 7,

      fontWeight: '900',
    },

    // ========================================
    // AVERAGE CARDS
    // ========================================

    averageRow: {
      flexDirection: 'row',

      gap: 10,

      marginBottom: 14,
    },

    averageHeartCard: {
      flex: 1,

      backgroundColor:
        colors.white,

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: 19,

      padding: 14,
    },

    averageOxygenCard: {
      flex: 1,

      backgroundColor:
        colors.white,

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: 19,

      padding: 14,
    },

    averageIconHeart: {
      width: 36,
      height: 36,

      borderRadius: 11,

      backgroundColor:
        colors.primarySoft,

      justifyContent: 'center',

      alignItems: 'center',

      marginBottom: 10,
    },

    averageIconOxygen: {
      width: 36,
      height: 36,

      borderRadius: 11,

      backgroundColor:
        colors.oxygenSoft,

      justifyContent: 'center',

      alignItems: 'center',

      marginBottom: 10,
    },

    averageHeartIcon: {
      color:
        colors.primary,

      fontSize: 19,
    },

    averageOxygenIcon: {
      color:
        colors.oxygen,

      fontSize: 13,

      fontWeight: '900',
    },

    averageLabel: {
      color:
        colors.textLight,

      fontSize: 7,

      fontWeight: '900',

      letterSpacing: 0.4,
    },

    averageValueRow: {
      flexDirection: 'row',

      alignItems: 'baseline',

      marginTop: 3,
    },

    averageHeartValue: {
      color:
        colors.primary,

      fontSize: 25,

      fontWeight: '900',
    },

    averageOxygenValue: {
      color:
        colors.oxygen,

      fontSize: 25,

      fontWeight: '900',
    },

    averageUnit: {
      color:
        colors.textSecondary,

      fontSize: 8,

      fontWeight: '700',

      marginLeft: 4,
    },

    averageDescription: {
      color:
        colors.textLight,

      fontSize: 7,

      marginTop: 3,
    },

    // ========================================
    // REPORT CARDS
    // ========================================

    reportCard: {
      backgroundColor:
        colors.white,

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        colors.border,

      padding: 16,

      marginBottom: 14,

      shadowColor:
        colors.shadow,

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.035,

      shadowRadius: 7,

      elevation: 1,
    },

    reportHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },

    reportTitleArea: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    heartIconBox: {
      width: 40,
      height: 40,

      borderRadius: 13,

      backgroundColor:
        colors.primarySoft,

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 10,
    },

    oxygenIconBox: {
      width: 40,
      height: 40,

      borderRadius: 13,

      backgroundColor:
        colors.oxygenSoft,

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 10,
    },

    heart: {
      color:
        colors.primary,

      fontSize: 21,
    },

    oxygen: {
      color:
        colors.oxygen,

      fontSize: 14,

      fontWeight: '900',
    },

    reportLabel: {
      color:
        colors.textLight,

      fontSize: 7,

      fontWeight: '800',

      letterSpacing: 0.5,
    },

    cardTitle: {
      color:
        colors.text,

      fontSize: 14,

      fontWeight: '900',

      marginTop: 2,
    },

    bpmBadge: {
      backgroundColor:
        colors.primarySoft,

      borderRadius: 9,

      paddingHorizontal: 8,

      paddingVertical: 5,
    },

    bpmBadgeText: {
      color:
        colors.primary,

      fontSize: 7,

      fontWeight: '900',
    },

    oxygenBadge: {
      backgroundColor:
        colors.oxygenSoft,

      borderRadius: 9,

      paddingHorizontal: 8,

      paddingVertical: 5,
    },

    oxygenBadgeText: {
      color:
        colors.oxygen,

      fontSize: 7,

      fontWeight: '900',
    },

    divider: {
      height: 1,

      backgroundColor:
        colors.border,

      marginVertical: 15,
    },

    row: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    valueBox: {
      flex: 1,

      alignItems: 'center',
    },

    valueLabel: {
      color:
        colors.textSecondary,

      fontSize: 8,

      fontWeight: '600',
    },

    value: {
      color:
        colors.text,

      fontSize: 21,

      fontWeight: '900',

      marginTop: 5,
    },

    heartValue: {
      color:
        colors.primary,
    },

    oxygenValue: {
      color:
        colors.oxygen,
    },

    unit: {
      color:
        colors.textLight,

      fontSize: 8,

      marginTop: 2,
    },

    verticalDivider: {
      width: 1,

      height: 50,

      backgroundColor:
        colors.border,
    },

    // ========================================
    // LATEST
    // ========================================

    latestCard: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.successSoft,

      borderRadius: 16,

      padding: 13,

      marginBottom: 12,
    },

    latestIcon: {
      width: 34,
      height: 34,

      borderRadius: 11,

      backgroundColor:
        colors.white,

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 10,
    },

    latestIconText: {
      color:
        colors.success,

      fontSize: 14,

      fontWeight: '900',
    },

    latestContent: {
      flex: 1,
    },

    latestTitle: {
      color:
        colors.text,

      fontSize: 10,

      fontWeight: '900',
    },

    latestText: {
      color:
        colors.textSecondary,

      fontSize: 8,

      marginTop: 2,
    },

    // ========================================
    // INFO
    // ========================================

    infoCard: {
      flexDirection: 'row',

      backgroundColor:
        colors.infoSoft,

      borderRadius: 17,

      borderWidth: 1,

      borderColor:
        '#D9E9FF',

      padding: 14,

      marginBottom: 12,
    },

    infoIcon: {
      width: 36,
      height: 36,

      borderRadius: 12,

      backgroundColor:
        colors.white,

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 10,
    },

    infoIconText: {
      color:
        colors.oxygen,

      fontSize: 15,

      fontWeight: '900',
    },

    infoContent: {
      flex: 1,
    },

    infoTitle: {
      color:
        colors.text,

      fontSize: 11,

      fontWeight: '900',
    },

    infoText: {
      color:
        colors.textSecondary,

      fontSize: 9,

      lineHeight: 14,

      marginTop: 3,
    },

    // ========================================
    // DISCLAIMER
    // ========================================

    disclaimerCard: {
      flexDirection: 'row',

      backgroundColor:
        colors.warningSoft,

      borderRadius: 17,

      padding: 13,

      marginTop: 2,
    },

    disclaimerIcon: {
      width: 34,
      height: 34,

      borderRadius: 11,

      backgroundColor:
        colors.white,

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 10,
    },

    disclaimerSymbol: {
      color:
        colors.warning,

      fontSize: 15,

      fontWeight: '900',
    },

    disclaimerContent: {
      flex: 1,
    },

    disclaimerTitle: {
      color:
        colors.text,

      fontSize: 10,

      fontWeight: '900',
    },

    disclaimer: {
      color:
        colors.textSecondary,

      fontSize: 8,

      lineHeight: 13,

      marginTop: 2,
    },

    // ========================================
    // FOOTER
    // ========================================

    footer: {
      color:
        colors.primary,

      textAlign: 'center',

      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 0.4,

      paddingVertical: 18,
    },

    footerCompany: {
      color:
        colors.textLight,

      fontWeight: '600',
    },
  });