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

const KnowYourHeartScreen: React.FC<Props> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.navigate('GetStarted')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
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

        <View style={styles.heroWrap}>
          <View style={styles.softGlow} />

          <Image
            source={require('../../assets/onboarding/heart.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.bottomArea}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('HeartGuide')}>
          <Text style={styles.nextText}>Next</Text>

          <View style={styles.arrowCircle}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default KnowYourHeartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  topBar: {
    height: 50,
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  backText: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '300',
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
  },

  title: {
    marginTop: 2,
    color: colors.text,
    fontSize: 27,
    fontWeight: '900',
    textAlign: 'center',
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
    marginTop: 9,
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 12.5,
    lineHeight: 19,
  },

  heroWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },

  softGlow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primarySoft,
  },

  heroImage: {
    width: '100%',
    height: '88%',
    maxHeight: 390,
  },

  bottomArea: {
    paddingHorizontal: 24,
    paddingBottom: 26,
    paddingTop: 8,
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
    shadowOpacity: 0.16,
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