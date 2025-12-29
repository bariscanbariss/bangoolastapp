import React, { useState } from 'react';
import { View, ScrollView, KeyboardTypeOptions, TouchableOpacity, Modal } from 'react-native';
import { useLocalization } from '@fluent/react';
import Navbar from '@components/common/navbar';
import Button from '@components/common/button';
import Input from '@components/common/input';
import Text from '@components/common/text';
import Icon from '@react-native-vector-icons/ant-design';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@api/client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HttpTypes } from '@medusajs/types';
import { addressSchema, createEmptyAddress } from '../../types/checkout';

const NORTH_CYPRUS_PROVINCES = [
  { label: 'Girne', value: 'Girne' },
  { label: 'Lefkoşa', value: 'Lefkoşa' },
  { label: 'Gazimağusa', value: 'Gazimağusa' },
  { label: 'İskele', value: 'İskele' },
  { label: 'Güzelyurt', value: 'Güzelyurt' },
  { label: 'Lefke', value: 'Lefke' },
];

type AddressFormData = z.infer<typeof addressSchema>;

type Props = {
  route: {
    params?: {
      address?: HttpTypes.StoreCustomerAddress;
    };
  };
};

type FieldConfig = {
  name: keyof AddressFormData;
  label: string;
  required: boolean;
  keyboardType?: KeyboardTypeOptions;
};

const FIELDS: FieldConfig[] = [
  { name: 'first_name', label: 'first-name', required: true },
  { name: 'last_name', label: 'last-name', required: true },
  { name: 'address_1', label: 'address', required: true },
  { name: 'company', label: 'company', required: false },
  { name: 'postal_code', label: 'postal-code', required: true },
  { name: 'phone', label: 'phone', required: false, keyboardType: 'phone-pad' },
];

const AddressForm = ({ route }: Props) => {
  const { l10n } = useLocalization();
  const address = route.params?.address;
  const isEditing = !!address;
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [showProvinceModal, setShowProvinceModal] = useState(false);

  const defaultValues = isEditing
    ? { ...createEmptyAddress(), ...address }
    : createEmptyAddress();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      first_name: defaultValues.first_name || '',
      last_name: defaultValues.last_name || '',
      address_1: defaultValues.address_1 || '',
      postal_code: defaultValues.postal_code || '',
      city: defaultValues.city || '',
      country_code: 'CY',
      phone: defaultValues.phone || '',
      company: defaultValues.company || undefined,
      province: defaultValues.province || '',
    },
  });

  const addAddressMutation = useMutation({
    mutationFn: async (data: AddressFormData) => {
      if (isEditing && address?.id) {
        await apiClient.store.customer.updateAddress(address.id, data);
      } else {
        await apiClient.store.customer.createAddress(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['address-list'] });
      navigation.goBack();
    },
  });

  const onSubmit = handleSubmit(data => {
    addAddressMutation.mutate(data);
  });

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar
        title={
          isEditing
            ? l10n.getString('edit-address')
            : l10n.getString('add-address')
        }
      />
      <View className="flex-1">
        <ScrollView className="flex-1">
          <View className="p-4">
            {FIELDS.map(field => (
              <Controller
                key={field.name}
                control={control}
                name={field.name}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={l10n.getString(field.label)}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={
                      errors[field.name]?.message
                        ? l10n.getString(errors[field.name]?.message || '')
                        : undefined
                    }
                    required={field.required}
                    keyboardType={field.keyboardType}
                  />
                )}
              />
            ))}

            {/* Province Dropdown */}
            <Controller
              control={control}
              name="province"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    onPress={() => setShowProvinceModal(true)}
                    className={`border rounded-lg px-4 py-3 flex-row items-center justify-between ${
                      errors.province ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <Text className={`text-base ${value ? 'text-gray-900' : 'text-gray-400'}`}>
                      {value || l10n.getString('select-province')}
                    </Text>
                    <Icon name="down" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                  {errors.province?.message && (
                    <Text className="text-red-500 text-xs mt-1">
                      {l10n.getString(errors.province.message)}
                    </Text>
                  )}

                  <Modal
                    visible={showProvinceModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowProvinceModal(false)}
                  >
                    <View className="flex-1 justify-end bg-black/50">
                      <View className="bg-white rounded-t-3xl max-h-96">
                        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                          <Text className="text-lg font-content-bold">{l10n.getString('province')}</Text>
                          <TouchableOpacity onPress={() => setShowProvinceModal(false)}>
                            <Icon name="close" size={24} color="#000" />
                          </TouchableOpacity>
                        </View>
                        <ScrollView className="max-h-80">
                          {NORTH_CYPRUS_PROVINCES.map((province) => (
                            <TouchableOpacity
                              key={province.value}
                              onPress={() => {
                                onChange(province.value);
                                setShowProvinceModal(false);
                              }}
                              className="px-4 py-4 border-b border-gray-100 flex-row items-center justify-between"
                            >
                              <Text className="text-base text-gray-900">{province.label}</Text>
                              {value === province.value && (
                                <Icon name="check" size={20} color="#8e6cef" />
                              )}
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                  </Modal>
                </>
              )}
            />
          </View>
        </ScrollView>
        <View className="p-4 border-t border-gray-200">
          <Button
            title={
              isEditing
                ? l10n.getString('save-changes')
                : l10n.getString('add-address')
            }
            onPress={onSubmit}
            loading={addAddressMutation.isPending}
          />
        </View>
      </View>
    </View>
  );
};

export default AddressForm;
