/**
 * Player component for the game
 */

import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { PLAYER_WIDTH, PLAYER_HEIGHT, SCREEN_WIDTH } from '../game/constants';
import { PlayerState } from '../game/types';

interface PlayerProps {
  player: PlayerState;
}

const Player: React.FC<PlayerProps> = ({ player }) => {
  return (
    <Animated.View
      style={[
        styles.player,
        {
          transform: [{ translateY: player.y }],
          left: SCREEN_WIDTH / 4,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  player: {
    position: 'absolute',
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    backgroundColor: '#FF6347', // Tomato color for player
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#D84315',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default Player;