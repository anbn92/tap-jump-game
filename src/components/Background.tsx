/**
 * Background component with clouds and decorative elements
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT, CLOUD_SPEEDS } from '../game/constants';

interface BackgroundProps {
  gameStarted: boolean;
}

const Background: React.FC<BackgroundProps> = ({ gameStarted }) => {
  const cloud1Position = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const cloud2Position = useRef(new Animated.Value(SCREEN_WIDTH + SCREEN_WIDTH / 2)).current;
  const cloud3Position = useRef(new Animated.Value(SCREEN_WIDTH + SCREEN_WIDTH / 4)).current;
  
  // Animate clouds
  useEffect(() => {
    if (!gameStarted) return;
    
    const animateCloud = (cloudPosition: Animated.Value, duration: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(cloudPosition, {
            toValue: -100,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(cloudPosition, {
            toValue: SCREEN_WIDTH,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    
    animateCloud(cloud1Position, CLOUD_SPEEDS[0]);
    animateCloud(cloud2Position, CLOUD_SPEEDS[1]);
    animateCloud(cloud3Position, CLOUD_SPEEDS[2]);
    
    return () => {
      cloud1Position.stopAnimation();
      cloud2Position.stopAnimation();
      cloud3Position.stopAnimation();
    };
  }, [gameStarted, cloud1Position, cloud2Position, cloud3Position]);
  
  return (
    <View style={styles.container}>
      {/* Decorative clouds */}
      <Animated.View 
        style={[
          styles.cloud,
          { transform: [{ translateX: cloud1Position }], top: SCREEN_HEIGHT / 5, width: 100, height: 50 }
        ]}
      />
      <Animated.View 
        style={[
          styles.cloud,
          { transform: [{ translateX: cloud2Position }], top: SCREEN_HEIGHT / 7, width: 120, height: 60 }
        ]}
      />
      <Animated.View 
        style={[
          styles.cloud,
          { transform: [{ translateX: cloud3Position }], top: SCREEN_HEIGHT / 3, width: 80, height: 40 }
        ]}
      />

      {/* Sun in the corner */}
      <View style={styles.sun} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  cloud: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 25,
    opacity: 0.8,
  },
  sun: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FDB813',
    shadowColor: '#FDB813',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  }
});

export default Background;