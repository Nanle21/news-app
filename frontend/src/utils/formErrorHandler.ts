import { ApiException } from '../services/api';
import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';

export interface FormErrorHandler<T extends FieldValues = FieldValues> {
  setError: UseFormSetError<T>;
  setFieldErrors: (errors: Record<string, string[]>) => void;
  clearErrors: () => void;
}

export function handleApiError<T extends FieldValues = FieldValues>(
  error: unknown,
  formErrorHandler: FormErrorHandler<T>
): string {
  // Clear previous errors
  formErrorHandler.clearErrors();

  // Handle ApiException with validation errors
  if (error instanceof ApiException && error.errors) {
    formErrorHandler.setFieldErrors(error.errors);
    return error.message;
  }

  // Handle other ApiException
  if (error instanceof ApiException) {
    return error.message;
  }

  // Handle generic errors
  if (error instanceof Error) {
    return error.message;
  }

  // Handle unknown errors
  return 'An unexpected error occurred. Please try again.';
}

export function setFieldErrors<T extends FieldValues = FieldValues>(
  setError: UseFormSetError<T>,
  errors: Record<string, string[]>
): void {
  for (const [field, messages] of Object.entries(errors)) {
    setError(field as Path<T>, {
      type: 'server',
      message: messages[0] || 'Invalid value',
    });
  }
}

export function clearFormErrors<T extends FieldValues = FieldValues>(
  setError: UseFormSetError<T>
): void {
  // This is a workaround since react-hook-form doesn't have a clearAll method
  // We'll rely on the form to clear errors when re-rendering
} 