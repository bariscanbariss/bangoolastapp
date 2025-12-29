import React from 'react';
import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import Navbar from '@components/common/navbar';
import { useColors } from '@styles/hooks';
import twColors from 'tailwindcss/colors';

const SellOnBangoo = () => {
  const { l10n } = useLocalization();
  const colors = useColors();

  const benefits = [
    { icon: 'account-group-outline', titleKey: 'seller-benefit-reach', descKey: 'seller-benefit-reach-desc', color: twColors.blue[500] },
    { icon: 'cash-multiple', titleKey: 'seller-benefit-commission', descKey: 'seller-benefit-commission-desc', color: twColors.green[500] },
    { icon: 'truck-delivery-outline', titleKey: 'seller-benefit-logistics', descKey: 'seller-benefit-logistics-desc', color: twColors.purple[500] },
    { icon: 'chart-line', titleKey: 'seller-benefit-analytics', descKey: 'seller-benefit-analytics-desc', color: twColors.orange[500] },
    { icon: 'headset', titleKey: 'seller-benefit-support', descKey: 'seller-benefit-support-desc', color: twColors.cyan[500] },
  ];

  const steps = [
    { number: '1', titleKey: 'seller-step-register', descKey: 'seller-step-register-desc' },
    { number: '2', titleKey: 'seller-step-documents', descKey: 'seller-step-documents-desc' },
    { number: '3', titleKey: 'seller-step-products', descKey: 'seller-step-products-desc' },
    { number: '4', titleKey: 'seller-step-sell', descKey: 'seller-step-sell-desc' },
  ];

  const handleApply = () => {
    Linking.openURL('https://satici.bangoo.com.tr');
  };

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={l10n.getString('sell-on-bangoo')} showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-green-600 px-5 py-8">
          <View className="items-center mb-3">
            <MaterialIcon name="store" size={48} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-2">
            {l10n.getString('seller-hero-title')}
          </Text>
          <Text className="text-white/80 text-center">
            {l10n.getString('seller-hero-subtitle')}
          </Text>
        </View>

        <View className="px-5 py-6">
          {/* Stats */}
          <View className="flex-row justify-between bg-white rounded-xl p-4 border border-gray-100 mb-8">
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-primary">500K+</Text>
              <Text className="text-content/60 text-xs text-center">{l10n.getString('seller-stat-customers')}</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-primary">5K+</Text>
              <Text className="text-content/60 text-xs text-center">{l10n.getString('seller-stat-sellers')}</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-primary">%8</Text>
              <Text className="text-content/60 text-xs text-center">{l10n.getString('seller-stat-commission')}</Text>
            </View>
          </View>

          {/* Benefits */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('seller-benefits-title')}
          </Text>
          <View className="gap-3 mb-8">
            {benefits.map((benefit, index) => (
              <View key={index} className="flex-row bg-white rounded-xl p-4 border border-gray-100 items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: benefit.color + '20' }}
                >
                  <MaterialIcon name={benefit.icon as any} size={24} color={benefit.color} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-content">
                    {l10n.getString(benefit.titleKey)}
                  </Text>
                  <Text className="text-content/60 text-sm">
                    {l10n.getString(benefit.descKey)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* How to Start */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('seller-howto-title')}
          </Text>
          <View className="mb-8">
            {steps.map((step, index) => (
              <View key={index} className="flex-row mb-4">
                <View className="items-center mr-4">
                  <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                    <Text className="text-white font-bold">{step.number}</Text>
                  </View>
                  {index < steps.length - 1 && (
                    <View className="w-0.5 h-8 bg-primary/20 mt-2" />
                  )}
                </View>
                <View className="flex-1 pt-1">
                  <Text className="font-bold text-content mb-1">
                    {l10n.getString(step.titleKey)}
                  </Text>
                  <Text className="text-content/60 text-sm">
                    {l10n.getString(step.descKey)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity
            onPress={handleApply}
            className="bg-green-600 py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold text-lg">
              {l10n.getString('seller-cta-button')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SellOnBangoo;
