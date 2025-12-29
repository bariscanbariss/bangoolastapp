import React from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useLocalization } from '@fluent/react';
import Icon from '@react-native-vector-icons/ant-design';
import { useColors, useTheme } from '@styles/hooks';
import { useNavigation } from '@react-navigation/native';
import Text from '@components/common/text';
import Badge from '@components/common/badge';
import apiClient from '@api/client';
import { useQuery } from '@tanstack/react-query';
import { useFavorites } from '@data/favorites-context';
import { useRegion } from '@data/region-context';

const Favorites = () => {
  const { l10n } = useLocalization();
  const colors = useColors();
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { region } = useRegion();

  // Fetch favorite products from backend
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['favorite-products', favorites, region?.id],
    queryFn: async () => {
      if (favorites.length === 0 || !region?.id) {
        return { products: [] };
      }

      const response = await apiClient.store.product.list({
        id: favorites,
        limit: 50,
        fields: '*variants.calculated_price',
        region_id: region.id,
      });
      return response;
    },
    enabled: favorites.length > 0 && !!region?.id,
  });

  const products = productsData?.products || [];

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
    <View className="flex-1 bg-gray-50 p-safe">
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View className="px-4 pt-6 pb-4 bg-white flex-row items-center justify-between" style={{ elevation: 2 }}>
        <View>
          <Text className="text-2xl font-content-bold text-gray-900">
            {l10n.getString('my-favorites')}
          </Text>
        </View>
        <View>
          <Icon name="heart" size={28} color="#8B5CF6" />
          {favorites.length > 0 && (
            <View className="absolute -top-1 -right-1">
              <Badge quantity={favorites.length} />
            </View>
          )}
        </View>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <View className="flex-1 items-center justify-center px-8">
          <Icon name="heart" size={64} color="#d1d5db" />
          <Text className="text-lg text-gray-500 mt-4 font-content text-center">
            {l10n.getString('no-favorites-yet')}
          </Text>
          <Text className="text-sm text-gray-400 mt-2 text-center">
            {l10n.getString('add-products-to-favorites')}
          </Text>
        </View>
      )}

      {/* Product Grid */}
      {!isLoading && products.length > 0 && (
        <View className="flex-1 px-2 pt-4">
          <FlatList
            data={products}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      )}
    </View>
  );
};

export default Favorites;
