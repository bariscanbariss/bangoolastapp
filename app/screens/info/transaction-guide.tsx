import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalization } from '@fluent/react';
import { useNavigation } from '@react-navigation/native';
import Text from '@components/common/text';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import Navbar from '@components/common/navbar';
import { useColors } from '@styles/hooks';
import twColors from 'tailwindcss/colors';

const TransactionGuide = () => {
  const { l10n } = useLocalization();
  const colors = useColors();
  const navigation = useNavigation();

  const guides = [
    {
      icon: 'account-plus-outline',
      titleKey: 'guide-register',
      descKey: 'guide-register-desc',
      color: twColors.blue[500],
      steps: ['guide-register-step1', 'guide-register-step2', 'guide-register-step3'],
    },
    {
      icon: 'cart-outline',
      titleKey: 'guide-order',
      descKey: 'guide-order-desc',
      color: twColors.green[500],
      steps: ['guide-order-step1', 'guide-order-step2', 'guide-order-step3', 'guide-order-step4'],
    },
    {
      icon: 'credit-card-outline',
      titleKey: 'guide-payment',
      descKey: 'guide-payment-desc',
      color: twColors.purple[500],
      steps: ['guide-payment-step1', 'guide-payment-step2', 'guide-payment-step3'],
    },
    {
      icon: 'truck-delivery-outline',
      titleKey: 'guide-tracking',
      descKey: 'guide-tracking-desc',
      color: twColors.orange[500],
      steps: ['guide-tracking-step1', 'guide-tracking-step2', 'guide-tracking-step3'],
    },
    {
      icon: 'undo-variant',
      titleKey: 'guide-return',
      descKey: 'guide-return-desc',
      color: twColors.red[500],
      steps: ['guide-return-step1', 'guide-return-step2', 'guide-return-step3'],
    },
  ];

  const [expandedGuide, setExpandedGuide] = React.useState<number | null>(null);

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={l10n.getString('transaction-guide')} showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-primary px-5 py-8">
          <View className="items-center mb-3">
            <MaterialIcon name="book-open-page-variant-outline" size={48} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-2">
            {l10n.getString('guide-hero-title')}
          </Text>
          <Text className="text-white/80 text-center">
            {l10n.getString('guide-hero-subtitle')}
          </Text>
        </View>

        <View className="px-5 py-6">
          {/* Quick Links */}
          <View className="flex-row flex-wrap justify-between mb-6">
            {guides.slice(0, 4).map((guide, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setExpandedGuide(expandedGuide === index ? null : index)}
                className="w-[48%] bg-white rounded-xl p-3 border border-gray-100 mb-3 items-center"
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: guide.color + '20' }}
                >
                  <MaterialIcon name={guide.icon as any} size={22} color={guide.color} />
                </View>
                <Text className="text-content text-sm font-medium text-center">
                  {l10n.getString(guide.titleKey)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Detailed Guides */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('guide-detailed-title')}
          </Text>
          <View className="gap-3 mb-6">
            {guides.map((guide, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setExpandedGuide(expandedGuide === index ? null : index)}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <View className="flex-row items-center p-4">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: guide.color + '20' }}
                  >
                    <MaterialIcon name={guide.icon as any} size={22} color={guide.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-content">
                      {l10n.getString(guide.titleKey)}
                    </Text>
                    <Text className="text-content/60 text-sm">
                      {l10n.getString(guide.descKey)}
                    </Text>
                  </View>
                  <MaterialIcon
                    name={expandedGuide === index ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={colors.content}
                    style={{ opacity: 0.5 }}
                  />
                </View>
                {expandedGuide === index && (
                  <View className="px-4 pb-4">
                    <View className="h-px bg-gray-100 mb-3" />
                    {guide.steps.map((step, stepIndex) => (
                      <View key={stepIndex} className="flex-row items-start mb-2">
                        <View className="w-6 h-6 rounded-full bg-gray-100 items-center justify-center mr-2 mt-0.5">
                          <Text className="text-content/60 text-xs font-bold">{stepIndex + 1}</Text>
                        </View>
                        <Text className="flex-1 text-content/70 text-sm leading-5">
                          {l10n.getString(step)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Help CTA */}
          <View className="bg-primary/10 rounded-xl p-5 items-center">
            <MaterialIcon name="help-circle-outline" size={32} color={colors.primary} />
            <Text className="font-bold text-content mt-2 mb-1">
              {l10n.getString('guide-help-title')}
            </Text>
            <Text className="text-content/60 text-sm text-center mb-3">
              {l10n.getString('guide-help-desc')}
            </Text>
            <TouchableOpacity
              onPress={() => (navigation as any).navigate('LiveSupport')}
              className="bg-primary px-5 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">
                {l10n.getString('guide-help-button')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TransactionGuide;
