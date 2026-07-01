import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '@react-native-vector-icons/ant-design';
import { useNavigation } from '@react-navigation/native';
import Text from '@components/common/text';
import apiClient from '@api/client';
import { useQuery } from '@tanstack/react-query';
import { StoreProductCategory, StoreProduct } from '@medusajs/types';
import { useRegion } from '@data/region-context';

const RECENT_SEARCHES_KEY = '@recent_searches';
const RECENT_CATEGORIES_KEY = '@recent_categories';
const RECENT_PRODUCTS_KEY = '@recent_products';
const MAX_RECENT_SEARCHES = 10;
const MAX_RECENT_CATEGORIES = 4;
const MAX_RECENT_PRODUCTS = 10;

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentCategoryIds, setRecentCategoryIds] = useState<string[]>([]);
  const [recentProductIds, setRecentProductIds] = useState<string[]>([]);
  const navigation = useNavigation();
  const { region } = useRegion();

  // Load recent searches from storage
  useEffect(() => {
    loadRecentSearches();
    loadRecentCategories();
    loadRecentProducts();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    try {
      const trimmed = query.trim();
      if (!trimmed) return;

      // Remove if already exists and add to beginning
      const updated = [
        trimmed,
        ...recentSearches.filter(item => item !== trimmed),
      ].slice(0, MAX_RECENT_SEARCHES);

      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const loadRecentCategories = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_CATEGORIES_KEY);
      if (stored) {
        setRecentCategoryIds(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent categories:', error);
    }
  };

  const loadRecentProducts = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_PRODUCTS_KEY);
      if (stored) {
        setRecentProductIds(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent products:', error);
    }
  };

  const saveRecentCategory = async (categoryId: string) => {
    try {
      const updated = [
        categoryId,
        ...recentCategoryIds.filter(id => id !== categoryId),
      ].slice(0, MAX_RECENT_CATEGORIES);

      setRecentCategoryIds(updated);
      await AsyncStorage.setItem(RECENT_CATEGORIES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent category:', error);
    }
  };

  const saveRecentProduct = async (productId: string) => {
    try {
      const updated = [
        productId,
        ...recentProductIds.filter(id => id !== productId),
      ].slice(0, MAX_RECENT_PRODUCTS);

      setRecentProductIds(updated);
      await AsyncStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent product:', error);
    }
  };

  const handleRemoveRecentSearch = async (item: string) => {
    try {
      const updated = recentSearches.filter((search) => search !== item);
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing recent search:', error);
    }
  };

  const handleRemoveRecentCategory = async (categoryId: string) => {
    try {
      const updated = recentCategoryIds.filter(id => id !== categoryId);
      setRecentCategoryIds(updated);
      await AsyncStorage.setItem(RECENT_CATEGORIES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing recent category:', error);
    }
  };

  const handleRecentSearchPress = (item: string) => {
    setSearchQuery(item);
  };

  const handleCategoryPress = (categoryId: string) => {
    saveRecentCategory(categoryId);
    navigation.navigate('CategoryDetail', { categoryId });
  };

  const handleProductPress = (productId: string) => {
    console.log('Navigating to product:', productId);
    // Save search query when user clicks on a product
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
    }
    saveRecentProduct(productId);
    navigation.navigate('ProductDetail' as never, { id: productId } as never);
  };

  // Fetch products based on search query
  const { data: productsData } = useQuery({
    queryKey: ['search', searchQuery, region?.id],
    queryFn: async () => {
      if (!searchQuery) return { products: [] };
      if (!region?.id) {
        console.warn('Search - No region ID available');
        return { products: [] };
      }
      const response = await apiClient.store.product.list({
        q: searchQuery,
        limit: 20,
        region_id: region.id,
        fields: '*variants.calculated_price',
      });
      return response;
    },
    enabled: searchQuery.length > 0 && !!region?.id,
  });

  // Fetch recent categories from backend
  const { data: recentCategoriesData } = useQuery({
    queryKey: ['recentCategories', recentCategoryIds],
    queryFn: async () => {
      if (recentCategoryIds.length === 0) return { product_categories: [] };
      const response = await apiClient.store.category.list({
        id: recentCategoryIds,
      });
      return response;
    },
    enabled: recentCategoryIds.length > 0,
  });

  // Fetch recent products from backend
  const { data: recentProductsData } = useQuery({
    queryKey: ['recentProducts', recentProductIds, region?.id],
    queryFn: async () => {
      if (recentProductIds.length === 0) return { products: [] };
      if (!region?.id) {
        console.warn('Recent Products - No region ID available');
        return { products: [] };
      }
      const response = await apiClient.store.product.list({
        id: recentProductIds,
        region_id: region.id,
        fields: '*variants.calculated_price',
      });
      return response;
    },
    enabled: recentProductIds.length > 0 && !!region?.id,
  });

  const products = productsData?.products || [];
  const recentCategories = recentCategoriesData?.product_categories || [];
  const recentProducts = recentProductsData?.products || [];

  const renderCategoryItem = ({ item }: { item: StoreProductCategory }) => (
    <TouchableOpacity
      onPress={() => handleCategoryPress(item.id)}
      className="bg-gray-100 rounded-full px-4 py-2 mr-2 flex-row items-center"
    >
      <Text className="text-sm text-gray-700 mr-2">{item.name}</Text>
      <TouchableOpacity onPress={() => handleRemoveRecentCategory(item.id)}>
        <Icon name="close" size={14} color="#6b7280" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderRecentProductItem = ({ item }: { item: StoreProduct }) => {
    const price = item.variants?.[0]?.calculated_price?.calculated_amount || 0;
    const currency = item.variants?.[0]?.calculated_price?.currency_code || 'TRY';
    const formattedPrice = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
    }).format(price);
    const imageUrl = item.thumbnail || item.images?.[0]?.url;
    const color = item.variants?.[0]?.options?.color || 'White';

    return (
      <TouchableOpacity
        onPress={() => handleProductPress(item.id)}
        className="bg-white rounded-xl mb-3 flex-row overflow-hidden"
        style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.1 }}
      >
        {/* Product Image */}
        <View className="w-24 h-24 bg-gray-100">
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
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text
              className="text-base text-gray-900 font-content-bold mb-1"
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text className="text-sm text-gray-500">Renk: {color}</Text>
          </View>
          <Text
            className="text-lg font-content-bold"
            style={{ color: '#8e6cef' }}
          >
            {formattedPrice}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderProductItem = ({ item }: any) => {
    const price = item.variants?.[0]?.calculated_price?.calculated_amount || 0;
    const currency = item.variants?.[0]?.calculated_price?.currency_code || 'TRY';
    const formattedPrice = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
    }).format(price);
    const imageUrl = item.thumbnail || item.images?.[0]?.url;
    const color = item.variants?.[0]?.options?.color || 'White';

    return (
      <TouchableOpacity
        onPress={() => handleProductPress(item.id)}
        className="bg-white rounded-xl mb-3 flex-row overflow-hidden"
        style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.1 }}
      >
        {/* Product Image */}
        <View className="w-24 h-24 bg-gray-100">
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
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text
              className="text-base text-gray-900 font-content-bold mb-1"
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text className="text-sm text-gray-500">Renk: {color}</Text>
          </View>
          <Text
            className="text-lg font-content-bold"
            style={{ color: '#8e6cef' }}
          >
            {formattedPrice}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white p-safe">
      {/* Header */}
      <View className="px-4 pt-4 pb-3 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center mr-2"
        >
          <Icon name="left" size={24} color="#000" />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mr-3">
          <Icon name="search" size={20} color="#9ca3af" />
          <TextInput
            placeholder="Buradan ara..."
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-2 text-base text-gray-900"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => {
              if (searchQuery.trim()) {
                saveRecentSearch(searchQuery);
              }
            }}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Icon name="filter" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Recent Searches - Only show when not searching */}
      {searchQuery.length === 0 && (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Recent Search Keywords */}
          {recentSearches.length > 0 && (
            <View className="px-4 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-content-bold text-gray-900">
                  Son Aramalar
                </Text>
                <TouchableOpacity>
                  <Text className="text-sm text-gray-500">Tümünü gör</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
              >
                {recentSearches.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRecentSearchPress(item)}
                    className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mr-2"
                  >
                    <Text className="text-sm text-gray-700 mr-2">{item}</Text>
                    <TouchableOpacity onPress={() => handleRemoveRecentSearch(item)}>
                      <Icon name="close" size={14} color="#6b7280" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Recent Categories */}
          {recentCategories.length > 0 && (
            <View className="px-4 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-content-bold text-gray-900">
                  Son Aramalar
                </Text>
                <TouchableOpacity>
                  <Text className="text-sm text-gray-500">Tümünü gör</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
              >
                {recentCategories.map((item) => (
                  <View key={item.id}>
                    {renderCategoryItem({ item })}
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Recent Products */}
          {recentProducts.length > 0 && (
            <View className="px-4 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-content-bold text-gray-900">
                  Son Aramalar
                </Text>
                <TouchableOpacity>
                  <Text className="text-sm text-gray-500">Tümünü gör</Text>
                </TouchableOpacity>
              </View>
              <View>
                {recentProducts.map((item) => (
                  <View key={item.id}>
                    {renderRecentProductItem({ item })}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Empty State */}
          {recentSearches.length === 0 &&
           recentCategories.length === 0 &&
           recentProducts.length === 0 && (
            <View className="flex-1 items-center justify-center px-4 mt-20">
              <Icon name="search" size={64} color="#d1d5db" />
              <Text className="text-gray-500 mt-4 text-center">
                Ürün aramaya başlayın
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Search Results */}
      {searchQuery.length > 0 && (
        <View className="flex-1 px-4">
          <Text className="text-lg font-content-bold text-gray-900 mb-3">
            Arama Sonuçları
          </Text>
          {products.length > 0 ? (
            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Icon name="search" size={64} color="#d1d5db" />
              <Text className="text-gray-500 mt-4 text-center">
                "{searchQuery}" için ürün bulunamadı
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default Search;
