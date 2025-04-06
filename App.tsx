/**
 * Tap Jump Game
 * A simple React Native game where you tap to make the character jump
 * and avoid obstacles
 * 
 * @format
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  View,
} from 'react-native';

// Import components
import Player from './src/components/Player';
import Obstacle from './src/components/Obstacle';
import Ground from './src/components/Ground';
import Background from './src/components/Background';
import { GameTitle, GameOver, ScoreDisplay } from './src/components/UI';

// Import game constants and types
import {
  GRAVITY,
  JUMP_FORCE,
  GROUND_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  OBSTACLE_WIDTH,
  BASE_OBSTACLE_SPEED,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  OBSTACLE_TYPES,
  OBSTACLE_PATTERNS,
  MAX_DIFFICULTY,
  DIFFICULTY_INCREMENT,
  DIFFICULTY_INTERVAL
} from './src/game/constants';
import { 
  ObstacleType, 
  Obstacle as ObstacleInterface,
  GameState,
  PlayerState,
  CollisionData
} from './src/game/types';

function App(): React.JSX.Element {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    gameStarted: false,
    gameOver: false,
    score: 0,
    highScore: 0,
    difficulty: 1,
  });
  
  // Track all active obstacles
  const [obstacles, setObstacles] = useState<ObstacleInterface[]>([]);
  
  // Player state
  const playerY = useRef(new Animated.Value(SCREEN_HEIGHT / 2)).current;
  const playerYValue = useRef(SCREEN_HEIGHT / 2);
  const velocity = useRef(0);
  
  // Player state object
  const player: PlayerState = {
    y: playerY,
    yValue: playerYValue,
    velocity: velocity,
  };
  
  // Add listeners to track player position
  useEffect(() => {
    const playerYListener = playerY.addListener(({ value }) => {
      playerYValue.current = value;
    });
    
    // Clean up listeners
    return () => {
      playerY.removeListener(playerYListener);
    };
  }, [playerY]);
  
  // Get a random obstacle type based on probability
  const getRandomObstacleType = useCallback((): ObstacleType => {
    const totalProbability = OBSTACLE_TYPES.reduce((sum, type) => sum + type.probability, 0);
    const random = Math.random() * totalProbability;
    
    let cumulativeProbability = 0;
    for (const type of OBSTACLE_TYPES) {
      cumulativeProbability += type.probability;
      if (random <= cumulativeProbability) {
        return type;
      }
    }
    
    // Default to first type if something goes wrong
    return OBSTACLE_TYPES[0];
  }, []);
  
  // Create a new obstacle
  const createObstacle = useCallback((offsetX = 0): ObstacleInterface => {
    const type = getRandomObstacleType();
    const x = new Animated.Value(SCREEN_WIDTH + offsetX);
    // Don't use useRef here, create a simple mutable object instead
    const xValue = { current: SCREEN_WIDTH + offsetX };
    
    // Add listener to track x position
    x.addListener(({ value }) => {
      xValue.current = value;
    });
    
    return {
      id: `obstacle-${Date.now()}-${Math.random()}`,
      type,
      x,
      xValue,
      active: true,
      passed: false,
    };
  }, [getRandomObstacleType]);
  
  // Spawn obstacles (single or patterns)
  const spawnObstacles = useCallback(() => {
    console.log('Spawning obstacles...');
    // 30% chance to spawn a pattern instead of a single obstacle
    const usePattern = Math.random() < 0.3;
    
    if (usePattern) {
      // Choose a pattern based on probability
      const totalProbability = OBSTACLE_PATTERNS.reduce(
        (sum, pattern) => sum + pattern.probability, 
        0
      );
      const random = Math.random() * totalProbability;
      
      let cumulativeProbability = 0;
      let selectedPattern = OBSTACLE_PATTERNS[0];
      
      for (const pattern of OBSTACLE_PATTERNS) {
        cumulativeProbability += pattern.probability;
        if (random <= cumulativeProbability) {
          selectedPattern = pattern;
          break;
        }
      }
      
      // Create obstacles from pattern
      const newObstacles = selectedPattern.obstacles.map(({ type: typeId, offsetX }) => {
        const obstacleType = OBSTACLE_TYPES.find(t => t.id === typeId) || OBSTACLE_TYPES[0];
        
        const x = new Animated.Value(SCREEN_WIDTH + offsetX);
        // Replace useRef with a simple object
        const xValue = { current: SCREEN_WIDTH + offsetX };
        
        // Add listener to track x position
        x.addListener(({ value }) => {
          xValue.current = value;
        });
        
        return {
          id: `obstacle-${Date.now()}-${Math.random()}`,
          type: obstacleType,
          x,
          xValue,
          active: true,
          passed: false,
        };
      });
      
      setObstacles(prev => [...prev, ...newObstacles]);
      
      // Start animation for each obstacle
      for (const obstacle of newObstacles) {
        animateObstacle(obstacle);
      }
    } else {
      // Create a single obstacle
      const newObstacle = createObstacle();
      setObstacles(prev => [...prev, newObstacle]);
      animateObstacle(newObstacle);
    }
  }, [createObstacle]);
  
  // Track if a new obstacle spawn is already scheduled
  const isSpawningScheduled = useRef(false);

  // Animate obstacle movement
  const animateObstacle = useCallback((obstacle: ObstacleInterface) => {
    console.log('Animating obstacle:', obstacle.id, obstacle.type.id);
    
    // Calculate speed based on difficulty
    const obstacleSpeed = BASE_OBSTACLE_SPEED / gameState.difficulty;
    
    Animated.timing(obstacle.x, {
      toValue: -100, // Move off screen to the left
      duration: obstacleSpeed,
      useNativeDriver: true,
    }).start(({ finished }) => {
      console.log('Obstacle animation finished:', finished, obstacle.id);
      if (finished && !gameState.gameOver) {
        // Remove this obstacle from state
        setObstacles(prev => prev.filter(o => o.id !== obstacle.id));
        
        // Only schedule a new obstacle spawn if none is currently scheduled
        // and this was the last obstacle of a pattern to leave the screen
        if (!isSpawningScheduled.current) {
          isSpawningScheduled.current = true;
          
          // Vary the delay based on difficulty to control obstacle density
          const spawnDelay = 2000 - (gameState.difficulty * 500); // 2000ms at difficulty 1, 500ms at difficulty 3
          const finalDelay = Math.max(500, spawnDelay); // Ensure minimum 500ms delay
          
          setTimeout(() => {
            if (!gameState.gameOver) {
              spawnObstacles();
              isSpawningScheduled.current = false;
            }
          }, finalDelay);
        }
      }
    });
  }, [gameState.difficulty, gameState.gameOver, spawnObstacles]);
  
  // Start the game
  const startGame = useCallback(() => {
    console.log('Starting game...');
    // Reset game state
    setGameState({
      gameStarted: true,
      gameOver: false,
      score: 0,
      highScore: gameState.highScore,
      difficulty: 1,
    });
    
    // Reset player
    velocity.current = 0;
    playerY.setValue(SCREEN_HEIGHT / 2);
    
    // Clear obstacles and reset spawn tracker
    setObstacles([]);
    isSpawningScheduled.current = false;
    
    // Spawn first obstacle
    console.log('Scheduling first obstacle spawn...');
    setTimeout(() => {
      console.log('Spawning first obstacle now');
      spawnObstacles();
    }, 1000);
  }, [gameState.highScore, playerY, spawnObstacles]);
  
  // Handle player jump
  const jump = useCallback(() => {
    if (gameState.gameStarted && !gameState.gameOver) {
      velocity.current = JUMP_FORCE;
    } else if (!gameState.gameStarted) {
      startGame();
    } else if (gameState.gameOver) {
      startGame();
    }
  }, [gameState.gameOver, gameState.gameStarted, startGame]);
  
  // Check for collision between player and obstacle
  const checkCollision = useCallback((playerData: CollisionData, obstacle: ObstacleInterface): boolean => {
    const { playerLeft, playerRight, playerTop, playerBottom } = playerData;
    
    const obstacleLeft = obstacle.xValue.current;
    const obstacleWidth = obstacle.type.width || OBSTACLE_WIDTH;
    const obstacleRight = obstacleLeft + obstacleWidth;
    
    const floatOffset = obstacle.type.floatHeight || 0;
    const obstacleTop = SCREEN_HEIGHT - GROUND_HEIGHT - obstacle.type.height - floatOffset;
    const obstacleBottom = SCREEN_HEIGHT - GROUND_HEIGHT - floatOffset;
    
    return (
      playerRight > obstacleLeft &&
      playerLeft < obstacleRight &&
      playerBottom > obstacleTop &&
      playerTop < obstacleBottom
    );
  }, []);
  
  // Update score when player passes an obstacle
  const updateScore = useCallback((obstacle: ObstacleInterface) => {
    if (!obstacle.passed && obstacle.xValue.current < SCREEN_WIDTH / 4 - PLAYER_WIDTH / 2) {
      // Mark obstacle as passed
      obstacle.passed = true;
      
      // Increment score
      setGameState(prev => {
        const newScore = prev.score + 1;
        const newHighScore = Math.max(newScore, prev.highScore);
        
        // Increase difficulty every DIFFICULTY_INTERVAL points
        let newDifficulty = prev.difficulty;
        if (newScore % DIFFICULTY_INTERVAL === 0) {
          newDifficulty = Math.min(prev.difficulty + DIFFICULTY_INCREMENT, MAX_DIFFICULTY);
        }
        
        return {
          ...prev,
          score: newScore,
          highScore: newHighScore,
          difficulty: newDifficulty,
        };
      });
    }
  }, []);
  
  // Game physics loop
  useEffect(() => {
    if (!gameState.gameStarted || gameState.gameOver) return;
    
    const gameLoop = setInterval(() => {
      // Apply gravity to velocity
      velocity.current += GRAVITY;
      
      // Update player position based on velocity
      const newY = playerYValue.current + velocity.current;
      
      // Ground collision
      if (newY > SCREEN_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT) {
        playerY.setValue(SCREEN_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT);
        velocity.current = 0;
      } else {
        playerY.setValue(newY);
      }
      
      // Player collision data
      const playerData: CollisionData = {
        playerLeft: SCREEN_WIDTH / 4,
        playerRight: SCREEN_WIDTH / 4 + PLAYER_WIDTH,
        playerTop: playerYValue.current,
        playerBottom: playerYValue.current + PLAYER_HEIGHT,
      };
      
      // Check collisions with all obstacles
      for (const obstacle of obstacles) {
        // Update score if passed obstacle
        updateScore(obstacle);
        
        // Check for collision
        if (checkCollision(playerData, obstacle)) {
          // Game over
          clearInterval(gameLoop);
          setGameState(prev => ({ ...prev, gameOver: true }));
          
          // Stop all obstacle animations
          for (const o of obstacles) {
            o.x.stopAnimation();
          }
          
          break;
        }
      }
    }, 16); // ~60fps
    
    return () => {
      clearInterval(gameLoop);
    };
  }, [
    gameState.gameStarted, 
    gameState.gameOver, 
    obstacles, 
    checkCollision, 
    playerY,
    updateScore
  ]);
  
  return (
    <TouchableWithoutFeedback onPress={jump}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* Background elements */}
        <Background gameStarted={gameState.gameStarted} />
        
        {/* UI Components */}
        <GameTitle visible={!gameState.gameStarted && !gameState.gameOver} />
        <GameOver 
          visible={gameState.gameOver} 
          score={gameState.score} 
          highScore={gameState.highScore} 
        />
        <ScoreDisplay 
          visible={gameState.gameStarted && !gameState.gameOver} 
          score={gameState.score} 
          difficulty={gameState.difficulty} 
        />
        
        {/* Player */}
        <Player player={player} />
        
        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <Obstacle key={obstacle.id} obstacle={obstacle} />
        ))}
        
        {/* Ground */}
        <Ground />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky blue background
  },
});

export default App;
