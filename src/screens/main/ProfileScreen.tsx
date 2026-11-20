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

import AppButton
  from '../../components/AppButton';

import {
  useAuth,
} from '../../context/AuthContext';

import {
  getProfile,
} from '../../db/database';

import {
  colors,
} from '../../theme/colors';

// ==========================================
// TYPES
// ==========================================

type Props = {
  onEditProfile: () => void;
  onSettings: () => void;
  onAbout: () => void;
};

type Profile = {
  age?: number;
  gender?: string;
  diabetes?: number;
  hypertension?: number;
  previous_heart_attack?: number;
};

// ==========================================
// PROFILE SCREEN
// ==========================================

export default function ProfileScreen({
  onEditProfile,
  onSettings,
  onAbout,
}: Props) {
  const {
    user,
  } = useAuth();

  const [
    profile,
    setProfile,
  ] =
    useState<Profile | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  // ========================================
  // LOAD PROFILE
  // ========================================

  const loadProfile =
    useCallback(async () => {
      try {
        setLoading(true);

        const data =
          await getProfile();

        setProfile(
          data as Profile | null,
        );
      } catch (error) {
        console.warn(
          'Unable to load profile:',
          error,
        );

        setProfile(null);
      } finally {
        setLoading(false);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile]),
  );

  // ========================================
  // USER INITIALS
  // ========================================

  const initials =
    user?.fullName
      ?.split(' ')
      .filter(Boolean)
      .map(item => item[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';

  const displayName =
    user?.fullName ||
    'User';

  const phoneNumber =
    user?.phoneNumber ||
    'Phone number not available';

  // ========================================
  // PROFILE VALUES
  // ========================================

  const ageValue =
    profile?.age
      ? `${profile.age} years`
      : user?.age
      ? `${user.age} years`
      : 'Not set';

  const genderValue =
    profile?.gender?.trim()
      ? profile.gender
      : 'Not set';

  const diabetesValue =
    Number(
      profile?.diabetes ?? 0,
    ) === 1
      ? 'Yes'
      : 'No';

  const hypertensionValue =
    Number(
      profile?.hypertension ?? 0,
    ) === 1
      ? 'Yes'
      : 'No';

  const previousAttackValue =
    Number(
      profile?.previous_heart_attack ??
        0,
    ) === 1
      ? 'Yes'
      : 'No';

  // ========================================
  // SCREEN
  // ========================================

  return (
    <ScreenContainer>

      {/* =====================================
          HEADER
      ====================================== */}

      <AppHeader
        title="My Profile"
        subtitle="Personal & health information"
      />

      {/* =====================================
          PROFILE HERO
      ====================================== */}

      <View style={styles.profileHero}>

        <View style={styles.heroDecorationOne} />

        <View style={styles.heroDecorationTwo} />

        <View style={styles.avatarOuter}>

          <View style={styles.avatar}>
            <Text style={styles.initials}>
              {initials}
            </Text>
          </View>

        </View>

        <Text style={styles.name}>
          {displayName}
        </Text>

        <Text style={styles.phone}>
          {phoneNumber}
        </Text>

        <View style={styles.profileBadge}>

          <View style={styles.profileBadgeDot} />

          <Text style={styles.profileBadgeText}>
            CVENGINE PROFILE
          </Text>

        </View>

      </View>

      {/* =====================================
          HEALTH PROFILE HEADER
      ====================================== */}

      <View style={styles.sectionHeader}>

        <View>

          <Text style={styles.sectionTitle}>
            Health Profile
          </Text>

          <Text style={styles.sectionSubtitle}>
            Personal health information used
            by Heart Monitor
          </Text>

        </View>

        <View style={styles.healthBadge}>
          <Text style={styles.healthBadgeText}>
            ♥
          </Text>
        </View>

      </View>

      {/* =====================================
          PROFILE LOADING
      ====================================== */}

      {loading ? (
        <View style={styles.loadingCard}>

          <ActivityIndicator
            size="small"
            color={colors.primary}
          />

          <Text style={styles.loadingText}>
            Loading health profile...
          </Text>

        </View>
      ) : (
        <View style={styles.healthCard}>

          <ProfileRow
            icon="A"
            iconType="blue"
            label="Age"
            value={ageValue}
          />

          <Divider />

          <ProfileRow
            icon="G"
            iconType="blue"
            label="Gender"
            value={genderValue}
          />

          <Divider />

          <ProfileRow
            icon="D"
            iconType={
              diabetesValue === 'Yes'
                ? 'red'
                : 'green'
            }
            label="Diabetes"
            value={diabetesValue}
            status={
              diabetesValue === 'Yes'
                ? 'attention'
                : 'normal'
            }
          />

          <Divider />

          <ProfileRow
            icon="H"
            iconType={
              hypertensionValue === 'Yes'
                ? 'red'
                : 'green'
            }
            label="Hypertension"
            value={hypertensionValue}
            status={
              hypertensionValue === 'Yes'
                ? 'attention'
                : 'normal'
            }
          />

          <Divider />

          <ProfileRow
            icon="♥"
            iconType={
              previousAttackValue === 'Yes'
                ? 'red'
                : 'green'
            }
            label="Previous Heart Attack"
            value={previousAttackValue}
            status={
              previousAttackValue === 'Yes'
                ? 'attention'
                : 'normal'
            }
          />

        </View>
      )}

      {/* =====================================
          EDIT PROFILE
      ====================================== */}

      <AppButton
        title="Edit Health Profile"
        onPress={onEditProfile}
      />

      {/* =====================================
          ACCOUNT OPTIONS
      ====================================== */}

      <View style={styles.optionsHeader}>

        <Text style={styles.optionsTitle}>
          App & Account
        </Text>

        <Text style={styles.optionsSubtitle}>
          Manage your Heart Monitor experience
        </Text>

      </View>

      <View style={styles.optionsCard}>

        <OptionRow
          icon="⚙"
          title="App Settings"
          description="Preferences and application settings"
          onPress={onSettings}
          type="blue"
        />

        <View style={styles.optionDivider} />

        <OptionRow
          icon="i"
          title="About Heart Monitor"
          description="Application and CVengine information"
          onPress={onAbout}
          type="red"
        />

      </View>

      {/* =====================================
          PRIVACY INFORMATION
      ====================================== */}

      <View style={styles.privacyCard}>

        <View style={styles.privacyIcon}>

          <Text style={styles.privacyIconText}>
            ✓
          </Text>

        </View>

        <View style={styles.privacyContent}>

          <Text style={styles.privacyTitle}>
            Health Profile
          </Text>

          <Text style={styles.privacyText}>
            Keep your health information
            accurate and up to date for a
            better monitoring experience.
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
// PROFILE ROW
// ==========================================

function ProfileRow({
  icon,
  iconType,
  label,
  value,
  status,
}: {
  icon: string;
  iconType:
    | 'red'
    | 'blue'
    | 'green';
  label: string;
  value: string;
  status?:
    | 'normal'
    | 'attention';
}) {
  return (
    <View style={styles.infoRow}>

      <View
        style={[
          styles.infoIcon,

          iconType === 'red' &&
            styles.infoIconRed,

          iconType === 'blue' &&
            styles.infoIconBlue,

          iconType === 'green' &&
            styles.infoIconGreen,
        ]}>

        <Text
          style={[
            styles.infoIconText,

            iconType === 'red' &&
              styles.infoIconTextRed,

            iconType === 'blue' &&
              styles.infoIconTextBlue,

            iconType === 'green' &&
              styles.infoIconTextGreen,
          ]}>
          {icon}
        </Text>

      </View>

      <View style={styles.infoContent}>

        <Text style={styles.label}>
          {label}
        </Text>

        <Text style={styles.value}>
          {value}
        </Text>

      </View>

      {status ? (
        <View
          style={[
            styles.statusBadge,

            status === 'normal'
              ? styles.statusNormal
              : styles.statusAttention,
          ]}>

          <View
            style={[
              styles.statusDot,

              status === 'normal'
                ? styles.statusDotNormal
                : styles.statusDotAttention,
            ]}
          />

          <Text
            style={[
              styles.statusText,

              status === 'normal'
                ? styles.statusTextNormal
                : styles.statusTextAttention,
            ]}>
            {status === 'normal'
              ? 'NO'
              : 'YES'}
          </Text>

        </View>
      ) : (
        <Text style={styles.arrow}>
          ›
        </Text>
      )}

    </View>
  );
}

// ==========================================
// OPTION ROW
// ==========================================

function OptionRow({
  icon,
  title,
  description,
  onPress,
  type,
}: {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  type:
    | 'red'
    | 'blue';
}) {
  return (
    <View
      style={styles.optionRow}
      onTouchEnd={onPress}>

      <View
        style={[
          styles.optionIcon,

          type === 'red'
            ? styles.optionIconRed
            : styles.optionIconBlue,
        ]}>

        <Text
          style={[
            styles.optionIconText,

            type === 'red'
              ? styles.optionIconTextRed
              : styles.optionIconTextBlue,
          ]}>
          {icon}
        </Text>

      </View>

      <View style={styles.optionContent}>

        <Text style={styles.optionTitle}>
          {title}
        </Text>

        <Text style={styles.optionDescription}>
          {description}
        </Text>

      </View>

      <Text style={styles.optionArrow}>
        ›
      </Text>

    </View>
  );
}

// ==========================================
// DIVIDER
// ==========================================

function Divider() {
  return (
    <View style={styles.divider} />
  );
}

// ==========================================
// STYLES
// ==========================================

const styles =
  StyleSheet.create({
    // ========================================
    // PROFILE HERO
    // ========================================

    profileHero: {
      alignItems: 'center',

      backgroundColor:
        colors.primary,

      borderRadius: 26,

      paddingVertical: 25,

      paddingHorizontal: 18,

      marginBottom: 23,

      overflow: 'hidden',

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

    heroDecorationOne: {
      position: 'absolute',

      width: 120,
      height: 120,

      borderRadius: 60,

      backgroundColor:
        'rgba(255,255,255,0.08)',

      top: -55,

      right: -30,
    },

    heroDecorationTwo: {
      position: 'absolute',

      width: 90,
      height: 90,

      borderRadius: 45,

      backgroundColor:
        'rgba(255,255,255,0.06)',

      bottom: -45,

      left: -25,
    },

    avatarOuter: {
      width: 90,
      height: 90,

      borderRadius: 30,

      backgroundColor:
        'rgba(255,255,255,0.18)',

      alignItems: 'center',

      justifyContent: 'center',
    },

    avatar: {
      width: 72,
      height: 72,

      borderRadius: 24,

      backgroundColor:
        colors.white,

      alignItems: 'center',

      justifyContent: 'center',

      shadowColor:
        colors.primaryDark,

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.15,

      shadowRadius: 6,

      elevation: 3,
    },

    initials: {
      color:
        colors.primary,

      fontSize: 25,

      fontWeight: '900',

      letterSpacing: 0.5,
    },

    name: {
      color:
        colors.white,

      fontSize: 21,

      fontWeight: '900',

      marginTop: 13,

      textAlign: 'center',
    },

    phone: {
      color:
        'rgba(255,255,255,0.76)',

      fontSize: 10,

      marginTop: 4,
    },

    profileBadge: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        'rgba(255,255,255,0.15)',

      borderRadius: 12,

      paddingHorizontal: 9,

      paddingVertical: 6,

      marginTop: 12,
    },

    profileBadgeDot: {
      width: 5,
      height: 5,

      borderRadius: 3,

      backgroundColor:
        colors.white,

      marginRight: 5,
    },

    profileBadgeText: {
      color:
        colors.white,

      fontSize: 7,

      fontWeight: '900',

      letterSpacing: 0.5,
    },

    // ========================================
    // SECTION HEADER
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

      maxWidth: 250,
    },

    healthBadge: {
      width: 32,
      height: 32,

      borderRadius: 10,

      backgroundColor:
        colors.primarySoft,

      alignItems: 'center',

      justifyContent: 'center',
    },

    healthBadgeText: {
      color:
        colors.primary,

      fontSize: 16,
    },

    // ========================================
    // LOADING
    // ========================================

    loadingCard: {
      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'center',

      backgroundColor:
        colors.white,

      borderRadius: 19,

      borderWidth: 1,

      borderColor:
        colors.border,

      padding: 25,

      marginBottom: 18,
    },

    loadingText: {
      color:
        colors.textSecondary,

      fontSize: 10,

      marginLeft: 10,
    },

    // ========================================
    // HEALTH CARD
    // ========================================

    healthCard: {
      backgroundColor:
        colors.white,

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        colors.border,

      padding: 15,

      marginBottom: 17,

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

    infoRow: {
      flexDirection: 'row',

      alignItems: 'center',

      minHeight: 48,
    },

    infoIcon: {
      width: 37,
      height: 37,

      borderRadius: 12,

      alignItems: 'center',

      justifyContent: 'center',

      marginRight: 10,
    },

    infoIconRed: {
      backgroundColor:
        colors.primarySoft,
    },

    infoIconBlue: {
      backgroundColor:
        colors.oxygenSoft,
    },

    infoIconGreen: {
      backgroundColor:
        colors.successSoft,
    },

    infoIconText: {
      fontSize: 12,

      fontWeight: '900',
    },

    infoIconTextRed: {
      color:
        colors.primary,
    },

    infoIconTextBlue: {
      color:
        colors.oxygen,
    },

    infoIconTextGreen: {
      color:
        colors.success,
    },

    infoContent: {
      flex: 1,
    },

    label: {
      color:
        colors.textSecondary,

      fontSize: 8,

      fontWeight: '600',
    },

    value: {
      color:
        colors.text,

      fontSize: 12,

      fontWeight: '900',

      marginTop: 2,
    },

    arrow: {
      color:
        colors.textLight,

      fontSize: 22,

      fontWeight: '500',
    },

    divider: {
      height: 1,

      backgroundColor:
        colors.border,

      marginVertical: 7,

      marginLeft: 47,
    },

    // ========================================
    // HEALTH STATUS
    // ========================================

    statusBadge: {
      flexDirection: 'row',

      alignItems: 'center',

      borderRadius: 10,

      paddingHorizontal: 8,

      paddingVertical: 5,
    },

    statusNormal: {
      backgroundColor:
        colors.successSoft,
    },

    statusAttention: {
      backgroundColor:
        colors.primarySoft,
    },

    statusDot: {
      width: 5,
      height: 5,

      borderRadius: 3,

      marginRight: 5,
    },

    statusDotNormal: {
      backgroundColor:
        colors.success,
    },

    statusDotAttention: {
      backgroundColor:
        colors.primary,
    },

    statusText: {
      fontSize: 7,

      fontWeight: '900',
    },

    statusTextNormal: {
      color:
        colors.success,
    },

    statusTextAttention: {
      color:
        colors.primary,
    },

    // ========================================
    // OPTIONS
    // ========================================

    optionsHeader: {
      marginTop: 20,

      marginBottom: 10,
    },

    optionsTitle: {
      color:
        colors.text,

      fontSize: 16,

      fontWeight: '900',
    },

    optionsSubtitle: {
      color:
        colors.textLight,

      fontSize: 8,

      marginTop: 2,
    },

    optionsCard: {
      backgroundColor:
        colors.white,

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        colors.border,

      paddingHorizontal: 14,

      marginBottom: 15,
    },

    optionRow: {
      flexDirection: 'row',

      alignItems: 'center',

      minHeight: 67,

      paddingVertical: 10,
    },

    optionIcon: {
      width: 40,
      height: 40,

      borderRadius: 13,

      alignItems: 'center',

      justifyContent: 'center',

      marginRight: 11,
    },

    optionIconBlue: {
      backgroundColor:
        colors.oxygenSoft,
    },

    optionIconRed: {
      backgroundColor:
        colors.primarySoft,
    },

    optionIconText: {
      fontSize: 16,

      fontWeight: '900',
    },

    optionIconTextBlue: {
      color:
        colors.oxygen,
    },

    optionIconTextRed: {
      color:
        colors.primary,
    },

    optionContent: {
      flex: 1,
    },

    optionTitle: {
      color:
        colors.text,

      fontSize: 12,

      fontWeight: '900',
    },

    optionDescription: {
      color:
        colors.textSecondary,

      fontSize: 8,

      marginTop: 3,
    },

    optionArrow: {
      color:
        colors.textLight,

      fontSize: 23,
    },

    optionDivider: {
      height: 1,

      backgroundColor:
        colors.border,

      marginLeft: 51,
    },

    // ========================================
    // PRIVACY
    // ========================================

    privacyCard: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        colors.infoSoft,

      borderWidth: 1,

      borderColor:
        '#D9E9FF',

      borderRadius: 17,

      padding: 13,
    },

    privacyIcon: {
      width: 36,
      height: 36,

      borderRadius: 12,

      backgroundColor:
        colors.white,

      alignItems: 'center',

      justifyContent: 'center',

      marginRight: 10,
    },

    privacyIconText: {
      color:
        colors.oxygen,

      fontSize: 14,

      fontWeight: '900',
    },

    privacyContent: {
      flex: 1,
    },

    privacyTitle: {
      color:
        colors.text,

      fontSize: 10,

      fontWeight: '900',
    },

    privacyText: {
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