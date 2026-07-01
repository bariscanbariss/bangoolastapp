import React from 'react';
import { TouchableNativeFeedback, View } from 'react-native';
import { useColors } from '@styles/hooks';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Icon from '@react-native-vector-icons/ant-design';
import Badge from '@components/common/badge';
import { useCart } from '@data/cart-context';
import { useFavorites } from '@data/favorites-context';

function TabBar({ state, navigation }: BottomTabBarProps) {
  const colors = useColors();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const favoritesCount = favorites.length;

  const iconMap: Record<string, any> = {
    Home: 'home',
    Favorites: 'heart',
    Cart: 'shopping',
    Profile: 'user',
  };

  return (
    <View className="flex-row justify-around bg-background items-center elevation-lg pb-safe">
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const iconName = iconMap[route.name];

        return (
          <TouchableNativeFeedback
            key={route.key}
            onPress={onPress}
            className="flex-1 "
          >
            <View className="flex-1 h-16 justify-center items-center">
              <View>
                <Icon
                  name={iconName}
                  size={24}
                  color={isFocused ? colors.primary : colors.content}
                />
                {/* Badge for Cart */}
                {route.name === 'Cart' && totalItems > 0 && (
                  <View className="absolute -top-1 -right-2">
                    <Badge quantity={totalItems} />
                  </View>
                )}
                {/* Badge for Favorites */}
                {route.name === 'Favorites' && favoritesCount > 0 && (
                  <View className="absolute -top-1 -right-2">
                    <Badge quantity={favoritesCount} />
                  </View>
                )}
              </View>
              {/* Active indicator dot */}
              {isFocused && (
                <View
                  className="absolute bottom-2 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              )}
            </View>
          </TouchableNativeFeedback>
        );
      })}
    </View>
  );
}

export default TabBar;
