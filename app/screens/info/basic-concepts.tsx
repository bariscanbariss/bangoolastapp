import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import Navbar from '@components/common/navbar';
import { useColors } from '@styles/hooks';
import twColors from 'tailwindcss/colors';

const BasicConcepts = () => {
  const { l10n } = useLocalization();
  const colors = useColors();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const concepts = [
    { titleKey: 'concept-marketplace', descKey: 'concept-marketplace-desc', icon: 'store-outline' },
    { titleKey: 'concept-commission', descKey: 'concept-commission-desc', icon: 'percent-outline' },
    { titleKey: 'concept-fulfillment', descKey: 'concept-fulfillment-desc', icon: 'package-variant' },
    { titleKey: 'concept-listing', descKey: 'concept-listing-desc', icon: 'format-list-bulleted' },
    { titleKey: 'concept-sku', descKey: 'concept-sku-desc', icon: 'barcode' },
    { titleKey: 'concept-inventory', descKey: 'concept-inventory-desc', icon: 'warehouse' },
    { titleKey: 'concept-buybox', descKey: 'concept-buybox-desc', icon: 'cart-check' },
    { titleKey: 'concept-rating', descKey: 'concept-rating-desc', icon: 'star-outline' },
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={l10n.getString('basic-concepts')} showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-indigo-600 px-5 py-8">
          <View className="items-center mb-3">
            <MaterialIcon name="book-open-variant" size={48} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-2">
            {l10n.getString('concepts-hero-title')}
          </Text>
          <Text className="text-white/80 text-center">
            {l10n.getString('concepts-hero-subtitle')}
          </Text>
        </View>

        <View className="px-5 py-6">
          {/* Intro */}
          <View className="bg-indigo-50 rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <MaterialIcon name="information-outline" size={20} color={twColors.indigo[600]} />
              <Text className="text-indigo-800 font-medium ml-2">
                {l10n.getString('concepts-intro-title')}
              </Text>
            </View>
            <Text className="text-indigo-700/70 text-sm leading-5">
              {l10n.getString('concepts-intro-desc')}
            </Text>
          </View>

          {/* Concepts List */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('concepts-list-title')}
          </Text>
          <View className="gap-3 mb-6">
            {concepts.map((concept, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleExpand(index)}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <View className="flex-row items-center p-4">
                  <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center mr-3">
                    <MaterialIcon name={concept.icon as any} size={20} color={twColors.indigo[600]} />
                  </View>
                  <Text className="flex-1 font-bold text-content">
                    {l10n.getString(concept.titleKey)}
                  </Text>
                  <MaterialIcon
                    name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={colors.content}
                    style={{ opacity: 0.5 }}
                  />
                </View>
                {expandedIndex === index && (
                  <View className="px-4 pb-4 pt-0">
                    <View className="h-px bg-gray-100 mb-3" />
                    <Text className="text-content/70 leading-5">
                      {l10n.getString(concept.descKey)}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Tip */}
          <View className="bg-green-50 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <MaterialIcon name="lightbulb-outline" size={20} color={twColors.green[600]} />
              <Text className="text-green-800 font-medium ml-2">
                {l10n.getString('concepts-tip-title')}
              </Text>
            </View>
            <Text className="text-green-700/70 text-sm leading-5">
              {l10n.getString('concepts-tip-desc')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default BasicConcepts;
