import React, {
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ScreenContainer
  from '../../components/ScreenContainer';

import AppHeader
  from '../../components/AppHeader';

import AppInput
  from '../../components/AppInput';

import AppButton
  from '../../components/AppButton';

import {
  saveProfile,
} from '../../db/database';

import {
  colors,
} from '../../theme/colors';

type Props = {
  onComplete: () => void;
};

export default function ProfileSetupScreen({
  onComplete,
}: Props) {
  const [
    age,
    setAge,
  ] = useState('');

  const [
    gender,
    setGender,
  ] = useState('');

  const [
    diabetes,
    setDiabetes,
  ] = useState(false);

  const [
    hypertension,
    setHypertension,
  ] = useState(false);

  const [
    previousHeartAttack,
    setPreviousHeartAttack,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  async function handleSave() {
    const numericAge =
      Number(age);

    if (
      !Number.isFinite(numericAge) ||
      numericAge < 1 ||
      numericAge > 120
    ) {
      Alert.alert(
        'Invalid age',
        'Please enter a valid age between 1 and 120.',
      );

      return;
    }

    if (!gender) {
      Alert.alert(
        'Gender required',
        'Please select your gender.',
      );

      return;
    }

    try {
      setLoading(true);

      await saveProfile(
        numericAge,
        gender,
        diabetes,
        hypertension,
        previousHeartAttack,
      );

      onComplete();
    } catch (error) {
      console.warn(
        'Unable to save profile:',
        error,
      );

      Alert.alert(
        'Unable to save profile',
        'Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>

      <AppHeader
        title="Health Profile"
        subtitle="Set up your basic health information"
      />

      {/* =====================================
          HERO
      ====================================== */}

      <View style={styles.heroCard}>

        <View style={styles.heroDecorationOne} />
        <View style={styles.heroDecorationTwo} />

        <View style={styles.heroIconOuter}>

          <View style={styles.heroIcon}>
            <Text style={styles.heroHeart}>
              ♥
            </Text>
          </View>

        </View>

        <View style={styles.heroContent}>

          <Text style={styles.heroLabel}>
            PROFILE SETUP
          </Text>

          <Text style={styles.heroTitle}>
            Tell Us About You
          </Text>

          <Text style={styles.heroDescription}>
            Add a few basic details to prepare
            your CVengine health monitoring
            profile.
          </Text>

        </View>

      </View>

      {/* =====================================
          PROGRESS
      ====================================== */}

      <View style={styles.progressCard}>

        <View style={styles.progressHeader}>

          <Text style={styles.progressLabel}>
            PROFILE SETUP
          </Text>

          <Text style={styles.progressValue}>
            BASIC DETAILS
          </Text>

        </View>

        <View style={styles.progressTrack}>

          <View style={styles.progressFill} />

        </View>

        <Text style={styles.progressText}>
          Complete your basic health
          information to continue.
        </Text>

      </View>

      {/* =====================================
          BASIC INFORMATION
      ====================================== */}

      <SectionHeader
        number="1"
        title="Basic Information"
        subtitle="Required profile details"
      />

      <View style={styles.formCard}>

        <Text style={styles.fieldTitle}>
          Age
        </Text>

        <Text style={styles.fieldDescription}>
          Enter your current age
        </Text>

        <AppInput
          label=""
          placeholder="Enter your age"
          value={age}
          onChangeText={value =>
            setAge(
              value.replace(
                /\D/g,
                '',
              ),
            )
          }
          keyboardType="number-pad"
          maxLength={3}
        />

        <View style={styles.ageHint}>

          <Text style={styles.ageHintText}>
            Accepted range: 1 – 120 years
          </Text>

        </View>

        <View style={styles.divider} />

        <Text style={styles.fieldTitle}>
          Gender
        </Text>

        <Text style={styles.fieldDescription}>
          Select an option below
        </Text>

        <View style={styles.genderRow}>

          <GenderChoice
            title="Male"
            shortLabel="M"
            selected={
              gender === 'Male'
            }
            onPress={() =>
              setGender('Male')
            }
          />

          <GenderChoice
            title="Female"
            shortLabel="F"
            selected={
              gender === 'Female'
            }
            onPress={() =>
              setGender('Female')
            }
          />

          <GenderChoice
            title="Other"
            shortLabel="O"
            selected={
              gender === 'Other'
            }
            onPress={() =>
              setGender('Other')
            }
          />

        </View>

      </View>

      {/* =====================================
          OPTIONAL HEALTH INFORMATION
      ====================================== */}

      <SectionHeader
        number="2"
        title="Health History"
        subtitle="Optional health information"
      />

      <View style={styles.optionalNotice}>

        <View style={styles.optionalIcon}>
          <Text style={styles.optionalIconText}>
            i
          </Text>
        </View>

        <Text style={styles.optionalNoticeText}>
          These details are optional. Select
          only the conditions that apply to
          you.
        </Text>

      </View>

      <View style={styles.healthCard}>

        <HealthChoice
          icon="D"
          title="Diabetes"
          description="History of diabetes"
          selected={diabetes}
          onPress={() =>
            setDiabetes(
              previous =>
                !previous,
            )
          }
        />

        <View style={styles.healthDivider} />

        <HealthChoice
          icon="H"
          title="Hypertension"
          description="History of high blood pressure"
          selected={hypertension}
          onPress={() =>
            setHypertension(
              previous =>
                !previous,
            )
          }
        />

        <View style={styles.healthDivider} />

        <HealthChoice
          icon="♥"
          title="Previous Heart Attack"
          description="Previous myocardial infarction"
          selected={
            previousHeartAttack
          }
          onPress={() =>
            setPreviousHeartAttack(
              previous =>
                !previous,
            )
          }
        />

      </View>

      {/* =====================================
          READY STATUS
      ====================================== */}

      <View style={styles.readyCard}>

        <View style={styles.readyIcon}>
          <Text style={styles.readyIconText}>
            ✓
          </Text>
        </View>

        <View style={styles.readyContent}>

          <Text style={styles.readyLabel}>
            ALMOST READY
          </Text>

          <Text style={styles.readyTitle}>
            Complete Your Profile
          </Text>

          <Text style={styles.readyText}>
            You can update these details
            later from My Profile.
          </Text>

        </View>

      </View>

      {/* =====================================
          CONTINUE
      ====================================== */}

      <AppButton
        title="Save & Continue"
        loading={loading}
        disabled={loading}
        onPress={handleSave}
        style={styles.continueButton}
      />

      {/* =====================================
          PRIVACY NOTE
      ====================================== */}

      <View style={styles.privacyRow}>

        <Text style={styles.privacyIcon}>
          ✓
        </Text>

        <Text style={styles.privacyText}>
          Your health profile is stored
          locally in the current app version.
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
// SECTION HEADER
// ==========================================

function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.sectionHeader}>

      <View style={styles.sectionNumber}>
        <Text style={styles.sectionNumberText}>
          {number}
        </Text>
      </View>

      <View style={styles.sectionContent}>

        <Text style={styles.sectionTitle}>
          {title}
        </Text>

        <Text style={styles.sectionSubtitle}>
          {subtitle}
        </Text>

      </View>

    </View>
  );
}

// ==========================================
// GENDER CHOICE
// ==========================================

function GenderChoice({
  title,
  shortLabel,
  selected,
  onPress,
}: {
  title: string;
  shortLabel: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.genderChoice,

        selected &&
          styles.genderChoiceSelected,

        pressed &&
          styles.pressed,
      ]}>

      <View
        style={[
          styles.genderIcon,

          selected &&
            styles.genderIconSelected,
        ]}>

        <Text
          style={[
            styles.genderIconText,

            selected &&
              styles.genderIconTextSelected,
          ]}>
          {shortLabel}
        </Text>

      </View>

      <Text
        style={[
          styles.genderText,

          selected &&
            styles.genderTextSelected,
        ]}>
        {title}
      </Text>

      <View
        style={[
          styles.radioOuter,

          selected &&
            styles.radioOuterSelected,
        ]}>

        {selected ? (
          <View style={styles.radioInner} />
        ) : null}

      </View>

    </Pressable>
  );
}

// ==========================================
// HEALTH CHOICE
// ==========================================

function HealthChoice({
  icon,
  title,
  description,
  selected,
  onPress,
}: {
  icon: string;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.healthChoice,

        pressed &&
          styles.pressed,
      ]}>

      <View
        style={[
          styles.healthIcon,

          selected
            ? styles.healthIconSelected
            : styles.healthIconNormal,
        ]}>

        <Text
          style={[
            styles.healthIconText,

            selected
              ? styles.healthIconTextSelected
              : styles.healthIconTextNormal,
          ]}>
          {icon}
        </Text>

      </View>

      <View style={styles.healthContent}>

        <Text style={styles.healthTitle}>
          {title}
        </Text>

        <Text style={styles.healthDescription}>
          {description}
        </Text>

      </View>

      <View
        style={[
          styles.toggle,

          selected
            ? styles.toggleSelected
            : styles.toggleNormal,
        ]}>

        <View
          style={[
            styles.toggleCircle,

            selected
              ? styles.toggleCircleSelected
              : styles.toggleCircleNormal,
          ]}
        />

      </View>

      <Text
        style={[
          styles.yesNo,

          selected
            ? styles.yes
            : styles.no,
        ]}>
        {selected
          ? 'YES'
          : 'NO'}
      </Text>

    </Pressable>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 23,
    padding: 18,
    marginBottom: 15,
    overflow: 'hidden',

    shadowColor: colors.primaryDark,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    elevation: 3,
  },

  heroDecorationOne: {
    position: 'absolute',
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor:
      'rgba(255,255,255,0.08)',
    right: -25,
    top: -40,
  },

  heroDecorationTwo: {
    position: 'absolute',
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor:
      'rgba(255,255,255,0.06)',
    left: -22,
    bottom: -30,
  },

  heroIconOuter: {
    width: 61,
    height: 61,
    borderRadius: 20,
    backgroundColor:
      'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  heroIcon: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroHeart: {
    color: colors.primary,
    fontSize: 25,
  },

  heroContent: {
    flex: 1,
  },

  heroLabel: {
    color:
      'rgba(255,255,255,0.70)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.9,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 3,
  },

  heroDescription: {
    color:
      'rgba(255,255,255,0.80)',
    fontSize: 8,
    lineHeight: 13,
    marginTop: 4,
  },

  progressCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 13,
    marginBottom: 21,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  progressLabel: {
    color: colors.text,
    fontSize: 8,
    fontWeight: '900',
  },

  progressValue: {
    color: colors.primary,
    fontSize: 7,
    fontWeight: '900',
  },

  progressTrack: {
    height: 5,
    backgroundColor: colors.primarySoft,
    borderRadius: 3,
    marginTop: 9,
    overflow: 'hidden',
  },

  progressFill: {
    width: '65%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },

  progressText: {
    color: colors.textSecondary,
    fontSize: 7,
    marginTop: 7,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  sectionNumber: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor:
      colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  sectionNumberText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  sectionContent: {
    flex: 1,
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

  formCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 21,

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.03,
    shadowRadius: 7,
    elevation: 1,
  },

  fieldTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },

  fieldDescription: {
    color: colors.textSecondary,
    fontSize: 8,
    marginTop: 2,
    marginBottom: 4,
  },

  ageHint: {
    alignSelf: 'flex-start',
    backgroundColor:
      colors.oxygenSoft,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  ageHintText: {
    color: colors.oxygen,
    fontSize: 7,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },

  genderRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 10,
  },

  genderChoice: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:
      colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 11,
  },

  genderChoiceSelected: {
    backgroundColor:
      colors.primarySoft,
    borderColor: colors.primary,
  },

  genderIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },

  genderIconSelected: {
    backgroundColor: colors.primary,
  },

  genderIconText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '900',
  },

  genderIconTextSelected: {
    color: colors.white,
  },

  genderText: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '700',
  },

  genderTextSelected: {
    color: colors.primary,
    fontWeight: '900',
  },

  radioOuter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.borderDark,
    marginTop: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioOuterSelected: {
    borderColor: colors.primary,
  },

  radioInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },

  optionalNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      colors.oxygenSoft,
    borderRadius: 13,
    padding: 10,
    marginBottom: 10,
  },

  optionalIcon: {
    width: 26,
    height: 26,
    borderRadius: 9,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  optionalIconText: {
    color: colors.oxygen,
    fontSize: 11,
    fontWeight: '900',
  },

  optionalNoticeText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 8,
    lineHeight: 12,
  },

  healthCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    marginBottom: 14,
  },

  healthChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 69,
    paddingVertical: 10,
  },

  healthIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  healthIconNormal: {
    backgroundColor:
      colors.successSoft,
  },

  healthIconSelected: {
    backgroundColor:
      colors.primarySoft,
  },

  healthIconText: {
    fontSize: 13,
    fontWeight: '900',
  },

  healthIconTextNormal: {
    color: colors.success,
  },

  healthIconTextSelected: {
    color: colors.primary,
  },

  healthContent: {
    flex: 1,
    paddingRight: 5,
  },

  healthTitle: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '900',
  },

  healthDescription: {
    color: colors.textSecondary,
    fontSize: 7,
    marginTop: 3,
  },

  healthDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 49,
  },

  toggle: {
    width: 35,
    height: 20,
    borderRadius: 10,
    padding: 2,
    justifyContent: 'center',
  },

  toggleNormal: {
    backgroundColor: colors.disabled,
  },

  toggleSelected: {
    backgroundColor: colors.primary,
  },

  toggleCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
  },

  toggleCircleNormal: {
    alignSelf: 'flex-start',
  },

  toggleCircleSelected: {
    alignSelf: 'flex-end',
  },

  yesNo: {
    width: 28,
    textAlign: 'right',
    fontSize: 7,
    fontWeight: '900',
    marginLeft: 5,
  },

  yes: {
    color: colors.primary,
  },

  no: {
    color: colors.textLight,
  },

  readyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      colors.successSoft,
    borderWidth: 1,
    borderColor: '#D2F2E2',
    borderRadius: 16,
    padding: 13,
    marginBottom: 13,
  },

  readyIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  readyIconText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '900',
  },

  readyContent: {
    flex: 1,
  },

  readyLabel: {
    color: colors.success,
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  readyTitle: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 2,
  },

  readyText: {
    color: colors.textSecondary,
    fontSize: 8,
    marginTop: 2,
  },

  continueButton: {
    marginTop: 3,
  },

  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 9,
  },

  privacyIcon: {
    color: colors.success,
    fontSize: 9,
    fontWeight: '900',
    marginRight: 5,
  },

  privacyText: {
    color: colors.textLight,
    fontSize: 7,
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.78,
  },

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