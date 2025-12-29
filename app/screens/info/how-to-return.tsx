import React from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import Navbar from '@components/common/navbar';
import { useColors } from '@styles/hooks';
import twColors from 'tailwindcss/colors';

const HowToReturn = () => {
  const { l10n } = useLocalization();
  const colors = useColors();

  const steps = [
    { icon: 'account-circle-outline', titleKey: 'return-step-login', descKey: 'return-step-login-desc' },
    { icon: 'package-variant', titleKey: 'return-step-select', descKey: 'return-step-select-desc' },
    { icon: 'file-document-outline', titleKey: 'return-step-reason', descKey: 'return-step-reason-desc' },
    { icon: 'printer-outline', titleKey: 'return-step-label', descKey: 'return-step-label-desc' },
    { icon: 'truck-outline', titleKey: 'return-step-ship', descKey: 'return-step-ship-desc' },
    { icon: 'cash-refund', titleKey: 'return-step-refund', descKey: 'return-step-refund-desc' },
  ];

  const policies = [
    { icon: 'calendar-range', titleKey: 'return-policy-days', descKey: 'return-policy-days-desc', color: twColors.blue[500] },
    { icon: 'tag-outline', titleKey: 'return-policy-condition', descKey: 'return-policy-condition-desc', color: twColors.green[500] },
    { icon: 'truck-fast-outline', titleKey: 'return-policy-shipping', descKey: 'return-policy-shipping-desc', color: twColors.purple[500] },
  ];

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={l10n.getString('how-to-return')} showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-primary px-5 py-8">
          <View className="items-center mb-3">
            <MaterialIcon name="package-variant-closed-remove" size={48} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-2">
            {l10n.getString('return-hero-title')}
          </Text>
          <Text className="text-white/80 text-center">
            {l10n.getString('return-hero-subtitle')}
          </Text>
        </View>

        <View className="px-5 py-6">
          {/* Policy Cards */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('return-policy-title')}
          </Text>
          <View className="gap-3 mb-8">
            {policies.map((policy, index) => (
              <View key={index} className="flex-row bg-white rounded-xl p-4 border border-gray-100 items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: policy.color + '20' }}
                >
                  <MaterialIcon name={policy.icon as any} size={24} color={policy.color} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-content">
                    {l10n.getString(policy.titleKey)}
                  </Text>
                  <Text className="text-content/60 text-sm">
                    {l10n.getString(policy.descKey)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Steps */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('return-steps-title')}
          </Text>
          <View className="mb-8">
            {steps.map((step, index) => (
              <View key={index} className="flex-row mb-4">
                <View className="items-center mr-4">
                  <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                    <Text className="text-white font-bold">{index + 1}</Text>
                  </View>
                  {index < steps.length - 1 && (
                    <View className="w-0.5 h-12 bg-primary/20 mt-2" />
                  )}
                </View>
                <View className="flex-1 bg-white rounded-xl p-4 border border-gray-100">
                  <View className="flex-row items-center mb-2">
                    <MaterialIcon name={step.icon as any} size={20} color={colors.primary} />
                    <Text className="font-bold text-content ml-2">
                      {l10n.getString(step.titleKey)}
                    </Text>
                  </View>
                  <Text className="text-content/60 text-sm leading-5">
                    {l10n.getString(step.descKey)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Important Note */}
          <View className="bg-amber-50 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <MaterialIcon name="alert-circle-outline" size={20} color={twColors.amber[600]} />
              <Text className="text-amber-800 font-bold ml-2">
                {l10n.getString('return-note-title')}
              </Text>
            </View>
            <Text className="text-amber-700/70 text-sm leading-5">
              {l10n.getString('return-note-desc')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HowToReturn;
