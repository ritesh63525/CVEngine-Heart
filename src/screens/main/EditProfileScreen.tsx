import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
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
  getProfile,
  saveProfile,
} from '../../db/database';

import {
  colors,
} from '../../theme/colors';

type Props = {
  onDone: () => void;
};

export default function EditProfileScreen({
  onDone,
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

  const [
    profileLoading,
    setProfileLoading,
  ] = useState(true);

  // ==========================================
  // LOAD EXISTING PROFILE
  // ==========================================

  useEffect(() => {
    void loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setProfileLoading(true);

      const profile =
        await getProfile();

      if (!profile) {
        return;
      }

      setAge(
        String(
          profile.age ?? '',
        ),
      );

      setGender(
        String(
          profile.gender ?? '',
        ),
      );

      setDiabetes(
        Number(
          profile.diabetes ?? 0,
        ) === 1,
      );

      setHypertension(
        Number(
          profile.hypertension ?? 0,
        ) === 1,
      );

      setPreviousHeartAttack(
        Number(
          profile.previous_heart_attack ??
            0,
        ) === 1,
      );
    } catch (error) {
      console.warn(
        'Unable to load profile:',
        error,
      );
    } finally {
      setProfileLoading(false);
    }
  }

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
        'Please select a gender.',
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

      Alert.alert(
        'Profile Updated',
        'Your health profile has been saved successfully.',
        [
          {
            text: 'Done',
            onPress: onDone,
          },
        ],
      );
    } catch (error) {
      console.warn(
        'Unable to save profile:',
        error,
      );

      Alert.alert(
        'Unable to save',
        'Your profile could not be updated. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <ScreenContainer>

      <AppHeader
        title="Edit Profile"
        subtitle="Update your health information"
      />

      {/* =====================================
          HERO
      ====================================== */}

      <View style={styles.heroCard}>

        <View style={styles.heroIconOuter}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroHeart}>
              ♥
            </Text>
          </View>
        </View>

        <View style={styles.heroContent}>

          <Text style={styles.heroLabel}>
            HEALTH PROFILE
          </Text>

          <Text style={styles.heroTitle}>
            Keep Your Profile Updated
          </Text>

          <Text style={styles.heroDescription}>
            Accurate health information helps
            CVengine maintain a more complete
            monitoring profile.
          </Text>

        </View>

      </View>

      {profileLoading ? (
        <View style={styles.loadingCard}>

          <ActivityIndicator
            size="small"
            color={colors.primary}
          />

          <Text style={styles.loadingText}>
            Loading your health profile...
          </Text>

        </View>
      ) : (
        <>

          {/* =================================
              BASIC INFORMATION
          ================================== */}

          <View style={styles.sectionHeader}>

            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>
                1
              </Text>
            </View>

            <View style={styles.sectionContent}>

              <Text style={styles.sectionTitle}>
                Basic Information
              </Text>

              <Text style={styles.sectionSubtitle}>
                Your basic health details
              </Text>

            </View>

          </View>

          <View style={styles.formCard}>

            <Text style={styles.inputHeading}>
              Age
            </Text>

            <Text style={styles.inputDescription}>
              Enter your current age
            </Text>

            <AppInput
              label=""
              value={age}
              placeholder="Enter your age"
              keyboardType="number-pad"
              maxLength={3}
              onChangeText={value =>
                setAge(
                  value.replace(
                    /\D/g,
                    '',
                  ),
                )
              }
            />

            <View style={styles.ageHint}>
              <Text style={styles.ageHintText}>
                Accepted range: 1 – 120 years
              </Text>
            </View>

            <View style={styles.formDivider} />

            <Text style={styles.inputHeading}>
              Gender
            </Text>

            <Text style={styles.inputDescription}>
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

          {/* =================================
              HEALTH HISTORY
          ================================== */}

          <View style={styles.sectionHeader}>

            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>
                2
              </Text>
            </View>

            <View style={styles.sectionContent}>

              <Text style={styles.sectionTitle}>
                Health History
              </Text>

              <Text style={styles.sectionSubtitle}>
                Select conditions that apply
              </Text>

            </View>

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

          {/* =================================
              PROFILE STATUS
          ================================== */}

          <View style={styles.statusCard}>

            <View style={styles.statusIcon}>
              <Text style={styles.statusIconText}>
                ✓
              </Text>
            </View>

            <View style={styles.statusContent}>

              <Text style={styles.statusTitle}>
                Profile Information
              </Text>

              <Text style={styles.statusText}>
                Review your information before
                saving your changes.
              </Text>

            </View>

          </View>

          {/* =================================
              BUTTONS
          ================================== */}

          <AppButton
            title="Save Changes"
            loading={loading}
            disabled={loading}
            onPress={handleSave}
            style={styles.saveButton}
          />

          <AppButton
            title="Cancel"
            variant="secondary"
            disabled={loading}
            onPress={onDone}
          />

        </>
      )}

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
          styles.choicePressed,
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
          styles.choicePressed,
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
          styles.yesNoText,

          selected
            ? styles.yesText
            : styles.noText,
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

const styles =
  StyleSheet.create({
    heroCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        colors.primary,
      borderRadius: 22,
      padding: 17,
      marginBottom: 22,

      shadowColor:
        colors.primaryDark,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.15,
      shadowRadius: 9,
      elevation: 3,
    },

    heroIconOuter: {
      width: 59,
      height: 59,
      borderRadius: 19,
      backgroundColor:
        'rgba(255,255,255,0.16)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 13,
    },

    heroIcon: {
      width: 45,
      height: 45,
      borderRadius: 14,
      backgroundColor:
        colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },

    heroHeart: {
      color:
        colors.primary,
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
      letterSpacing: 0.8,
    },

    heroTitle: {
      color:
        colors.white,
      fontSize: 15,
      fontWeight: '900',
      marginTop: 3,
    },

    heroDescription: {
      color:
        'rgba(255,255,255,0.78)',
      fontSize: 8,
      lineHeight: 13,
      marginTop: 4,
    },

    loadingCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        colors.white,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 18,
      padding: 28,
      marginBottom: 20,
    },

    loadingText: {
      color:
        colors.textSecondary,
      fontSize: 10,
      marginLeft: 10,
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      marginTop: 2,
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
      color:
        colors.primary,
      fontSize: 11,
      fontWeight: '900',
    },

    sectionContent: {
      flex: 1,
    },

    sectionTitle: {
      color:
        colors.text,
      fontSize: 15,
      fontWeight: '900',
    },

    sectionSubtitle: {
      color:
        colors.textLight,
      fontSize: 8,
      marginTop: 1,
    },

    formCard: {
      backgroundColor:
        colors.white,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 20,
      padding: 16,
      marginBottom: 20,

      shadowColor:
        colors.shadow,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.03,
      shadowRadius: 7,
      elevation: 1,
    },

    inputHeading: {
      color:
        colors.text,
      fontSize: 12,
      fontWeight: '800',
    },

    inputDescription: {
      color:
        colors.textSecondary,
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
      marginTop: 1,
    },

    ageHintText: {
      color:
        colors.oxygen,
      fontSize: 7,
      fontWeight: '700',
    },

    formDivider: {
      height: 1,
      backgroundColor:
        colors.border,
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
      justifyContent: 'center',
      backgroundColor:
        colors.background,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 14,
      paddingVertical: 11,
      paddingHorizontal: 5,
    },

    genderChoiceSelected: {
      backgroundColor:
        colors.primarySoft,
      borderColor:
        colors.primary,
    },

    genderIcon: {
      width: 31,
      height: 31,
      borderRadius: 10,
      backgroundColor:
        colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 5,
    },

    genderIconSelected: {
      backgroundColor:
        colors.primary,
    },

    genderIconText: {
      color:
        colors.textSecondary,
      fontSize: 10,
      fontWeight: '900',
    },

    genderIconTextSelected: {
      color:
        colors.white,
    },

    genderText: {
      color:
        colors.textSecondary,
      fontSize: 9,
      fontWeight: '700',
    },

    genderTextSelected: {
      color:
        colors.primary,
      fontWeight: '900',
    },

    radioOuter: {
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 1.5,
      borderColor:
        colors.borderDark,
      marginTop: 7,
      alignItems: 'center',
      justifyContent: 'center',
    },

    radioOuterSelected: {
      borderColor:
        colors.primary,
    },

    radioInner: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor:
        colors.primary,
    },

    choicePressed: {
      opacity: 0.78,
    },

    healthCard: {
      backgroundColor:
        colors.white,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 20,
      paddingHorizontal: 14,
      marginBottom: 15,

      shadowColor:
        colors.shadow,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.03,
      shadowRadius: 7,
      elevation: 1,
    },

    healthChoice: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 70,
      paddingVertical: 11,
    },

    healthIcon: {
      width: 40,
      height: 40,
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
      fontWeight: '900',
      fontSize: 13,
    },

    healthIconTextNormal: {
      color:
        colors.success,
    },

    healthIconTextSelected: {
      color:
        colors.primary,
    },

    healthContent: {
      flex: 1,
      paddingRight: 6,
    },

    healthTitle: {
      color:
        colors.text,
      fontSize: 11,
      fontWeight: '900',
    },

    healthDescription: {
      color:
        colors.textSecondary,
      fontSize: 7,
      marginTop: 3,
    },

    healthDivider: {
      height: 1,
      backgroundColor:
        colors.border,
      marginLeft: 50,
    },

    toggle: {
      width: 35,
      height: 20,
      borderRadius: 10,
      padding: 2,
      justifyContent: 'center',
    },

    toggleNormal: {
      backgroundColor:
        colors.disabled,
    },

    toggleSelected: {
      backgroundColor:
        colors.primary,
    },

    toggleCircle: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor:
        colors.white,
    },

    toggleCircleNormal: {
      alignSelf: 'flex-start',
    },

    toggleCircleSelected: {
      alignSelf: 'flex-end',
    },

    yesNoText: {
      width: 28,
      textAlign: 'right',
      fontSize: 7,
      fontWeight: '900',
      marginLeft: 5,
    },

    yesText: {
      color:
        colors.primary,
    },

    noText: {
      color:
        colors.textLight,
    },

    statusCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        colors.oxygenSoft,
      borderRadius: 16,
      borderWidth: 1,
      borderColor:
        '#D9E9FF',
      padding: 13,
      marginBottom: 14,
    },

    statusIcon: {
      width: 35,
      height: 35,
      borderRadius: 11,
      backgroundColor:
        colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },

    statusIconText: {
      color:
        colors.oxygen,
      fontSize: 14,
      fontWeight: '900',
    },

    statusContent: {
      flex: 1,
    },

    statusTitle: {
      color:
        colors.text,
      fontSize: 10,
      fontWeight: '900',
    },

    statusText: {
      color:
        colors.textSecondary,
      fontSize: 8,
      lineHeight: 12,
      marginTop: 2,
    },

    saveButton: {
      marginTop: 5,
    },

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