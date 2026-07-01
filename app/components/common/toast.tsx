import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Text from '@components/common/text';
import Icon from '@react-native-vector-icons/ant-design';

type ToastProps = {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
};

const Toast = ({ message, visible, onHide, duration = 2000 }: ToastProps) => {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Slide up and fade in
      translateY.value = withTiming(-20, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(1, {
        duration: 300,
      });

      // After duration, slide down and fade out
      const timer = setTimeout(() => {
        translateY.value = withTiming(100, {
          duration: 400,
          easing: Easing.in(Easing.cubic),
        });
        opacity.value = withSequence(
          withTiming(0.7, { duration: duration / 2 }),
          withTiming(0, { duration: duration / 2 })
        );

        setTimeout(onHide, 400);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  if (!visible) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 items-center px-4 pb-8 pointer-events-none">
      <Animated.View
        style={animatedStyle}
        className="bg-primary rounded-full px-6 py-4 flex-row items-center shadow-lg"
      >
        <View className="w-6 h-6 bg-white rounded-full items-center justify-center mr-3">
          <Icon name="check" size={16} color="#8e6cef" />
        </View>
        <Text className="text-white font-content-bold text-base">
          {message}
        </Text>
      </Animated.View>
    </View>
  );
};

export default Toast;
