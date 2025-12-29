import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import Navbar from '@components/common/navbar';
import { useColors } from '@styles/hooks';
import twColors from 'tailwindcss/colors';

const EliteMembership = () => {
  const { l10n } = useLocalization();
  const colors = useColors();

  const benefits = [
    { icon: 'truck-fast-outline', titleKey: 'elite-benefit-shipping', descKey: 'elite-benefit-shipping-desc', color: twColors.blue[500] },
    { icon: 'percent-outline', titleKey: 'elite-benefit-discount', descKey: 'elite-benefit-discount-desc', color: twColors.green[500] },
    { icon: 'clock-fast', titleKey: 'elite-benefit-early', descKey: 'elite-benefit-early-desc', color: twColors.purple[500] },
    { icon: 'headset', titleKey: 'elite-benefit-support', descKey: 'elite-benefit-support-desc', color: twColors.orange[500] },
    { icon: 'gift-outline', titleKey: 'elite-benefit-birthday', descKey: 'elite-benefit-birthday-desc', color: twColors.pink[500] },
    { icon: 'undo-variant', titleKey: 'elite-benefit-return', descKey: 'elite-benefit-return-desc', color: twColors.teal[500] },
  ];

  const plans = [
    {
      nameKey: 'elite-plan-monthly',
      price: '₺49.90',
      period: 'elite-plan-month',
      featured: false,
    },
    {
      nameKey: 'elite-plan-yearly',
      price: '₺399.90',
      period: 'elite-plan-year',
      featured: true,
      saveKey: 'elite-plan-save',
    },
  ];

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={l10n.getString('elite-membership')} showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-amber-500 px-5 py-8">
          <View className="items-center mb-3">
            <MaterialIcon name="crown" size={48} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-2">
            {l10n.getString('elite-hero-title')}
          </Text>
          <Text className="text-white/80 text-center">
            {l10n.getString('elite-hero-subtitle')}
          </Text>
        </View>

        <View className="px-5 py-6">
          {/* Benefits */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('elite-benefits-title')}
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

          {/* Plans */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('elite-plans-title')}
          </Text>
          <View className="gap-4 mb-8">
            {plans.map((plan, index) => (
              <TouchableOpacity
                key={index}
                className={`rounded-xl p-5 border-2 ${plan.featured ? 'border-amber-500 bg-amber-50' : 'border-gray-200 bg-white'}`}
              >
                {plan.featured && (
                  <View className="absolute -top-3 right-4 bg-amber-500 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-bold">{l10n.getString('elite-popular')}</Text>
                  </View>
                )}
                <Text className="font-bold text-content text-lg mb-1">
                  {l10n.getString(plan.nameKey)}
                </Text>
                <View className="flex-row items-baseline mb-2">
                  <Text className="text-3xl font-bold text-primary">{plan.price}</Text>
                  <Text className="text-content/60 ml-1">/ {l10n.getString(plan.period)}</Text>
                </View>
                {plan.saveKey && (
                  <View className="bg-green-100 self-start px-2 py-1 rounded">
                    <Text className="text-green-700 text-sm font-medium">{l10n.getString(plan.saveKey)}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity className="bg-amber-500 py-4 rounded-xl items-center">
            <Text className="text-white font-bold text-lg">
              {l10n.getString('elite-cta-button')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EliteMembership;
