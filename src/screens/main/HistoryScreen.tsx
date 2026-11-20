import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Pressable,
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

// ==========================================
// TYPES
// ==========================================

type Reading = {
  reading_id: number;
  session_id: number | null;
  heart_rate: number;
  spo2: number;
  recorded_at: string;
};

type Filter =
  | 'all'
  | 'today'
  | '7days';

// ==========================================
// HISTORY SCREEN
// ==========================================

export default function HistoryScreen() {
  const [
    readings,
    setReadings,
  ] = useState<Reading[]>([]);

  const [
    filter,
    setFilter,
  ] = useState<Filter>('all');

  const [
    loading,
    setLoading,
  ] = useState(true);

  // ========================================
  // LOAD DATABASE READINGS
  // ========================================

  const loadReadings =
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
          'Unable to load history:',
          error,
        );

        setReadings([]);
      } finally {
        setLoading(false);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      void loadReadings();
    }, [loadReadings]),
  );

  // ========================================
  // FILTER READINGS
  // ========================================

  function filteredReadings() {
    if (filter === 'all') {
      return readings;
    }

    const now =
      new Date();

    if (filter === 'today') {
      return readings.filter(item => {
        const date =
          new Date(
            item.recorded_at,
          );

        return (
          date.getDate() ===
            now.getDate() &&
          date.getMonth() ===
            now.getMonth() &&
          date.getFullYear() ===
            now.getFullYear()
        );
      });
    }

    const sevenDaysAgo =
      new Date();

    sevenDaysAgo.setDate(
      sevenDaysAgo.getDate() - 7,
    );

    return readings.filter(
      item =>
        new Date(
          item.recorded_at,
        ) >= sevenDaysAgo,
    );
  }

  // ========================================
  // FORMAT DATE
  // ========================================

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

  function formatTime(
    value: string,
  ) {
    const date =
      new Date(value);

    return date.toLocaleTimeString(
      [],
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    );
  }

  // ========================================
  // SUMMARY VALUES
  // ========================================

  const visibleReadings =
    filteredReadings();

  const latestReading =
    visibleReadings.length > 0
      ? visibleReadings[0]
      : null;

  // ========================================
  // SCREEN
  // ========================================

  return (
    <ScreenContainer>

      {/* =====================================
          HEADER
      ====================================== */}

      <AppHeader
        title="Reading History"
        subtitle="Your saved health readings"
      />

      {/* =====================================
          HERO
      ====================================== */}

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
              HEALTH HISTORY
            </Text>

            <Text style={styles.heroTitle}>
              Your Monitoring Records
            </Text>

            <Text style={styles.heroDescription}>
              Review BPM and blood oxygen
              readings saved during your
              monitoring sessions.
            </Text>

          </View>

        </View>

        <View style={styles.heroDivider} />

        <View style={styles.heroStats}>

          <View style={styles.heroStat}>

            <Text style={styles.heroStatLabel}>
              Saved Readings
            </Text>

            <Text style={styles.heroStatValue}>
              {readings.length}
            </Text>

          </View>

          <View style={styles.heroStatDivider} />

          <View style={styles.heroStat}>

            <Text style={styles.heroStatLabel}>
              Current View
            </Text>

            <Text style={styles.heroStatValue}>
              {visibleReadings.length}
            </Text>

          </View>

        </View>

      </View>

      {/* =====================================
          FILTER TITLE
      ====================================== */}

      <View style={styles.sectionHeader}>

        <View>
          <Text style={styles.sectionTitle}>
            Reading Timeline
          </Text>

          <Text style={styles.sectionSubtitle}>
            Select a time period
          </Text>
        </View>

        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeText}>
            {visibleReadings.length}{' '}
            {visibleReadings.length === 1
              ? 'READING'
              : 'READINGS'}
          </Text>
        </View>

      </View>

      {/* =====================================
          FILTERS
      ====================================== */}

      <View style={styles.filters}>

        <FilterButton
          title="All"
          selected={
            filter === 'all'
          }
          onPress={() =>
            setFilter('all')
          }
        />

        <FilterButton
          title="Today"
          selected={
            filter === 'today'
          }
          onPress={() =>
            setFilter('today')
          }
        />

        <FilterButton
          title="7 Days"
          selected={
            filter === '7days'
          }
          onPress={() =>
            setFilter('7days')
          }
        />

      </View>

      {/* =====================================
          LATEST READING SUMMARY
      ====================================== */}

      {!loading &&
      latestReading ? (
        <View style={styles.latestCard}>

          <View style={styles.latestHeader}>

            <View>

              <Text style={styles.latestLabel}>
                LATEST IN CURRENT VIEW
              </Text>

              <Text style={styles.latestDate}>
                {formatDate(
                  latestReading.recorded_at,
                )}
              </Text>

            </View>

            <View style={styles.latestTimeBadge}>
              <Text style={styles.latestTime}>
                {formatTime(
                  latestReading.recorded_at,
                )}
              </Text>
            </View>

          </View>

          <View style={styles.latestValues}>

            <View style={styles.latestMetric}>

              <View style={styles.heartIconBox}>
                <Text style={styles.heartIcon}>
                  ♥
                </Text>
              </View>

              <View>

                <Text style={styles.metricLabel}>
                  Heart Rate
                </Text>

                <View style={styles.metricValueRow}>

                  <Text style={styles.latestHeartValue}>
                    {latestReading.heart_rate}
                  </Text>

                  <Text style={styles.metricUnit}>
                    BPM
                  </Text>

                </View>

              </View>

            </View>

            <View style={styles.latestMetric}>

              <View style={styles.oxygenIconBox}>
                <Text style={styles.oxygenIcon}>
                  O₂
                </Text>
              </View>

              <View>

                <Text style={styles.metricLabel}>
                  Blood Oxygen
                </Text>

                <View style={styles.metricValueRow}>

                  <Text style={styles.latestOxygenValue}>
                    {latestReading.spo2}
                  </Text>

                  <Text style={styles.metricUnit}>
                    %
                  </Text>

                </View>

              </View>

            </View>

          </View>

        </View>
      ) : null}

      {/* =====================================
          LOADING
      ====================================== */}

      {loading ? (
        <View style={styles.loadingCard}>

          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.loadingTitle}>
            Loading Health History
          </Text>

          <Text style={styles.loadingText}>
            Retrieving saved readings...
          </Text>

        </View>
      ) : visibleReadings.length === 0 ? (

        /* ===================================
           EMPTY STATE
        ==================================== */

        <EmptyState
          title="No readings yet"
          message="Start a monitoring session to save your heart rate and SpO₂ readings."
        />

      ) : (

        /* ===================================
           READING LIST
        ==================================== */

        visibleReadings.map(
          (reading, index) => (
            <View
              key={
                reading.reading_id
              }
              style={styles.card}>

              {/* CARD HEADER */}

              <View style={styles.cardHeader}>

                <View style={styles.dateArea}>

                  <View style={styles.timelineDot} />

                  <View>

                    <Text style={styles.date}>
                      {formatDate(
                        reading.recorded_at,
                      )}
                    </Text>

                    <Text style={styles.time}>
                      {formatTime(
                        reading.recorded_at,
                      )}
                    </Text>

                  </View>

                </View>

                <View style={styles.sessionBadge}>

                  <Text style={styles.session}>
                    {reading.session_id
                      ? `Session #${reading.session_id}`
                      : 'Reading'}
                  </Text>

                </View>

              </View>

              <View style={styles.cardDivider} />

              {/* VALUES */}

              <View style={styles.values}>

                {/* HEART RATE */}

                <View style={styles.valueBox}>

                  <View style={styles.valueIconHeart}>
                    <Text style={styles.cardHeartIcon}>
                      ♥
                    </Text>
                  </View>

                  <Text style={styles.valueLabel}>
                    Heart Rate
                  </Text>

                  <View style={styles.valueRow}>

                    <Text style={styles.heartValue}>
                      {reading.heart_rate}
                    </Text>

                    <Text style={styles.unit}>
                      BPM
                    </Text>

                  </View>

                </View>

                <View style={styles.verticalLine} />

                {/* OXYGEN */}

                <View style={styles.valueBox}>

                  <View style={styles.valueIconOxygen}>
                    <Text style={styles.cardOxygenIcon}>
                      O₂
                    </Text>
                  </View>

                  <Text style={styles.valueLabel}>
                    Blood Oxygen
                  </Text>

                  <View style={styles.valueRow}>

                    <Text style={styles.oxygenValue}>
                      {reading.spo2}
                    </Text>

                    <Text style={styles.unit}>
                      %
                    </Text>

                  </View>

                </View>

              </View>

              {/* FOOTER */}

              <View style={styles.cardFooter}>

                <View style={styles.savedDot} />

                <Text style={styles.savedText}>
                  Saved health reading
                </Text>

                {index === 0 ? (
                  <View style={styles.newestBadge}>
                    <Text style={styles.newestText}>
                      LATEST
                    </Text>
                  </View>
                ) : null}

              </View>

            </View>
          ),
        )
      )}

      {/* =====================================
          DATABASE NOTE
      ====================================== */}

      <View style={styles.noteCard}>

        <View style={styles.noteIcon}>

          <Text style={styles.noteCheck}>
            ✓
          </Text>

        </View>

        <View style={styles.noteContent}>

          <Text style={styles.noteTitle}>
            Monitoring History
          </Text>

          <Text style={styles.note}>
            Only valid readings recorded while
            monitoring is active are stored
            and displayed here.
          </Text>

        </View>

      </View>

      {/* =====================================
          FOOTER
      ====================================== */}

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
// FILTER BUTTON
// ==========================================

function FilterButton({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.filterButton,

        selected &&
          styles.filterSelected,

        pressed &&
          styles.filterPressed,
      ]}>

      <Text
        style={[
          styles.filterText,

          selected &&
            styles.filterTextSelected,
        ]}>
        {title}
      </Text>

    </Pressable>
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

      marginBottom: 23,

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

      fontSize: 27,

      lineHeight: 31,
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

      fontSize: 16,

      fontWeight: '900',

      marginTop: 3,
    },

    heroDescription: {
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

    heroStats: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    heroStat: {
      flex: 1,

      alignItems: 'center',
    },

    heroStatDivider: {
      width: 1,

      height: 35,

      backgroundColor:
        'rgba(255,255,255,0.18)',
    },

    heroStatLabel: {
      color:
        'rgba(255,255,255,0.65)',

      fontSize: 8,
    },

    heroStatValue: {
      color:
        colors.white,

      fontSize: 21,

      fontWeight: '900',

      marginTop: 3,
    },

    // ========================================
    // SECTION
    // ========================================

    sectionHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      marginBottom: 11,
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

    totalBadge: {
      backgroundColor:
        colors.primarySoft,

      borderRadius: 10,

      paddingHorizontal: 8,

      paddingVertical: 5,
    },

    totalBadgeText: {
      color:
        colors.primary,

      fontSize: 7,

      fontWeight: '900',
    },

    // ========================================
    // FILTERS
    // ========================================

    filters: {
      flexDirection: 'row',

      marginBottom: 17,

      gap: 8,
    },

    filterButton: {
      flex: 1,

      minHeight: 42,

      alignItems: 'center',

      justifyContent: 'center',

      borderRadius: 13,

      borderWidth: 1,

      borderColor:
        colors.border,

      backgroundColor:
        colors.white,
    },

    filterSelected: {
      backgroundColor:
        colors.primary,

      borderColor:
        colors.primary,
    },

    filterPressed: {
      opacity: 0.82,
    },

    filterText: {
      color:
        colors.textSecondary,

      fontSize: 11,

      fontWeight: '700',
    },

    filterTextSelected: {
      color:
        colors.white,

      fontWeight: '900',
    },

    // ========================================
    // LATEST CARD
    // ========================================

    latestCard: {
      backgroundColor:
        colors.white,

      borderRadius: 20,

      padding: 15,

      borderWidth: 1,

      borderColor:
        colors.border,

      marginBottom: 16,

      shadowColor:
        colors.shadow,

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.04,

      shadowRadius: 8,

      elevation: 1,
    },

    latestHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      marginBottom: 14,
    },

    latestLabel: {
      color:
        colors.textLight,

      fontSize: 7,

      fontWeight: '900',

      letterSpacing: 0.7,
    },

    latestDate: {
      color:
        colors.text,

      fontSize: 12,

      fontWeight: '900',

      marginTop: 3,
    },

    latestTimeBadge: {
      backgroundColor:
        colors.infoSoft,

      borderRadius: 10,

      paddingHorizontal: 9,

      paddingVertical: 6,
    },

    latestTime: {
      color:
        colors.oxygen,

      fontSize: 8,

      fontWeight: '800',
    },

    latestValues: {
      flexDirection: 'row',

      gap: 10,
    },

    latestMetric: {
      flex: 1,

      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.background,

      borderRadius: 14,

      padding: 10,
    },

    heartIconBox: {
      width: 36,
      height: 36,

      borderRadius: 11,

      backgroundColor:
        colors.primarySoft,

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 8,
    },

    oxygenIconBox: {
      width: 36,
      height: 36,

      borderRadius: 11,

      backgroundColor:
        colors.oxygenSoft,

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 8,
    },

    heartIcon: {
      color:
        colors.primary,

      fontSize: 19,
    },

    oxygenIcon: {
      color:
        colors.oxygen,

      fontSize: 13,

      fontWeight: '900',
    },

    metricLabel: {
      color:
        colors.textSecondary,

      fontSize: 7,
    },

    metricValueRow: {
      flexDirection: 'row',

      alignItems: 'baseline',

      marginTop: 1,
    },

    latestHeartValue: {
      color:
        colors.primary,

      fontSize: 18,

      fontWeight: '900',
    },

    latestOxygenValue: {
      color:
        colors.oxygen,

      fontSize: 18,

      fontWeight: '900',
    },

    metricUnit: {
      color:
        colors.textLight,

      fontSize: 7,

      fontWeight: '700',

      marginLeft: 3,
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

      padding: 30,

      marginTop: 4,

      marginBottom: 17,
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
    // READING CARD
    // ========================================

    card: {
      backgroundColor:
        colors.white,

      borderRadius: 20,

      padding: 15,

      borderWidth: 1,

      borderColor:
        colors.border,

      marginBottom: 12,

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

    cardHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },

    dateArea: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    timelineDot: {
      width: 8,
      height: 8,

      borderRadius: 4,

      backgroundColor:
        colors.primary,

      marginRight: 9,
    },

    date: {
      color:
        colors.text,

      fontSize: 12,

      fontWeight: '900',
    },

    time: {
      color:
        colors.textSecondary,

      fontSize: 9,

      marginTop: 2,
    },

    sessionBadge: {
      backgroundColor:
        colors.background,

      borderRadius: 9,

      paddingHorizontal: 8,

      paddingVertical: 5,
    },

    session: {
      color:
        colors.textSecondary,

      fontSize: 7,

      fontWeight: '700',
    },

    cardDivider: {
      height: 1,

      backgroundColor:
        colors.border,

      marginVertical: 13,
    },

    // ========================================
    // VALUES
    // ========================================

    values: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    valueBox: {
      flex: 1,

      alignItems: 'center',
    },

    valueIconHeart: {
      width: 34,
      height: 34,

      borderRadius: 11,

      backgroundColor:
        colors.primarySoft,

      justifyContent: 'center',

      alignItems: 'center',

      marginBottom: 6,
    },

    valueIconOxygen: {
      width: 34,
      height: 34,

      borderRadius: 11,

      backgroundColor:
        colors.oxygenSoft,

      justifyContent: 'center',

      alignItems: 'center',

      marginBottom: 6,
    },

    cardHeartIcon: {
      color:
        colors.primary,

      fontSize: 18,
    },

    cardOxygenIcon: {
      color:
        colors.oxygen,

      fontSize: 12,

      fontWeight: '900',
    },

    valueLabel: {
      color:
        colors.textSecondary,

      fontSize: 8,

      fontWeight: '600',
    },

    valueRow: {
      flexDirection: 'row',

      alignItems: 'baseline',

      marginTop: 3,
    },

    heartValue: {
      color:
        colors.primary,

      fontSize: 25,

      fontWeight: '900',
    },

    oxygenValue: {
      color:
        colors.oxygen,

      fontSize: 25,

      fontWeight: '900',
    },

    unit: {
      color:
        colors.textSecondary,

      fontSize: 8,

      fontWeight: '700',

      marginLeft: 4,
    },

    verticalLine: {
      width: 1,

      height: 76,

      backgroundColor:
        colors.border,
    },

    // ========================================
    // CARD FOOTER
    // ========================================

    cardFooter: {
      flexDirection: 'row',

      alignItems: 'center',

      borderTopWidth: 1,

      borderTopColor:
        colors.border,

      marginTop: 13,

      paddingTop: 10,
    },

    savedDot: {
      width: 5,
      height: 5,

      borderRadius: 3,

      backgroundColor:
        colors.success,

      marginRight: 6,
    },

    savedText: {
      flex: 1,

      color:
        colors.textLight,

      fontSize: 7,
    },

    newestBadge: {
      backgroundColor:
        colors.successSoft,

      borderRadius: 8,

      paddingHorizontal: 6,

      paddingVertical: 3,
    },

    newestText: {
      color:
        colors.success,

      fontSize: 6,

      fontWeight: '900',
    },

    // ========================================
    // NOTE
    // ========================================

    noteCard: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.infoSoft,

      borderRadius: 17,

      borderWidth: 1,

      borderColor:
        '#D9E9FF',

      padding: 13,

      marginTop: 7,
    },

    noteIcon: {
      width: 34,
      height: 34,

      borderRadius: 11,

      backgroundColor:
        colors.white,

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 10,
    },

    noteCheck: {
      color:
        colors.oxygen,

      fontSize: 14,

      fontWeight: '900',
    },

    noteContent: {
      flex: 1,
    },

    noteTitle: {
      color:
        colors.text,

      fontSize: 10,

      fontWeight: '900',
    },

    note: {
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