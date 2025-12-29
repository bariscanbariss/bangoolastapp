import React, { useState } from 'react';
import { View, TouchableOpacity, Keyboard, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import Input from '@components/common/input';
import { useCustomer } from '@data/customer-context';
import { useFavorites } from '@data/favorites-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Button from '@components/common/button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Icon from '@react-native-vector-icons/ant-design';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import { useColors } from '@styles/hooks';
import { WebView } from 'react-native-webview';
import { apiUrl } from '@api/client';

const signInSchema = z.object({
  email: z.string().email('invalid-email-address'),
  password: z.string().min(3, 'password-must-be-at-least-n-characters'),
  rememberMe: z.boolean().optional(),
});

type SignInSchema = z.infer<typeof signInSchema>;

const SignIn = () => {
  const { l10n } = useLocalization();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [webViewLoading, setWebViewLoading] = useState(true);
  const { login, googleLogin, customer, refreshCustomer } = useCustomer();
  const { syncFavoritesWithBackend } = useFavorites();
  const navigation = useNavigation();
  const colors = useColors();

  const {
    control,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SignInSchema) => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      await login(data.email, data.password);

      // Sync favorites with backend after successful login
      await syncFavoritesWithBackend();

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Main',
              state: {
                routes: [{ name: 'Home' }],
              },
            },
          ],
        }),
      );
    } catch (err) {
      setFormError('root', {
        type: 'manual',
        message:
          err instanceof Error
            ? err.message
            : 'Invalid credentials',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setShowWebView(true);
    setWebViewLoading(true);
  };

  const handleWebViewNavigationStateChange = async (navState: any) => {
    const { url } = navState;

    // Check if this is the callback URL
    if (url.includes('/auth/google/callback') || url.includes('/auth/callback')) {
      try {
        setShowWebView(false);
        setLoading(true);

        // After Google auth, the backend should have set auth cookies
        // Wait a bit for cookies to be properly set
        await new Promise(resolve => setTimeout(resolve, 500));

        // Refresh customer data to verify authentication
        await refreshCustomer();

        // Sync favorites with backend after successful login
        await syncFavoritesWithBackend();

        // Navigate to home
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Main',
                state: {
                  routes: [{ name: 'Home' }],
                },
              },
            ],
          }),
        );
      } catch (error) {
        console.error('Google login failed:', error);
        alert('Google login failed. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setShowWebView(false);
  };

  return (
    <View className="flex-1 bg-white p-safe">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-12 pb-6">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-8"
          >
            <MaterialIcon name="arrow-left" size={24} color={colors.content} />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-content-bold text-gray-900 mb-2">
              {l10n.getString('welcome')}
            </Text>
            <Text className="text-base text-gray-500">
              {l10n.getString('sign-in-to-continue-shopping')}
            </Text>
          </View>

          {/* Error Message */}
          {errors.root && (
            <View className="mb-4 p-3 bg-red-50 rounded-lg">
              <Text className="text-red-600 text-center">
                {errors.root.message}
              </Text>
            </View>
          )}

          {/* Email Input */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label={l10n.getString('email')}
                placeholder={l10n.getString('enter-your-email')}
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
                error={
                  errors.email?.message
                    ? l10n.getString(errors.email.message)
                    : undefined
                }
                containerClassName="mb-4"
              />
            )}
          />

          {/* Password Input with Forgot Link */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-content text-gray-700">{l10n.getString('password')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text className="text-sm text-primary font-content">
                  {l10n.getString('forgot-password')}
                </Text>
              </TouchableOpacity>
            </View>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder={l10n.getString('enter-your-password')}
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  error={
                    errors.password?.message
                      ? l10n.getString(errors.password.message, { n: 3 })
                      : undefined
                  }
                  containerClassName="mb-0"
                />
              )}
            />
          </View>

          {/* Remember Me */}
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            className="flex-row items-center mb-6"
          >
            <View
              className={`w-5 h-5 rounded border-2 mr-2 items-center justify-center ${
                rememberMe ? 'bg-primary border-primary' : 'border-gray-300'
              }`}
            >
              {rememberMe && <Icon name="check" size={12} color="white" />}
            </View>
            <Text className="text-sm text-gray-700">{l10n.getString('remember-me')}</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Button
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            title={loading ? l10n.getString('signing-in') : l10n.getString('login')}
            className="mb-6"
          />

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="px-4 text-gray-500 text-sm">{l10n.getString('or')}</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Google Login Button */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            className="flex-row items-center justify-center py-3 px-4 bg-white border border-gray-300 rounded-lg mb-6"
            style={{ elevation: 1, shadowColor: '#000', shadowOpacity: 0.1 }}
          >
            <MaterialIcon name="google" size={20} color="#4285F4" />
            <Text className="text-base text-gray-700 font-content ml-2">
              {l10n.getString('continue-with-google')}
            </Text>
          </TouchableOpacity>

          {/* Register Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600">{l10n.getString('dont-have-an-account')} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-primary font-content-bold">{l10n.getString('register')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Google OAuth WebView Modal */}
      <Modal
        visible={showWebView}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowWebView(false)}
      >
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <Text className="text-lg font-content-bold">Sign in with Google</Text>
            <TouchableOpacity
              onPress={() => setShowWebView(false)}
              className="w-8 h-8 items-center justify-center"
            >
              <Icon name="close" size={20} color={colors.content} />
            </TouchableOpacity>
          </View>

          {/* Loading Indicator */}
          {webViewLoading && (
            <View className="absolute top-14 left-0 right-0 items-center py-2 bg-gray-100">
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          )}

          {/* WebView */}
          <WebView
            source={{ uri: `${apiUrl}/auth/google` }}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            onError={handleWebViewError}
            onLoadStart={() => setWebViewLoading(true)}
            onLoadEnd={() => setWebViewLoading(false)}
            startInLoadingState={true}
            renderLoading={() => (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
          />
        </View>
      </Modal>
    </View>
  );
};

export default SignIn;
