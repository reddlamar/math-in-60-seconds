import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useIAP } from 'expo-iap';
import { PurchaseProvider, usePurchase } from './PurchaseContext';
import { UNLOCK_ALL_OPERATIONS_SKU } from './entitlements';

const mockUseIAP = useIAP as jest.Mock;

function Probe() {
  const { isUnlocked, price, purchase, restore } = usePurchase();
  return (
    <>
      <Text>{isUnlocked ? 'unlocked' : 'locked'}</Text>
      <Text onPress={purchase}>{price ? `price:${price}` : 'no-price'}</Text>
      <Text testID="restore" onPress={restore}>
        restore
      </Text>
    </>
  );
}

describe('PurchaseProvider', () => {
  beforeEach(() => {
    mockUseIAP.mockReset();
  });

  it('starts locked when there is no stored entitlement and the store is disconnected', async () => {
    mockUseIAP.mockReturnValue({
      connected: false,
      products: [],
      availablePurchases: [],
      finishTransaction: jest.fn(),
      getAvailablePurchases: jest.fn(),
      fetchProducts: jest.fn(),
      requestPurchase: jest.fn(),
      restorePurchases: jest.fn(),
    });

    const { findByText } = await render(
      <PurchaseProvider>
        <Probe />
      </PurchaseProvider>
    );

    expect(await findByText('locked')).toBeTruthy();
  });

  it('unlocks when a previous purchase is found among available purchases', async () => {
    mockUseIAP.mockReturnValue({
      connected: true,
      products: [],
      availablePurchases: [{ productId: UNLOCK_ALL_OPERATIONS_SKU }],
      finishTransaction: jest.fn(),
      getAvailablePurchases: jest.fn(),
      fetchProducts: jest.fn(),
      requestPurchase: jest.fn(),
      restorePurchases: jest.fn(),
    });

    const { findByText } = await render(
      <PurchaseProvider>
        <Probe />
      </PurchaseProvider>
    );

    expect(await findByText('unlocked')).toBeTruthy();
  });

  it('unlocks once onPurchaseSuccess fires for the unlock SKU, and finishes the transaction', async () => {
    const finishTransaction = jest.fn().mockResolvedValue(undefined);
    let capturedOptions: any;
    mockUseIAP.mockImplementation((options: any) => {
      capturedOptions = options;
      return {
        connected: true,
        products: [{ id: UNLOCK_ALL_OPERATIONS_SKU, displayPrice: '$2.50' }],
        availablePurchases: [],
        finishTransaction,
        getAvailablePurchases: jest.fn(),
        fetchProducts: jest.fn(),
        requestPurchase: jest.fn(),
        restorePurchases: jest.fn(),
      };
    });

    const { findByText } = await render(
      <PurchaseProvider>
        <Probe />
      </PurchaseProvider>
    );

    expect(await findByText('price:$2.50')).toBeTruthy();

    const purchase = { productId: UNLOCK_ALL_OPERATIONS_SKU, id: 'txn-1' };
    await capturedOptions.onPurchaseSuccess(purchase);

    expect(await findByText('unlocked')).toBeTruthy();
    expect(finishTransaction).toHaveBeenCalledWith({ purchase, isConsumable: false });
  });

  it('refreshes available purchases when Restore Purchase is pressed', async () => {
    const restorePurchases = jest.fn().mockResolvedValue(undefined);
    const getAvailablePurchases = jest.fn().mockResolvedValue(undefined);
    mockUseIAP.mockReturnValue({
      connected: true,
      products: [],
      availablePurchases: [],
      finishTransaction: jest.fn(),
      getAvailablePurchases,
      fetchProducts: jest.fn(),
      requestPurchase: jest.fn(),
      restorePurchases,
    });

    const { getByTestId } = await render(
      <PurchaseProvider>
        <Probe />
      </PurchaseProvider>
    );

    fireEvent.press(getByTestId('restore'));

    await waitFor(() => {
      expect(restorePurchases).toHaveBeenCalled();
      expect(getAvailablePurchases).toHaveBeenCalled();
    });
  });
});
