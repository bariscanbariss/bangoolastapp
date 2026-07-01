import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import Input from '@components/common/input';
import Icon from '@react-native-vector-icons/ant-design';
import { Controller, UseFormReturn, FieldError } from 'react-hook-form';
import { CheckoutFormData, AddressFields } from '../../types/checkout';
import { Path } from 'react-hook-form';

const CITIES = [
  { label: 'Girne', value: 'Girne' },
  { label: 'Lefkoşa', value: 'Lefkoşa' },
  { label: 'Gazimağusa', value: 'Gazimağusa' },
  { label: 'İskele', value: 'İskele' },
  { label: 'Güzelyurt', value: 'Güzelyurt' },
  { label: 'Lefke', value: 'Lefke' },
];

type AddressFormProps = {
  title: string;
  form: UseFormReturn<CheckoutFormData>;
  type: 'shipping' | 'billing';
  isLoading?: boolean;
  countries: { label: string; value: string }[];
};

const AddressForm = ({
  title,
  form,
  type,
  isLoading,
  countries,
}: AddressFormProps) => {
  const { l10n } = useLocalization();
  const [showCityModal, setShowCityModal] = useState(false);
  const {
    control,
    formState: { errors },
    clearErrors,
    setValue,
  } = form;

  // Set default country_code to tr if not set
  React.useEffect(() => {
    const currentCountryCode = form.getValues(`${type}_address.country_code`);
    if (!currentCountryCode) {
      setValue(`${type}_address.country_code` as Path<CheckoutFormData>, 'tr');
    }
  }, []);

  const addressErrors = errors[`${type}_address`] as
    | { [K in keyof AddressFields]?: FieldError }
    | undefined;

  const getFieldName = (field: keyof AddressFields): Path<CheckoutFormData> =>
    `${type}_address.${field}` as Path<CheckoutFormData>;

  const handleFieldChange =
    (field: keyof AddressFields, onChange: (value: string) => void) =>
    (value: string) => {
      clearErrors(`${type}_address.${field}`);
      onChange(value);
    };

  return (
    <View className="space-y-4">
      <Controller
        control={control}
        name={getFieldName('first_name')}
        render={({ field: { onChange, value } }) => (
          <Input
            label={l10n.getString('first-name')}
            value={value as string}
            onChangeText={handleFieldChange('first_name', onChange)}
            error={addressErrors?.first_name?.message}
            editable={!isLoading}
          />
        )}
      />
      <Controller
        control={control}
        name={getFieldName('last_name')}
        render={({ field: { onChange, value } }) => (
          <Input
            label={l10n.getString('last-name')}
            value={value as string}
            onChangeText={handleFieldChange('last_name', onChange)}
            error={addressErrors?.last_name?.message}
            editable={!isLoading}
          />
        )}
      />
      <Controller
        control={control}
        name={getFieldName('phone')}
        render={({ field: { onChange, value } }) => (
          <Input
            label={l10n.getString('phone')}
            value={value as string}
            onChangeText={handleFieldChange('phone', onChange)}
            error={addressErrors?.phone?.message}
            editable={!isLoading}
          />
        )}
      />
      <Controller
        control={control}
        name={getFieldName('address_1')}
        render={({ field: { onChange, value } }) => (
          <Input
            label={l10n.getString('address')}
            value={value as string}
            onChangeText={handleFieldChange('address_1', onChange)}
            error={addressErrors?.address_1?.message}
            editable={!isLoading}
          />
        )}
      />
      <Controller
        control={control}
        name={getFieldName('city')}
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity
              onPress={() => !isLoading && setShowCityModal(true)}
              disabled={isLoading}
              className={`border rounded-lg px-4 py-3 flex-row items-center justify-between ${
                addressErrors?.city ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <Text className={`text-base ${value ? 'text-gray-900' : 'text-gray-400'}`}>
                {(value as string) || l10n.getString('select-city')}
              </Text>
              <Icon name="down" size={16} color="#9CA3AF" />
            </TouchableOpacity>
            {addressErrors?.city?.message && (
              <Text className="text-red-500 text-xs mt-1">
                {l10n.getString(addressErrors.city.message)}
              </Text>
            )}

            <Modal
              visible={showCityModal}
              transparent
              animationType="slide"
              onRequestClose={() => setShowCityModal(false)}
            >
              <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl max-h-96">
                  <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                    <Text className="text-lg font-content-bold">{l10n.getString('city')}</Text>
                    <TouchableOpacity onPress={() => setShowCityModal(false)}>
                      <Icon name="close" size={24} color="#000" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView className="max-h-80">
                    {CITIES.map((city) => (
                      <TouchableOpacity
                        key={city.value}
                        onPress={() => {
                          clearErrors(`${type}_address.city`);
                          onChange(city.value);
                          setShowCityModal(false);
                        }}
                        className="px-4 py-4 border-b border-gray-100 flex-row items-center justify-between"
                      >
                        <Text className="text-base text-gray-900">{city.label}</Text>
                        {value === city.value && (
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
      <Controller
        control={control}
        name={getFieldName('postal_code')}
        render={({ field: { onChange, value } }) => (
          <Input
            label={l10n.getString('postal-code')}
            value={value as string}
            onChangeText={handleFieldChange('postal_code', onChange)}
            error={addressErrors?.postal_code?.message}
            editable={!isLoading}
            autoComplete="off"
          />
        )}
      />
      <Controller
        control={control}
        name={getFieldName('company')}
        render={({ field: { onChange, value } }) => (
          <Input
            label={`${l10n.getString('company')} (${l10n.getString(
              'optional',
            )})`}
            value={value as string}
            onChangeText={handleFieldChange('company', onChange)}
            error={addressErrors?.company?.message}
            editable={!isLoading}
          />
        )}
      />
    </View>
  );
};

export default AddressForm;
