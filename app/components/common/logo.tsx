import React from 'react';
import { View } from 'react-native';
import Text from './text';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'large', color = 'white' }) => {
  const textSize = size === 'large' ? 'text-6xl' : size === 'medium' ? 'text-4xl' : 'text-2xl';
  const trailSizes = size === 'large' ? [8, 6, 4] : size === 'medium' ? [6, 4, 3] : [4, 3, 2];

  return (
    <View className="flex-row items-center">
      <Text className={`${textSize} font-content-bold tracking-wider`} style={{ color }}>
        bang
      </Text>
      <View className="flex-row items-center relative">
        <Text className={`${textSize} font-content-bold`} style={{ color }}>oo</Text>
        {/* Motion trails */}
        <View
          style={{
            position: 'absolute',
            right: size === 'large' ? -15 : size === 'medium' ? -10 : -8,
            width: trailSizes[0],
            height: trailSizes[0],
            borderRadius: trailSizes[0] / 2,
            backgroundColor: `${color}99`, // 60% opacity
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: size === 'large' ? -25 : size === 'medium' ? -18 : -14,
            top: size === 'large' ? 5 : 3,
            width: trailSizes[1],
            height: trailSizes[1],
            borderRadius: trailSizes[1] / 2,
            backgroundColor: `${color}66`, // 40% opacity
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: size === 'large' ? -33 : size === 'medium' ? -24 : -18,
            top: size === 'large' ? 10 : 6,
            width: trailSizes[2],
            height: trailSizes[2],
            borderRadius: trailSizes[2] / 2,
            backgroundColor: `${color}33`, // 20% opacity
          }}
        />
      </View>
    </View>
  );
};

export default Logo;
