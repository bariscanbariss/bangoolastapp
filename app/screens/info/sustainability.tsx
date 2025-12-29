import React from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import Navbar from '@components/common/navbar';
import twColors from 'tailwindcss/colors';

const Sustainability = () => {
  const { l10n } = useLocalization();

  const initiatives = [
    { icon: 'package-variant', titleKey: 'sustain-eco-packaging', descKey: 'sustain-eco-packaging-desc', color: twColors.green[500] },
    { icon: 'truck-outline', titleKey: 'sustain-carbon-neutral', descKey: 'sustain-carbon-neutral-desc', color: twColors.blue[500] },
    { icon: 'recycle', titleKey: 'sustain-recycling', descKey: 'sustain-recycling-desc', color: twColors.teal[500] },
    { icon: 'solar-power', titleKey: 'sustain-renewable', descKey: 'sustain-renewable-desc', color: twColors.amber[500] },
  ];

  const goals = [
    { year: '2025', descKey: 'sustain-goal-2025' },
    { year: '2027', descKey: 'sustain-goal-2027' },
    { year: '2030', descKey: 'sustain-goal-2030' },
  ];

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={l10n.getString('sustainability')} showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-green-600 px-5 py-8">
          <View className="items-center mb-3">
            <MaterialIcon name="leaf" size={48} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-2">
            {l10n.getString('sustain-hero-title')}
          </Text>
          <Text className="text-white/80 text-center">
            {l10n.getString('sustain-hero-subtitle')}
          </Text>
        </View>

        <View className="px-5 py-6">
          {/* Commitment */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-content mb-3">
              {l10n.getString('sustain-commitment-title')}
            </Text>
            <Text className="text-content/70 leading-6">
              {l10n.getString('sustain-commitment-content')}
            </Text>
          </View>

          {/* Initiatives */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('sustain-initiatives-title')}
          </Text>
          <View className="gap-4 mb-8">
            {initiatives.map((item, index) => (
              <View key={index} className="bg-white rounded-xl p-4 border border-gray-100">
                <View className="flex-row items-center mb-2">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: item.color + '20' }}
                  >
                    <MaterialIcon name={item.icon as any} size={22} color={item.color} />
                  </View>
                  <Text className="font-bold text-content flex-1">
                    {l10n.getString(item.titleKey)}
                  </Text>
                </View>
                <Text className="text-content/60 text-sm leading-5 ml-13">
                  {l10n.getString(item.descKey)}
                </Text>
              </View>
            ))}
          </View>

          {/* Goals Timeline */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('sustain-goals-title')}
          </Text>
          <View className="mb-8">
            {goals.map((goal, index) => (
              <View key={index} className="flex-row mb-4">
                <View className="items-center mr-4">
                  <View className="w-12 h-12 rounded-full bg-green-500 items-center justify-center">
                    <Text className="text-white font-bold text-sm">{goal.year}</Text>
                  </View>
                  {index < goals.length - 1 && (
                    <View className="w-0.5 h-8 bg-green-200 mt-2" />
                  )}
                </View>
                <View className="flex-1 pt-2">
                  <Text className="text-content/70 leading-5">
                    {l10n.getString(goal.descKey)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Impact Stats */}
          <View className="bg-green-50 rounded-xl p-5">
            <Text className="text-lg font-bold text-content mb-4 text-center">
              {l10n.getString('sustain-impact-title')}
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-green-600">50%</Text>
                <Text className="text-content/60 text-xs text-center">{l10n.getString('sustain-impact-packaging')}</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-green-600">30%</Text>
                <Text className="text-content/60 text-xs text-center">{l10n.getString('sustain-impact-carbon')}</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-green-600">100+</Text>
                <Text className="text-content/60 text-xs text-center">{l10n.getString('sustain-impact-partners')}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Sustainability;
