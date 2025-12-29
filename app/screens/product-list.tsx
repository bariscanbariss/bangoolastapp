import React from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import Icon from '@react-native-vector-icons/ant-design';
import { useNavigation, useRoute } from '@react-navigation/native';
import Text from '@components/common/text';
import apiClient from '@api/client';
import { useQuery } from '@tanstack/react-query';
import { useRegion } from '@data/region-context';

const ProductList = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const category = route.params?.category || 'All Products';
  const { region } = useRegion();

  // Fetch products from backend
  const { data: productsData } = useQuery({
    queryKey: ['products', category, region?.id],
    queryFn: async () => {
      if (!region?.id) {
        console.warn('Product List - No region ID available');
        return { products: [] };
      }

      const response = await apiClient.store.product.list({
        limit: 20,
        fields: '*variants.calculated_price',
        region_id: region.id,
      });
      return response;
    },
    enabled: !!region?.id,
  });

  const products = productsData?.products || [];

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
        onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
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
            <Text className="text-sm text-gray-500">Color: {color}</Text>
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
            placeholder="Search here..."
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-2 text-base text-gray-900"
          />
        </View>

        <TouchableOpacity className="w-10 h-10 items-center justify-center mr-1">
          <Icon name="filter" size={22} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Icon name="appstore" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Category Title */}
      <View className="px-4 pb-3">
        <Text className="text-2xl font-content-bold text-gray-900">
          {category}
        </Text>
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ProductList;
