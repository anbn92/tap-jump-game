/**
 * Game constants and configurations
 */

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Physics
export const GRAVITY = 0.8;
export const JUMP_FORCE = -15;

// Dimensions
export const GROUND_HEIGHT = 60;
export const PLAYER_WIDTH = 50;
export const PLAYER_HEIGHT = 50;
export const OBSTACLE_WIDTH = 50;

// Game settings
export const BASE_OBSTACLE_SPEED = 2000; // Base speed (higher is slower)
export const MAX_DIFFICULTY = 3.0;
export const DIFFICULTY_INCREMENT = 0.2;
export const DIFFICULTY_INTERVAL = 5; // Increase difficulty every X points

// Screen dimensions
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

// Obstacle types
export const OBSTACLE_TYPES = [
  { id: 'basic', height: 80, color: '#228B22', probability: 0.25 },       // Basic obstacle (medium)
  { id: 'short', height: 50, color: '#8B0000', probability: 0.25 },       // Short obstacle (fast)
  { id: 'tall', height: 120, color: '#4B0082', probability: 0.15 },       // Tall obstacle (made taller: 100→120)
  { id: 'wide', height: 70, color: '#FF8C00', width: 80, probability: 0.1 },  // Wide obstacle
  { id: 'floating', height: 40, color: '#4682B4', floatHeight: 100, probability: 0.1 }, // Floating obstacle
  { id: 'veryTall', height: 150, color: '#8B008B', probability: 0.05 },  // Very tall obstacle (new)
  { id: 'doubleStack', height: 100, color: '#006400', width: 60, floatHeight: 70, probability: 0.05 }, // Double stacked obstacle (new)
  { id: 'extraWide', height: 80, color: '#CD5C5C', width: 120, probability: 0.05 }, // Extra wide obstacle (new)
];

// Obstacle patterns - multiple obstacles in specific arrangements
export const OBSTACLE_PATTERNS = [
  { 
    id: 'double',
    obstacles: [
      { type: 'short', offsetX: 0 },
      { type: 'short', offsetX: 150 }
    ],
    probability: 0.1
  },
  {
    id: 'stair',
    obstacles: [
      { type: 'short', offsetX: 0 },
      { type: 'tall', offsetX: 100 }
    ],
    probability: 0.1
  },
  {
    id: 'gap',
    obstacles: [
      { type: 'basic', offsetX: 0 },
      { type: 'basic', offsetX: 250 }
    ],
    probability: 0.1
  },
  {
    id: 'tallGap',
    obstacles: [
      { type: 'tall', offsetX: 0 },
      { type: 'tall', offsetX: 200 }
    ],
    probability: 0.05
  },
  {
    id: 'heightChallenge',
    obstacles: [
      { type: 'short', offsetX: 0 },
      { type: 'veryTall', offsetX: 120 }
    ],
    probability: 0.05
  },
  {
    id: 'tripleObstacle',
    obstacles: [
      { type: 'short', offsetX: 0 },
      { type: 'tall', offsetX: 150 },
      { type: 'short', offsetX: 300 }
    ],
    probability: 0.05
  }
];

// Cloud settings
export const CLOUD_SPEEDS = [15000, 20000, 25000];