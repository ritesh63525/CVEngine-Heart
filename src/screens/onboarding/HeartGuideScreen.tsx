import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {colors} from '../../theme/colors';

type Props = {
  navigation: any;
};

const HeartGuideScreen: React.FC<Props> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>
            ‹
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Heart Guide
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() =>
            navigation.navigate('GetStarted')
          }>
          <Text style={styles.skipText}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        <View style={styles.titleSection}>
          <Text style={styles.title}>
            Understand Your{' '}
            <Text style={styles.redText}>
              Vitals
            </Text>
          </Text>

          <View style={styles.titleLine} />

          <Text style={styles.subtitle}>
            Learn the basic meaning of the two key readings monitored by
            CVengine.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.heartIconWrap}>
              <Text style={styles.heartIcon}>
                ♥
              </Text>
            </View>

            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>
                Heart Rate (BPM)
              </Text>

              <Text style={styles.cardMiniTitle}>
                Beats Per Minute
              </Text>
            </View>
          </View>

          <Text style={styles.cardDescription}>
            Heart rate is the number of times your heart beats in one minute.
            It can naturally change with activity, stress, rest and other
            factors.
          </Text>

          <View style={styles.rangeBox}>
            <Text style={styles.rangeLabel}>
              Typical resting adult range
            </Text>

            <View style={styles.rangeRow}>
              <Text style={styles.rangeValue}>
                60–100
              </Text>

              <Text style={styles.rangeUnit}>
                {' '}BPM
              </Text>
            </View>
          </View>

          <Text style={styles.note}>
            A single reading should always be understood together with your
            condition and how you feel.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.oxygenIconWrap}>
              <Text style={styles.oxygenIcon}>
                O₂
              </Text>
            </View>

            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>
                SpO₂
              </Text>

              <Text style={styles.cardMiniTitle}>
                Blood Oxygen Saturation
              </Text>
            </View>
          </View>

          <Text style={styles.cardDescription}>
            SpO₂ represents the percentage of oxygen carried by your red blood
            cells. CVengine displays this reading while a valid sensor signal
            is available.
          </Text>

          <View
            style={[
              styles.rangeBox,
              styles.oxygenRangeBox,
            ]}>
            <Text style={styles.rangeLabel}>
              Common healthy reading
            </Text>

            <View style={styles.rangeRow}>
              <Text
                style={[
                  styles.rangeValue,
                  styles.blueText,
                ]}>
                95–100
              </Text>

              <Text
                style={[
                  styles.rangeUnit,
                  styles.blueText,
                ]}>
                %
              </Text>
            </View>
          </View>

          <Text style={styles.note}>
            Sensor placement, movement and circulation can affect the displayed
            value.
          </Text>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoIconWrap}>
            <Text style={styles.infoIcon}>
              i
            </Text>
          </View>

          <Text style={styles.infoText}>
            CVengine is designed for monitoring and wellness awareness. It is
            not a substitute for professional medical diagnosis or emergency
            care.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomArea}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('HealthyHabits')
          }>
          <Text style={styles.nextText}>
            Next
          </Text>

          <Text style={styles.arrow}>
            ›
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HeartGuideScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  topBar: {
    height: 56,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  backText: {
    color: colors.text,
    fontSize: 35,
    lineHeight: 38,
    fontWeight: '300',
    width: 40,
  },

  headerTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },

  skipText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 20,
  },

  titleSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 18,
  },

  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
  },

  redText: {
    color: colors.primary,
  },

  titleLine: {
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 10,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 13,
    paddingHorizontal: 15,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 16,

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heartIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  heartIcon: {
    color: colors.primary,
    fontSize: 27,
  },

  oxygenIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: colors.oxygenSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  oxygenIcon: {
    color: colors.oxygen,
    fontSize: 20,
    fontWeight: '900',
  },

  cardHeaderText: {
    flex: 1,
  },

  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },

  cardMiniTitle: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 3,
    fontWeight: '600',
  },

  cardDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 16,
  },

  rangeBox: {
    backgroundColor: colors.primarySoft,
    borderRadius: 17,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 16,
  },

  oxygenRangeBox: {
    backgroundColor: colors.oxygenSoft,
  },

  rangeLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },

  rangeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },

  rangeValue: {
    color: colors.primary,
    fontSize: 27,
    fontWeight: '900',
  },

  rangeUnit: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },

  blueText: {
    color: colors.oxygen,
  },

  note: {
    color: colors.textLight,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 12,
  },

  infoBox: {
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  infoIconWrap: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  infoIcon: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
  },

  infoText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 11.5,
    lineHeight: 17,
  },

  bottomArea: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 10,
    backgroundColor: colors.background,
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.borderDark,
    marginHorizontal: 5,
  },

  activeDot: {
    width: 20,
    backgroundColor: colors.primary,
  },

  nextButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  nextText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },

  arrow: {
    color: colors.white,
    fontSize: 27,
    marginLeft: 8,
    marginTop: -2,
  },
});