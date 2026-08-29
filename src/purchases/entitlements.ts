import type { Operation } from '../types/game';

export const UNLOCK_ALL_OPERATIONS_SKU = 'com.reddlamar.sunlitmath.unlock_operations';

export const FREE_OPERATION: Operation = 'addition';

export function isOperationLocked(operation: Operation, isUnlocked: boolean): boolean {
  return operation !== FREE_OPERATION && !isUnlocked;
}
