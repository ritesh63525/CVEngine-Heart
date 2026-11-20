import React from 'react';
import {
  Image,
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

const IntroScreen: React.FC<Props> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity
        style={styles.skipButton}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('GetStarted')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.content}>
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

        <View style={styles.heroWrap}>
          <Image
            source={require('../../assets/onboarding/intro.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.messageArea}>
          <Text style={styles.mainTitle}>
            Monitor. Understand.
          </Text>

          <Text style={styles.redTitle}>
            Take Care.
          </Text>

          <Text style={styles.description}>
            Smart monitoring designed to help you stay connected with your heart
            every day.
          </Text>
        </View>
      </View>

      <View style={styles.bottomArea}>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('KnowYourHeart')}>
          <Text style={styles.nextText}>Next</Text>

          <View style={styles.arrowCircle}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  skipButton: {
    position: 'absolute',
    top: 18,
    right: 22,
    zIndex: 20,
    padding: 8,
  },

  skipText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 28,
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

  heroWrap: {
    width: '100%',
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  messageArea: {
    alignItems: 'center',
    marginTop: 0,
  },

  mainTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },

  redTitle: {
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

  bottomArea: {
    paddingHorizontal: 24,
    paddingBottom: 26,
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
    backgroundColor: '#DADDE2',
    marginHorizontal: 5,
  },

  activeDot: {
    width: 18,
    backgroundColor: colors.primary,
  },

  nextButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,
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