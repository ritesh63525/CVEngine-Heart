import React, {useEffect, useMemo, useState} from 'react';
import {
  BackHandler,
  Image,
  PanResponder,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {colors} from '../../theme/colors';

type Props = {
  navigation: any;
};

const LAST_STEP = 4;

const OnboardingScreen: React.FC<Props> = ({navigation}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (currentStep > 0) {
          setCurrentStep(step => step - 1);
        }

        return true;
      },
    );

    return () => subscription.remove();
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < LAST_STEP) {
      setCurrentStep(step => step + 1);
      return;
    }

    navigation.replace('Welcome');
  };

  const handleSkip = () => {
    setCurrentStep(LAST_STEP);
  };

  const swipeResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => {
          return (
            currentStep > 0 &&
            gesture.dx > 18 &&
            Math.abs(gesture.dx) > Math.abs(gesture.dy)
          );
        },

        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx > 70) {
            setCurrentStep(step => Math.max(0, step - 1));
          }
        },
      }),
    [currentStep],
  );

  const renderTopBar = () => (
    <View style={styles.topBar}>
      {currentStep > 0 ? (
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.75}
          onPress={handleBack}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.topBarPlaceholder} />
      )}

      {currentStep < LAST_STEP ? (
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.pageBadge}>
          <Text style={styles.pageBadgeText}>5 of 5</Text>
        </View>
      )}
    </View>
  );

  const renderIntro = () => (
    <View style={styles.introContent}>
      <View style={styles.brandArea}>
        <View style={styles.logoMark}>
          <Text style={styles.logoHeart}>♡</Text>
          <Text style={styles.logoPulse}>⌁</Text>
        </View>

        <View style={styles.brandRow}>
          <Text style={styles.cvText}>CV</Text>
          <Text style={styles.engineText}>engine</Text>
        </View>

        <Text style={styles.brandSub}>
          SMART HEART MONITORING
        </Text>

        <View style={styles.brandDivider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerHeart}>♥</Text>
          <View style={styles.dividerLine} />
        </View>
      </View>

      <View style={styles.introHeroWrap}>
        <Image
          source={require('../../assets/onboarding/intro.png')}
          style={styles.introImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.messageArea}>
        <Text style={styles.introTitle}>
          Monitor. Understand.
        </Text>

        <Text style={styles.introRedTitle}>
          Take Care.
        </Text>

        <Text style={styles.description}>
          Smart monitoring designed to help you stay connected with your heart
          every day.
        </Text>
      </View>
    </View>
  );

  const renderKnowYourHeart = () => (
    <View style={styles.normalContent}>
      <Text style={styles.title}>
        Know Your <Text style={styles.redText}>Heart</Text>
      </Text>

      <View style={styles.titleLine} />

      <Text style={styles.mainText}>
        Your heart works 24×7{'\n'}
        to keep you alive.
      </Text>

      <Text style={styles.subText}>
        Track your vitals and stay{'\n'}
        one step ahead.
      </Text>

      <View style={styles.heartHeroWrap}>
        <View style={styles.heartGlow} />

        <Image
          source={require('../../assets/onboarding/heart.png')}
          style={styles.heartImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );

  const renderHeartGuide = () => (
    <ScrollView
      style={styles.flexOne}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.guideContent}>

      <View style={styles.titleSection}>
        <Text style={styles.title}>
          Understand Your{' '}
          <Text style={styles.redText}>Vitals</Text>
        </Text>

        <View style={styles.titleLine} />

        <Text style={styles.guideSubtitle}>
          Learn the basic meaning of the two key readings monitored by CVengine.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.heartIconWrap}>
            <Text style={styles.heartIcon}>♥</Text>
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
          Heart rate is the number of times your heart beats in one minute. It
          can naturally change with activity, stress, rest and other factors.
        </Text>

        <View style={styles.rangeBox}>
          <Text style={styles.rangeLabel}>
            Typical resting adult range
          </Text>

          <View style={styles.rangeRow}>
            <Text style={styles.rangeValue}>60–100</Text>
            <Text style={styles.rangeUnit}> BPM</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.oxygenIconWrap}>
            <Text style={styles.oxygenIcon}>O₂</Text>
          </View>

          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>SpO₂</Text>

            <Text style={styles.cardMiniTitle}>
              Blood Oxygen Saturation
            </Text>
          </View>
        </View>

        <Text style={styles.cardDescription}>
          SpO₂ represents the percentage of oxygen carried by your red blood
          cells while a valid sensor signal is available.
        </Text>

        <View style={[styles.rangeBox, styles.oxygenRangeBox]}>
          <Text style={styles.rangeLabel}>
            Common healthy reading
          </Text>

          <View style={styles.rangeRow}>
            <Text style={[styles.rangeValue, styles.blueText]}>
              95–100
            </Text>

            <Text style={[styles.rangeUnit, styles.blueText]}>
              %
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>i</Text>

        <Text style={styles.infoText}>
          CVengine is designed for monitoring and wellness awareness. It is not
          a substitute for professional medical diagnosis or emergency care.
        </Text>
      </View>
    </ScrollView>
  );

  const HabitCard = ({
    emoji,
    title,
    description,
    backgroundColor,
  }: {
    emoji: string;
    title: string;
    description: string;
    backgroundColor: string;
  }) => (
    <View style={styles.habitCard}>
      <View
        style={[
          styles.illustrationBox,
          {backgroundColor},
        ]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      <Text style={styles.habitTitle}>{title}</Text>

      <Text style={styles.habitDescription}>
        {description}
      </Text>
    </View>
  );

  const renderHealthyHabits = () => (
    <ScrollView
      style={styles.flexOne}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.habitsContent}>

      <Text style={styles.title}>
        Healthy <Text style={styles.redText}>Habits</Text>
        {'\n'}
        Stronger Heart
      </Text>

      <View style={styles.titleLine} />

      <Text style={styles.guideSubtitle}>
        Simple daily habits can support your overall heart health and
        well-being.
      </Text>

      <View style={styles.grid}>
        <HabitCard
          emoji="🏃"
          title="Stay Active"
          description="Aim for regular physical activity that suits you."
          backgroundColor={colors.primarySoft}
        />

        <HabitCard
          emoji="🥗"
          title="Eat Balanced"
          description="Choose a balanced diet with nutritious foods."
          backgroundColor={colors.successSoft}
        />

        <HabitCard
          emoji="🌙"
          title="Sleep Well"
          description="Make consistent, quality sleep a priority."
          backgroundColor="#F5F1FF"
        />

        <HabitCard
          emoji="🚭"
          title="Avoid Smoking"
          description="Avoid tobacco and exposure to second-hand smoke."
          backgroundColor={colors.oxygenSoft}
        />
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipIcon}>♥</Text>

        <View style={styles.cardHeaderText}>
          <Text style={styles.tipTitle}>
            Small habits matter
          </Text>

          <Text style={styles.tipDescription}>
            Consistency with healthy everyday choices can support long-term
            cardiovascular wellness.
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderGetStarted = () => (
    <View style={styles.normalContent}>
      <Text style={styles.title}>
        Let's Take Care{'\n'}
        of Your <Text style={styles.redText}>Heart</Text>
      </Text>

      <View style={styles.titleLine} />

      <Text style={styles.subText}>
        You're one step away from{'\n'}
        a healthier you.
      </Text>

      <View style={styles.heartHeroWrap}>
        <View style={styles.finalGlowOuter}>
          <View style={styles.finalGlowInner} />
        </View>

        <Image
          source={require('../../assets/onboarding/get-started.png')}
          style={styles.heartImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.finalMessage}>
        Together, let's build a healthier tomorrow.
      </Text>
    </View>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return renderKnowYourHeart();

      case 2:
        return renderHeartGuide();

      case 3:
        return renderHealthyHabits();

      case 4:
        return renderGetStarted();

      default:
        return renderIntro();
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'right', 'bottom', 'left']}>
      <StatusBar barStyle="dark-content" />

      {renderTopBar()}

      <View
        style={styles.changingContent}
        {...swipeResponder.panHandlers}>
        {renderContent()}
      </View>

      <View style={styles.bottomArea}>
        <View style={styles.dots}>
          {[0, 1, 2, 3, 4].map(step => (
            <View
              key={step}
              style={[
                styles.dot,
                currentStep === step && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.85}
          onPress={handleNext}>

          <Text style={styles.nextText}>
            {currentStep === LAST_STEP
              ? 'Get Started'
              : 'Next'}
          </Text>

          <View style={styles.arrowCircle}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  flexOne: {
    flex: 1,
  },

  changingContent: {
    flex: 1,
  },

  topBar: {
    minHeight: 50,
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  topBarPlaceholder: {
    width: 40,
  },

  backButton: {
    width: 40,
    height: 44,
    justifyContent: 'center',
  },

  backText: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '300',
    marginTop: 8,
  },

  skipText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },

  pageBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },

  pageBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },

  introContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  brandArea: {
    alignItems: 'center',
  },

  logoMark: {
    width: 78,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoHeart: {
    color: colors.primary,
    fontSize: 62,
    lineHeight: 65,
    fontWeight: '300',
  },

  logoPulse: {
    position: 'absolute',
    color: colors.primary,
    fontSize: 28,
    bottom: 12,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },

  cvText: {
    color: colors.primary,
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: -1,
  },

  engineText: {
    color: colors.text,
    fontSize: 29,
    fontWeight: '700',
    letterSpacing: -1,
  },

  brandSub: {
    marginTop: 3,
    color: colors.textSecondary,
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 2,
  },

  brandDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },

  dividerLine: {
    width: 34,
    height: 1,
    backgroundColor: colors.primaryLight,
  },

  dividerHeart: {
    color: colors.primary,
    fontSize: 13,
    marginHorizontal: 9,
  },

  introHeroWrap: {
    flex: 1,
    width: '100%',
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },

  introImage: {
    width: 310,
    height: 310,
  },

  messageArea: {
    alignItems: 'center',
    paddingBottom: 8,
  },

  introTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },

  introRedTitle: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 3,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },

  normalContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  title: {
    color: colors.text,
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 4,
  },

  redText: {
    color: colors.primary,
  },

  titleLine: {
    width: 32,
    height: 3,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 10,
  },

  mainText: {
    marginTop: 22,
    textAlign: 'center',
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '800',
  },

  subText: {
    marginTop: 12,
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 12.5,
    lineHeight: 19,
  },

  heartHeroWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heartGlow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primarySoft,
  },

  heartImage: {
    width: 330,
    height: 350,
    zIndex: 2,
  },

  finalGlowOuter: {
    position: 'absolute',
    width: 275,
    height: 275,
    borderRadius: 138,
    backgroundColor: '#FFF5F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  finalGlowInner: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FFE9ED',
  },

  finalMessage: {
    color: colors.textSecondary,
    fontSize: 12.5,
    fontWeight: '700',
    textAlign: 'center',
    paddingBottom: 8,
  },

  guideContent: {
    paddingHorizontal: 22,
    paddingBottom: 14,
  },

  titleSection: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 18,
  },

  guideSubtitle: {
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

  infoBox: {
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  infoIcon: {
    width: 31,
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
    marginRight: 8,
  },

  infoText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 11.5,
    lineHeight: 17,
  },

  habitsContent: {
    paddingHorizontal: 22,
    paddingBottom: 14,
    alignItems: 'center',
  },

  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
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
  },

  tipCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 19,
    padding: 15,
  },

  tipIcon: {
    width: 43,
    color: colors.primary,
    fontSize: 23,
    textAlign: 'center',
    marginRight: 12,
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
    paddingBottom: 26,
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
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  nextText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },

  arrowCircle: {
    position: 'absolute',
    right: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrow: {
    color: colors.primary,
    fontSize: 27,
    lineHeight: 29,
    marginTop: -2,
  },
});
