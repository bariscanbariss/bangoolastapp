import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import Navbar from '@components/common/navbar';
import { useColors } from '@styles/hooks';
import twColors from 'tailwindcss/colors';

const FAQ = () => {
  const { l10n } = useLocalization();
  const colors = useColors();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const categories = [
    {
      titleKey: 'faq-cat-orders',
      icon: 'package-variant',
      color: twColors.blue[500],
      questions: [
        { q: 'faq-q-track', a: 'faq-a-track' },
        { q: 'faq-q-cancel', a: 'faq-a-cancel' },
        { q: 'faq-q-change', a: 'faq-a-change' },
      ],
    },
    {
      titleKey: 'faq-cat-payment',
      icon: 'credit-card-outline',
      color: twColors.green[500],
      questions: [
        { q: 'faq-q-methods', a: 'faq-a-methods' },
        { q: 'faq-q-installment', a: 'faq-a-installment' },
        { q: 'faq-q-secure', a: 'faq-a-secure' },
      ],
    },
    {
      titleKey: 'faq-cat-shipping',
      icon: 'truck-outline',
      color: twColors.orange[500],
      questions: [
        { q: 'faq-q-time', a: 'faq-a-time' },
        { q: 'faq-q-cost', a: 'faq-a-cost' },
        { q: 'faq-q-international', a: 'faq-a-international' },
      ],
    },
    {
      titleKey: 'faq-cat-returns',
      icon: 'undo-variant',
      color: twColors.purple[500],
      questions: [
        { q: 'faq-q-return', a: 'faq-a-return' },
        { q: 'faq-q-refund', a: 'faq-a-refund' },
        { q: 'faq-q-exchange', a: 'faq-a-exchange' },
      ],
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState(0);

  const toggleQuestion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={l10n.getString('faq')} showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-primary px-5 py-8">
          <View className="items-center mb-3">
            <MaterialIcon name="frequently-asked-questions" size={48} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-2">
            {l10n.getString('faq-hero-title')}
          </Text>
          <Text className="text-white/80 text-center">
            {l10n.getString('faq-hero-subtitle')}
          </Text>
        </View>

        <View className="px-5 py-6">
          {/* Category Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-5 px-5">
            <View className="flex-row gap-2">
              {categories.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedCategory(index);
                    setExpandedIndex(null);
                  }}
                  className={`flex-row items-center px-4 py-2 rounded-full ${selectedCategory === index ? 'bg-primary' : 'bg-gray-100'}`}
                >
                  <MaterialIcon
                    name={cat.icon as any}
                    size={18}
                    color={selectedCategory === index ? 'white' : colors.content}
                  />
                  <Text className={`ml-2 font-medium ${selectedCategory === index ? 'text-white' : 'text-content'}`}>
                    {l10n.getString(cat.titleKey)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Questions */}
          <View className="gap-3 mb-6">
            {categories[selectedCategory].questions.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleQuestion(index)}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <View className="flex-row items-center p-4">
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: categories[selectedCategory].color + '20' }}
                  >
                    <Text style={{ color: categories[selectedCategory].color }} className="font-bold">
                      ?
                    </Text>
                  </View>
                  <Text className="flex-1 font-medium text-content">
                    {l10n.getString(item.q)}
                  </Text>
                  <MaterialIcon
                    name={expandedIndex === index ? 'minus' : 'plus'}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                {expandedIndex === index && (
                  <View className="px-4 pb-4 pt-0 ml-11">
                    <Text className="text-content/70 leading-5">
                      {l10n.getString(item.a)}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Contact CTA */}
          <View className="bg-gray-50 rounded-xl p-5 items-center">
            <MaterialIcon name="help-circle-outline" size={32} color={colors.primary} />
            <Text className="font-bold text-content mt-2 mb-1">
              {l10n.getString('faq-contact-title')}
            </Text>
            <Text className="text-content/60 text-sm text-center">
              {l10n.getString('faq-contact-desc')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FAQ;
