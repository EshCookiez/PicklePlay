import React from 'react';
import { View, StyleSheet } from 'react-native';
import GlobalFooter from './GlobalFooter';

const ScreenWrapper = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      <GlobalFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginBottom: 70, // Space for footer
  },
});

export default ScreenWrapper;
