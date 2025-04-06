/**
 * Ground component for the game
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GROUND_HEIGHT } from '../game/constants';

const Ground = () => {
  return (
    <View style={[styles.ground, { height: GROUND_HEIGHT }]}>
      <View style={styles.grassLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  ground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#8B4513', // Saddle brown for ground
  },
  grassLine: {
    position: 'absolute',
    top: 0,
    height: 5,
    width: '100%',
    backgroundColor: '#556B2F', // Dark olive green for grass
  },
});

export default Ground;