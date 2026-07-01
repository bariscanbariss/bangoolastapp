import React, { useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '@components/common/navbar';
import ProductsList from '@components/product/product-list';
import Loader from '@components/common/loader';
import ErrorUI from '@components/common/error-ui';
import apiClient from '@api/client';
import { useQuery } from '@tanstack/react-query';

const RECENT_CATEGORIES_KEY = '@recent_categories';
const MAX_RECENT_CATEGORIES = 4;

type CategoryDetailRouteParams = {
  route: {
    params: {
      categoryId: string;
    };
  };
};

export default function CategoryDetail({ route }: CategoryDetailRouteParams) {
  const { categoryId } = route.params;

  const { data, isPending, error } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => apiClient.store.category.retrieve(categoryId),
  });

  // Save category to recent searches when viewed
  useEffect(() => {
    const saveRecentCategory = async () => {
      try {
        const stored = await AsyncStorage.getItem(RECENT_CATEGORIES_KEY);
        const recentCategories = stored ? JSON.parse(stored) : [];

        const updated = [
          categoryId,
          ...recentCategories.filter((id: string) => id !== categoryId),
        ].slice(0, MAX_RECENT_CATEGORIES);

        await AsyncStorage.setItem(RECENT_CATEGORIES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving recent category:', error);
      }
    };

    if (categoryId) {
      saveRecentCategory();
    }
  }, [categoryId]);

  if (isPending) {
    return <Loader />;
  }

  if (error || !data?.product_category) {
    return <ErrorUI />;
  }

  const category = data.product_category;

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={category.name} />
      <View className="flex-1 mt-4">
        <ProductsList
          queryKey={['products', 'category', category.id]}
          additionalParams={{
            category_id: category.id,
          }}
          hideTitle
        />
      </View>
    </View>
  );
}
