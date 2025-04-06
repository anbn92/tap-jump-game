/**
 * Tap Jump Game
 * A simple React Native game where you tap to make the character jump
 * and avoid obstacles
 * 
 * @format
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Game constants
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const GROUND_HEIGHT = 60;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const OBSTACLE_WIDTH = 50;
const BASE_OBSTACLE_SPEED = 2000; // Base speed (higher is slower)

// Obstacle types
const OBSTACLE_TYPES = [
  { height: 80, color: '#228B22' },  // Basic obstacle (tall)
  { height: 50, color: '#8B0000' },  // Short obstacle (fast)
  { height: 100, color: '#4B0082' }, // Tall obstacle
];

function App(): React.JSX.Element {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [currentObstacleType, setCurrentObstacleType] = useState(OBSTACLE_TYPES[0]);
  
  // Animation values
  const playerY = useRef(new Animated.Value(height / 2)).current;
  const playerYValue = useRef(height / 2);
  const velocity = useRef(0);
  const obstacleX = useRef(new Animated.Value(width)).current;
  const obstacleXValue = useRef(width);
  const obstacleTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Add listeners to track animation values
  useEffect(() => {
    // Add listener for playerY
    const playerYListener = playerY.addListener(({ value }) => {
      playerYValue.current = value;
    });
    
    // Add listener for obstacleX
    const obstacleXListener = obstacleX.addListener(({ value }) => {
      obstacleXValue.current = value;
    });
    
    // Clean up listeners
    return () => {
      playerY.removeListener(playerYListener);
      obstacleX.removeListener(obstacleXListener);
    };
  }, [playerY, obstacleX]);
  
  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setDifficulty(1);
    velocity.current = 0;
    playerY.setValue(height / 2);
    obstacleX.setValue(width);
    setCurrentObstacleType(OBSTACLE_TYPES[0]);
    
    spawnObstacle();
  };
  
  // Handle player jump
  const jump = () => {
    if (gameStarted && !gameOver) {
      velocity.current = JUMP_FORCE;
    } else if (!gameStarted) {
      startGame();
    } else if (gameOver) {
      startGame();
    }
  };
  
  // Spawn an obstacle
  const spawnObstacle = () => {
    // Reset obstacle position
    obstacleX.setValue(width);
    
    // Choose a random obstacle type
    const randomType = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
    setCurrentObstacleType(randomType);
    
    // Calculate speed based on difficulty
    const obstacleSpeed = BASE_OBSTACLE_SPEED / difficulty;
    
    // Animate obstacle moving from right to left
    Animated.timing(obstacleX, {
      toValue: -OBSTACLE_WIDTH,
      duration: obstacleSpeed,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !gameOver) {
        // Increment score when obstacle is passed
        setScore(prevScore => {
          const newScore = prevScore + 1;
          
          // Increase difficulty every 5 points
          if (newScore % 5 === 0) {
            setDifficulty(prev => Math.min(prev + 0.2, 3)); // Cap difficulty at 3x
          }
          
          if (newScore > highScore) {
            setHighScore(newScore);
          }
          return newScore;
        });
        // Spawn another obstacle
        spawnObstacle();
      }
    });
  };
  
  // Game physics loop
  useEffect(() => {
    if (!gameStarted) return;
    
    const gameLoop = setInterval(() => {
      // Apply gravity to velocity
      velocity.current += GRAVITY;
      
      // Update player position based on velocity
      const newY = playerYValue.current + velocity.current;
      
      // Ground collision
      if (newY > height - GROUND_HEIGHT - PLAYER_HEIGHT) {
        playerY.setValue(height - GROUND_HEIGHT - PLAYER_HEIGHT);
        velocity.current = 0;
      } else {
        playerY.setValue(newY);
      }
      
      // Collision detection
      const playerLeft = width / 4;
      const playerRight = playerLeft + PLAYER_WIDTH;
      const playerTop = playerYValue.current;
      const playerBottom = playerTop + PLAYER_HEIGHT;
      
      const obstacleLeft = obstacleXValue.current;
      const obstacleRight = obstacleLeft + OBSTACLE_WIDTH;
      const obstacleTop = height - GROUND_HEIGHT - currentObstacleType.height;
      const obstacleBottom = height - GROUND_HEIGHT;
      
      // Check for collision
      if (
        playerRight > obstacleLeft &&
        playerLeft < obstacleRight &&
        playerBottom > obstacleTop &&
        playerTop < obstacleBottom
      ) {
        // Game over
        clearInterval(gameLoop);
        setGameOver(true);
        obstacleX.stopAnimation();
      }
    }, 16); // ~60fps
    
    return () => {
      clearInterval(gameLoop);
      if (obstacleTimer.current) {
        clearTimeout(obstacleTimer.current);
      }
    };
  }, [gameStarted, gameOver, currentObstacleType.height]);
  
  // Cloud decorations
  const cloud1Position = useRef(new Animated.Value(width)).current;
  const cloud2Position = useRef(new Animated.Value(width + width / 2)).current;
  
  // Animate clouds
  useEffect(() => {
    if (!gameStarted) return;
    
    const animateCloud = (cloudPosition: Animated.Value, delay: number, duration: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(cloudPosition, {
            toValue: -100,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(cloudPosition, {
            toValue: width,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    
    animateCloud(cloud1Position, 0, 15000);
    animateCloud(cloud2Position, 7500, 20000);
    
    return () => {
      cloud1Position.stopAnimation();
      cloud2Position.stopAnimation();
    };
  }, [gameStarted, cloud1Position, cloud2Position]);
  
  return (
    <TouchableWithoutFeedback onPress={jump}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* Game title */}
        {!gameStarted && !gameOver && (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Tap Jump Game</Text>
            <Text style={styles.subtitle}>Tap to Start</Text>
          </View>
        )}
        
        {/* Game over screen */}
        {gameOver && (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.highScoreText}>High Score: {highScore}</Text>
            <Text style={styles.restartText}>Tap to Restart</Text>
          </View>
        )}
        
        {/* Score display */}
        {gameStarted && !gameOver && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.difficultyText}>Speed: x{difficulty.toFixed(1)}</Text>
          </View>
        )}
        
        {/* Decorative clouds */}
        <Animated.View 
          style={[
            styles.cloud,
            { transform: [{ translateX: cloud1Position }], top: height / 5 }
          ]}
        />
        <Animated.View 
          style={[
            styles.cloud,
            { transform: [{ translateX: cloud2Position }], top: height / 7 }
          ]}
        />
        
        {/* Player character */}
        <Animated.View
          style={[
            styles.player,
            {
              transform: [{ translateY: playerY }],
              left: width / 4,
            },
          ]}
        />
        
        {/* Obstacle */}
        <Animated.View
          style={[
            styles.obstacle,
            {
              transform: [{ translateX: obstacleX }],
              bottom: GROUND_HEIGHT,
              height: currentObstacleType.height,
              backgroundColor: currentObstacleType.color,
            },
          ]}
        />
        
        {/* Ground */}
        <View style={[styles.ground, { height: GROUND_HEIGHT }]}>
          <View style={styles.grassLine} />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky blue background
  },
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
  obstacle: {
    position: 'absolute',
    width: OBSTACLE_WIDTH,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
  },
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
  cloud: {
    position: 'absolute',
    width: 100,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    opacity: 0.8,
  },
});

export default App;
