import React, { useState } from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { useLocalization } from '@fluent/react';
import Icon from '@react-native-vector-icons/ant-design';
import { useColors, useTheme } from '@styles/hooks';
import { useNavigation } from '@react-navigation/native';
import Text from '@components/common/text';
import apiClient from '@api/client';
import { useQuery } from '@tanstack/react-query';
import { useFavorites } from '@data/favorites-context';
import { useRegion } from '@data/region-context';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

const Home = () => {
  const { l10n } = useLocalization();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const colors = useColors();
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { region } = useRegion();

  // Fetch categories from backend
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.store.category.list({
        limit: 20,
      });
      return response;
    },
  });

  // Fetch products from backend
  const { data: productsData } = useQuery({
    queryKey: ['products', selectedCategory, region?.id],
    queryFn: async () => {
      if (!region?.id) {
        console.warn('Home - No region ID available');
        return { products: [] };
      }

      const params: any = {
        limit: 10,
        fields: '*variants.calculated_price',
        region_id: region.id,
      };

      // Filter by category if not "All"
      if (selectedCategory !== 'All') {
        params.category_id = [selectedCategory];
      }

      const response = await apiClient.store.product.list(params);
      return response;
    },
    enabled: !!region?.id,
  });

  const products = productsData?.products || [];
  const categories = categoriesData?.product_categories || [];

  // Combine "All" with backend categories
  const allCategories = [
    { id: 'All', name: l10n.getString('all'), handle: 'all' },
    ...categories,
  ];

  const renderProductCard = ({ item }: any) => {
    const price = item.variants?.[0]?.calculated_price?.calculated_amount || 0;
    const currency = item.variants?.[0]?.calculated_price?.currency_code || 'TRY';
    const formattedPrice = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
    }).format(price);
    const imageUrl = item.thumbnail || item.images?.[0]?.url;
    const isFav = isFavorite(item.id);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
        className="flex-1 m-2 bg-white rounded-xl p-3"
        style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.1 }}
      >
        {/* Favorite Button */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-gray-200/80 rounded-full items-center justify-center"
        >
          <Icon
            name="heart"
            size={16}
            color={isFav ? '#8B5CF6' : '#FFFFFF'}
          />
        </TouchableOpacity>

        {/* Product Image */}
        <View className="w-full aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Icon name="picture" size={32} color="#d1d5db" />
            </View>
          )}
        </View>

        {/* Product Info */}
        <Text
          className="text-sm text-gray-900 font-content mb-1"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text className="text-base font-content-bold" style={{ color: '#8e6cef' }}>
          {formattedPrice}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white p-safe">
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Search Bar & Notification */}
        <View className="px-4 pt-4 pb-3 flex-row items-center">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mr-3">
            <Icon name="search" size={20} color="#8e6cef" />
            <TextInput
              placeholder={l10n.getString('search-here')}
              placeholderTextColor="#8e6cef"
              className="flex-1 ml-2 text-base"
              style={{ color: '#8e6cef' }}
              onFocus={() => navigation.navigate('Search')}
            />
          </View>
          <TouchableOpacity
            className="w-12 h-12 items-center justify-center"
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name="bell" size={24} color="#000" />
            {/* Notification Badge */}
            <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </TouchableOpacity>
        </View>

        {/* Campaigns Slider */}
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            className="px-4"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {/* Welcome Campaign */}
            <View
              className="rounded-2xl p-5 mr-3 overflow-hidden"
              style={{
                width: 340,
                backgroundColor: '#8e6cef',
                elevation: 4,
              }}
            >
              <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-12 -translate-y-12" />
              <View>
                <Text className="text-white/80 text-xs uppercase mb-1">
                  {l10n.getString('campaigns')}
                </Text>
                <Text className="text-white text-2xl font-content-bold mb-2">
                  {l10n.getString('campaign-welcome')}
                </Text>
                <Text className="text-white/90 text-sm">
                  {l10n.getString('campaign-welcome-desc')}
                </Text>
              </View>
              <View className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                <Icon name="gift" size={20} color="white" />
              </View>
            </View>

            {/* Free Shipping Campaign */}
            <View
              className="rounded-2xl p-5 mr-3 overflow-hidden"
              style={{
                width: 340,
                backgroundColor: '#10b981',
                elevation: 4,
              }}
            >
              <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-12 -translate-y-12" />
              <View>
                <Text className="text-white/80 text-xs uppercase mb-1">
                  {l10n.getString('campaigns')}
                </Text>
                <Text className="text-white text-2xl font-content-bold mb-2">
                  {l10n.getString('campaign-freeship')}
                </Text>
                <Text className="text-white/90 text-sm">
                  {l10n.getString('campaign-freeship-desc')}
                </Text>
              </View>
              <View className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                <Icon name="car" size={20} color="white" />
              </View>
            </View>

            {/* Weekend Deal Campaign */}
            <View
              className="rounded-2xl p-5 overflow-hidden"
              style={{
                width: 340,
                backgroundColor: '#f59e0b',
                elevation: 4,
              }}
            >
              <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-12 -translate-y-12" />
              <View>
                <Text className="text-white/80 text-xs uppercase mb-1">
                  {l10n.getString('campaigns')}
                </Text>
                <Text className="text-white text-2xl font-content-bold mb-2">
                  {l10n.getString('campaign-weekend')}
                </Text>
                <Text className="text-white/90 text-sm">
                  {l10n.getString('campaign-weekend-desc')}
                </Text>
              </View>
              <View className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                <Icon name="star" size={20} color="white" />
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 mb-4"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {allCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className={`px-5 py-2 rounded-full mr-3 ${
                selectedCategory === category.id ? 'bg-primary' : 'bg-gray-100'
              }`}
              style={
                selectedCategory === category.id
                  ? { backgroundColor: '#8e6cef' }
                  : {}
              }
            >
              <Text
                className={`text-sm font-content ${
                  selectedCategory === category.id ? 'text-white' : 'text-gray-700'
                }`}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Section Header */}
        <View className="px-4 flex-row justify-between items-center mb-3">
          <Text className="text-xl font-content-bold text-gray-900">
            {l10n.getString('popular')}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProductGrid', { category: 'Popular' })
            }
          >
            <Text className="text-sm" style={{ color: '#8e6cef' }}>
              {l10n.getString('see-all')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Product Grid */}
        <View className="px-2 pb-4">
          <FlatList
            data={products}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
