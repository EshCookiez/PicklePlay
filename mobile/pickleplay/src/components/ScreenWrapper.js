import React from 'react';
import { View, StyleSheet } from 'react-native';

const ScreenWrapper = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
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
