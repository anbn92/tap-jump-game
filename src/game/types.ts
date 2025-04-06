/**
 * Type definitions for the game
 */

import { Animated } from 'react-native';

// Obstacle type definition
export interface ObstacleType {
  id: string;
  height: number;
  color: string;
  probability: number;
  width?: number;
  floatHeight?: number;
}

// Mutable reference object (alternative to useRef)
export interface MutableRefObject<T> {
  current: T;
}

// Obstacle instance with position data
export interface Obstacle {
  id: string;
  type: ObstacleType;
  x: Animated.Value;
  xValue: MutableRefObject<number>;
  active: boolean;
  passed: boolean;
}

// Pattern obstacle definition
export interface PatternObstacle {
  type: string;
  offsetX: number;
}

// Pattern definition
export interface ObstaclePattern {
  id: string;
  obstacles: PatternObstacle[];
  probability: number;
}

// Game state
export interface GameState {
  gameStarted: boolean;
  gameOver: boolean;
  score: number;
  highScore: number;
  difficulty: number;
}

// Player state
export interface PlayerState {
  y: Animated.Value;
  yValue: React.MutableRefObject<number>;
  velocity: React.MutableRefObject<number>;
}

// Collision data
export interface CollisionData {
  playerLeft: number;
  playerRight: number;
  playerTop: number;
  playerBottom: number;
}