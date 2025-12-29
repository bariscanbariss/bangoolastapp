import React from 'react';
import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import Navbar from '@components/common/navbar';
import { useColors } from '@styles/hooks';
import twColors from 'tailwindcss/colors';

const Career = () => {
  const { l10n } = useLocalization();
  const colors = useColors();

  const benefits = [
    { icon: 'cash-multiple', titleKey: 'career-benefit-salary', color: twColors.green[500] },
    { icon: 'heart-pulse', titleKey: 'career-benefit-health', color: twColors.red[500] },
    { icon: 'school-outline', titleKey: 'career-benefit-education', color: twColors.blue[500] },
    { icon: 'clock-outline', titleKey: 'career-benefit-flexible', color: twColors.purple[500] },
    { icon: 'food-apple-outline', titleKey: 'career-benefit-meals', color: twColors.orange[500] },
    { icon: 'account-group-outline', titleKey: 'career-benefit-team', color: twColors.cyan[500] },
  ];

  const departments = [
    { icon: 'code-tags', titleKey: 'career-dept-tech', countKey: 'career-positions-available', color: twColors.indigo[500] },
    { icon: 'palette-outline', titleKey: 'career-dept-design', countKey: 'career-positions-available', color: twColors.pink[500] },
    { icon: 'bullhorn-outline', titleKey: 'career-dept-marketing', countKey: 'career-positions-available', color: twColors.amber[500] },
    { icon: 'headset', titleKey: 'career-dept-support', countKey: 'career-positions-available', color: twColors.teal[500] },
  ];

  const handleApply = () => {
    Linking.openURL('mailto:kariyer@bangoo.com.tr');
  };

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={l10n.getString('career')} showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-primary px-5 py-8">
          <Text className="text-white text-2xl font-bold text-center mb-2">
            {l10n.getString('career-hero-title')}
          </Text>
          <Text className="text-white/80 text-center">
            {l10n.getString('career-hero-subtitle')}
          </Text>
        </View>

        <View className="px-5 py-6">
          {/* Why Join Us */}
          <Text className="text-xl font-bold text-content mb-3">
            {l10n.getString('career-why-title')}
          </Text>
          <Text className="text-content/70 leading-6 mb-6">
            {l10n.getString('career-why-content')}
          </Text>

          {/* Benefits */}
          <Text className="text-lg font-bold text-content mb-4">
            {l10n.getString('career-benefits-title')}
          </Text>
          <View className="flex-row flex-wrap justify-between mb-8">
            {benefits.map((benefit, index) => (
              <View key={index} className="w-[48%] bg-white rounded-xl p-4 border border-gray-100 mb-3 items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: benefit.color + '20' }}
                >
                  <MaterialIcon name={benefit.icon as any} size={24} color={benefit.color} />
                </View>
                <Text className="text-content text-center text-sm font-medium">
                  {l10n.getString(benefit.titleKey)}
                </Text>
              </View>
            ))}
          </View>

          {/* Open Positions */}
          <Text className="text-lg font-bold text-content mb-4">
            {l10n.getString('career-positions-title')}
          </Text>
          <View className="gap-3 mb-8">
            {departments.map((dept, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row bg-white rounded-xl p-4 border border-gray-100 items-center"
                onPress={handleApply}
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: dept.color + '20' }}
                >
                  <MaterialIcon name={dept.icon as any} size={24} color={dept.color} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-content">
                    {l10n.getString(dept.titleKey)}
                  </Text>
                  <Text className="text-content/60 text-sm">
                    {l10n.getString(dept.countKey)}
                  </Text>
                </View>
                <MaterialIcon name="chevron-right" size={20} color={colors.content} style={{ opacity: 0.5 }} />
              </TouchableOpacity>
            ))}
          </View>

          {/* CTA */}
          <View className="bg-primary/10 rounded-xl p-5 items-center">
            <MaterialIcon name="email-outline" size={40} color={colors.primary} />
            <Text className="text-lg font-bold text-content mt-3 mb-1">
              {l10n.getString('career-cta-title')}
            </Text>
            <Text className="text-content/60 text-center mb-4">
              {l10n.getString('career-cta-subtitle')}
            </Text>
            <TouchableOpacity
              onPress={handleApply}
              className="bg-primary px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-medium">
                {l10n.getString('career-cta-button')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Career;
