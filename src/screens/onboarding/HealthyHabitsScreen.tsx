import React from 'react';
import {
  SafeAreaView,
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

type HabitCardProps = {
  emoji: string;
  title: string;
  description: string;
  accent?: 'red' | 'blue' | 'green' | 'purple';
};

const HabitCard: React.FC<HabitCardProps> = ({
  emoji,
  title,
  description,
  accent = 'red',
}) => {
  const getBackground = () => {
    switch (accent) {
      case 'blue':
        return colors.oxygenSoft;

      case 'green':
        return colors.successSoft;

      case 'purple':
        return '#F5F1FF';

      default:
        return colors.primarySoft;
    }
  };

  return (
    <View style={styles.habitCard}>
      <View
        style={[
          styles.illustrationBox,
          {
            backgroundColor: getBackground(),
          },
        ]}>
        <Text style={styles.emoji}>
          {emoji}
        </Text>
      </View>

      <Text style={styles.habitTitle}>
        {title}
      </Text>

      <Text style={styles.habitDescription}>
        {description}
      </Text>
    </View>
  );
};

const HealthyHabitsScreen: React.FC<Props> = ({navigation}) => {
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

      <View style={styles.content}>
        <Text style={styles.title}>
          Healthy{' '}
          <Text style={styles.redText}>
            Habits
          </Text>
          {'\n'}
          Stronger Heart
        </Text>

        <View style={styles.titleLine} />

        <Text style={styles.subtitle}>
          Simple daily habits can support your overall heart health and
          well-being.
        </Text>

        <View style={styles.grid}>
          <HabitCard
            emoji="🏃"
            title="Stay Active"
            description="Aim for regular physical activity that suits you."
            accent="red"
          />

          <HabitCard
            emoji="🥗"
            title="Eat Balanced"
            description="Choose a balanced diet with nutritious foods."
            accent="green"
          />

          <HabitCard
            emoji="🌙"
            title="Sleep Well"
            description="Make consistent, quality sleep a priority."
            accent="purple"
          />

          <HabitCard
            emoji="🚭"
            title="Avoid Smoking"
            description="Avoid tobacco and exposure to second-hand smoke."
            accent="blue"
          />
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipIconWrap}>
            <Text style={styles.tipIcon}>
              ♥
            </Text>
          </View>

          <View style={styles.tipTextWrap}>
            <Text style={styles.tipTitle}>
              Small habits matter
            </Text>

            <Text style={styles.tipDescription}>
              Consistency with healthy everyday choices can support long-term
              cardiovascular wellness.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomArea}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('GetStarted')
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

export default HealthyHabitsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  topBar: {
    height: 52,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backText: {
    color: colors.text,
    fontSize: 35,
    lineHeight: 38,
    fontWeight: '300',
  },

  skipText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },

  content: {
    flex: 1,
    paddingHorizontal: 22,
    alignItems: 'center',
  },

  title: {
    color: colors.text,
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 5,
  },

  redText: {
    color: colors.primary,
  },

  titleLine: {
    width: 34,
    height: 3,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 11,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
  },

  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 24,
  },

  habitCard: {
    width: '48%',
    minHeight: 180,
    backgroundColor: colors.white,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    alignItems: 'center',
    marginBottom: 14,

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 3,
  },

  illustrationBox: {
    width: '100%',
    height: 83,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emoji: {
    fontSize: 47,
  },

  habitTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 10,
  },

  habitDescription: {
    color: colors.textSecondary,
    fontSize: 10.5,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 2,
  },

  tipCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 19,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginTop: 2,
  },

  tipIconWrap: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  tipIcon: {
    color: colors.primary,
    fontSize: 23,
  },

  tipTextWrap: {
    flex: 1,
  },

  tipTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },

  tipDescription: {
    color: colors.textSecondary,
    fontSize: 10.5,
    lineHeight: 15,
    marginTop: 3,
  },

  bottomArea: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 28,
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