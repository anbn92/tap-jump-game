/**
 * Obstacle component for the game
 */

import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { GROUND_HEIGHT, OBSTACLE_WIDTH } from '../game/constants';
import { Obstacle as ObstacleInterface } from '../game/types';

interface ObstacleProps {
  obstacle: ObstacleInterface;
}

const Obstacle: React.FC<ObstacleProps> = ({ obstacle }) => {
  const { type, x } = obstacle;
  const floatOffset = type.floatHeight ? type.floatHeight : 0;
  const obstacleWidth = type.width || OBSTACLE_WIDTH;
  
  return (
    <Animated.View
      style={[
        styles.obstacle,
        {
          transform: [{ translateX: x }],
          bottom: GROUND_HEIGHT + floatOffset,
          height: type.height,
          width: obstacleWidth,
          backgroundColor: type.color,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  obstacle: {
    position: 'absolute',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
  },
});

export default Obstacle;