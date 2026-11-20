import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../theme/colors';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
};

export default function ScreenContainer({
  children,
  scroll = true,
  style,
}: Props) {
  if (scroll) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            style,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.content, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});