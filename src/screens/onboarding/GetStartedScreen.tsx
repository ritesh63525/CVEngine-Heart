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

const GetStartedScreen: React.FC<Props> = ({navigation}) => {
  const handleGetStarted = () => {
    navigation.navigate('Welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.pageBadge}>
          <Text style={styles.pageBadgeText}>5 of 5</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Let's Take Care{'\n'}
          of Your <Text style={styles.redText}>Heart</Text>
        </Text>

        <View style={styles.titleLine} />

        <Text style={styles.subtitle}>
          You're one step away from{'\n'}
          a healthier you.
        </Text>

        <View style={styles.heroWrap}>
          <View style={styles.softGlowOuter}>
            <View style={styles.softGlowInner} />
          </View>

          <Image
            source={require('../../assets/onboarding/get-started.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Together, let's build{'\n'}
          a healthier tomorrow.
        </Text>

        <TouchableOpacity
          style={styles.getStartedButton}
          activeOpacity={0.85}
          onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>
            Get Started
          </Text>
        </TouchableOpacity>

        <View style={styles.dots}>
          <View style={styles.footerDot} />
          <View style={styles.footerDot} />
          <View style={styles.footerDot} />
          <View style={styles.footerDot} />
          <View style={[styles.footerDot, styles.footerActiveDot]} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  topBar: {
    height: 50,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backText: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '300',
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

  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  title: {
    marginTop: 4,
    color: colors.text,
    fontSize: 27,
    lineHeight: 33,
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

  subtitle: {
    color: colors.textSecondary,
    fontSize: 12.5,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 15,
  },

  heroWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },

  softGlowOuter: {
    position: 'absolute',
    width: 275,
    height: 275,
    borderRadius: 138,
    backgroundColor: '#FFF5F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  softGlowInner: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FFE9ED',
  },

  heroImage: {
    width: '100%',
    height: '95%',
    maxHeight: 390,
    zIndex: 2,
  },

  footer: {
    minHeight: 205,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 46,
    borderTopRightRadius: 46,
    paddingHorizontal: 28,
    paddingTop: 26,
    paddingBottom: 20,
    alignItems: 'center',
  },

  footerText: {
    color: colors.white,
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  getStartedButton: {
    width: 190,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  getStartedText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 17,
  },

  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginHorizontal: 5,
  },

  footerActiveDot: {
    width: 18,
    backgroundColor: colors.white,
  },
});