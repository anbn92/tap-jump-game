/**
 * UI Components for the game
 * Contains GameTitle, GameOver and ScoreDisplay components
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GameState } from '../game/types';

// Title Screen Component
interface GameTitleProps {
  visible: boolean;
}

export const GameTitle: React.FC<GameTitleProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>Tap Jump Game</Text>
      <Text style={styles.subtitle}>Tap to Start</Text>
    </View>
  );
};

// Game Over Screen Component
interface GameOverProps {
  visible: boolean;
  score: number;
  highScore: number;
}

export const GameOver: React.FC<GameOverProps> = ({ visible, score, highScore }) => {
  if (!visible) return null;
  
  return (
    <View style={styles.gameOverContainer}>
      <Text style={styles.gameOverText}>Game Over</Text>
      <Text style={styles.scoreText}>Score: {score}</Text>
      <Text style={styles.highScoreText}>High Score: {highScore}</Text>
      <Text style={styles.restartText}>Tap to Restart</Text>
    </View>
  );
};

// Score Display Component
interface ScoreDisplayProps {
  visible: boolean;
  score: number;
  difficulty: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ visible, score, difficulty }) => {
  if (!visible) return null;
  
  return (
    <View style={styles.scoreContainer}>
      <Text style={styles.scoreText}>Score: {score}</Text>
      <Text style={styles.difficultyText}>Speed: x{difficulty.toFixed(1)}</Text>
    </View>
  );
};

// Shared styles
const styles = StyleSheet.create({
  titleContainer: {
    position: 'absolute',
    top: '30%',
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 20,
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  gameOverContainer: {
    position: 'absolute',
    top: '30%',
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  gameOverText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  scoreContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'flex-end',
    zIndex: 10,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 5,
  },
  highScoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  restartText: {
    fontSize: 18,
    color: '#333',
    marginTop: 20,
  },
});