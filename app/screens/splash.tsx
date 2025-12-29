import { useNavigation, StackActions } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { StatusBar, View, StyleSheet, Animated, ImageBackground } from 'react-native';
import BangooLogo from '../../bangooui/bangoo_logo.svg';

const Splash = () => {
  const navigation = useNavigation();
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in logo
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Breathing animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate after delay
    setTimeout(() => {
      navigation.dispatch(StackActions.replace('Main'));
    }, 2500);
  }, [navigation, logoScale, logoOpacity]);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require('../../bangooui/bango splash bg.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <Animated.View
          style={{
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          }}
        >
          <BangooLogo width={1280} height={340} />
        </Animated.View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Splash;
