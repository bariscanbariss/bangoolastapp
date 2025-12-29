import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import Navbar from '@components/common/navbar';
import { useColors } from '@styles/hooks';
import twColors from 'tailwindcss/colors';

const AboutUs = () => {
  const { l10n } = useLocalization();
  const colors = useColors();

  const values = [
    { icon: 'heart-outline', titleKey: 'about-value-customer', descKey: 'about-value-customer-desc', color: twColors.red[500] },
    { icon: 'lightbulb-outline', titleKey: 'about-value-innovation', descKey: 'about-value-innovation-desc', color: twColors.yellow[500] },
    { icon: 'shield-check-outline', titleKey: 'about-value-trust', descKey: 'about-value-trust-desc', color: twColors.blue[500] },
    { icon: 'leaf', titleKey: 'about-value-sustainability', descKey: 'about-value-sustainability-desc', color: twColors.green[500] },
  ];

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={l10n.getString('about-us')} showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-primary px-5 py-8">
          <Text className="text-white text-2xl font-bold text-center mb-2">
            {l10n.getString('about-hero-title')}
          </Text>
          <Text className="text-white/80 text-center">
            {l10n.getString('about-hero-subtitle')}
          </Text>
        </View>

        <View className="px-5 py-6">
          {/* Story Section */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-content mb-3">
              {l10n.getString('about-story-title')}
            </Text>
            <Text className="text-content/70 leading-6">
              {l10n.getString('about-story-content')}
            </Text>
          </View>

          {/* Mission Section */}
          <View className="bg-primary/10 rounded-xl p-5 mb-8">
            <View className="flex-row items-center mb-3">
              <MaterialIcon name="flag-outline" size={24} color={colors.primary} />
              <Text className="text-lg font-bold text-content ml-2">
                {l10n.getString('about-mission-title')}
              </Text>
            </View>
            <Text className="text-content/70 leading-6">
              {l10n.getString('about-mission-content')}
            </Text>
          </View>

          {/* Vision Section */}
          <View className="bg-purple-100 rounded-xl p-5 mb-8">
            <View className="flex-row items-center mb-3">
              <MaterialIcon name="eye-outline" size={24} color={twColors.purple[500]} />
              <Text className="text-lg font-bold text-content ml-2">
                {l10n.getString('about-vision-title')}
              </Text>
            </View>
            <Text className="text-content/70 leading-6">
              {l10n.getString('about-vision-content')}
            </Text>
          </View>

          {/* Values Section */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('about-values-title')}
          </Text>
          <View className="gap-3 mb-8">
            {values.map((value, index) => (
              <View key={index} className="flex-row bg-white rounded-xl p-4 border border-gray-100">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: value.color + '20' }}
                >
                  <MaterialIcon name={value.icon as any} size={24} color={value.color} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-content mb-1">
                    {l10n.getString(value.titleKey)}
                  </Text>
                  <Text className="text-content/60 text-sm">
                    {l10n.getString(value.descKey)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Stats Section */}
          <View className="flex-row justify-between mb-6">
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-primary">500K+</Text>
              <Text className="text-content/60 text-sm">{l10n.getString('about-stat-customers')}</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-primary">10K+</Text>
              <Text className="text-content/60 text-sm">{l10n.getString('about-stat-products')}</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-primary">50+</Text>
              <Text className="text-content/60 text-sm">{l10n.getString('about-stat-brands')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutUs;
