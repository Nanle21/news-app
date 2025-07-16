import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CheckboxInput, LoadingSpinner, Logo, TextInput } from '../../../components';
import { useAuth } from '../../../hooks/useAuth';
import { useAppDispatch } from '../../../store/hooks';
import { showNotification } from '../../../store/slices/uiSlice';
import { handleApiError, setFieldErrors } from '../../../utils/formErrorHandler';
import { type RegisterFormData, registerSchema } from '../schemas';

export default function Register() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { register: registerUser, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const formErrorHandler = {
    setError,
    setFieldErrors: (errors: Record<string, string[]>) => setFieldErrors(setError, errors),
    clearErrors,
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });
      dispatch(
        showNotification({
          message: 'Registration successful! Please check your email to verify your account.',
          type: 'success',
        })
      );
      reset();
      // User will be automatically redirected to dashboard if registration includes auto-login
      // Otherwise, they'll stay on this page and can navigate to login
    } catch (err: unknown) {
      const errorMessage = handleApiError(err, formErrorHandler);
      
      // If no field-specific errors were set, show a general error
      if (!Object.keys(errors).length) {
        dispatch(showNotification({ message: errorMessage, type: 'error' }));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('auth.signUpTitle')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.orSignIn')}{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('auth.signIn')}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            <TextInput
              id="name"
              label={t('auth.fullName')}
              type="text"
              autoComplete="name"
              register={register('name')}
              placeholder={t('auth.fullName')}
              disabled={isLoading}
              error={errors.name}
            />

            <TextInput
              id="email"
              label={t('auth.email')}
              type="email"
              autoComplete="email"
              register={register('email')}
              placeholder={t('auth.email')}
              disabled={isLoading}
              error={errors.email}
            />

            <TextInput
              id="password"
              label={t('auth.password')}
              type="password"
              autoComplete="new-password"
              register={register('password')}
              placeholder={t('auth.password')}
              disabled={isLoading}
              error={errors.password}
            />

            <TextInput
              id="confirmPassword"
              label={t('auth.confirmPassword')}
              type="password"
              autoComplete="new-password"
              register={register('confirmPassword')}
              placeholder={t('auth.confirmPassword')}
              disabled={isLoading}
              error={errors.confirmPassword}
            />
          </div>

          {/* General Error Display */}
          {error && !Object.keys(errors).length && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <CheckboxInput
            id="agreeToTerms"
            register={register('agreeToTerms')}
            disabled={isLoading}
            error={errors.agreeToTerms}
          >
            {t('auth.agreeToTerms')}{' '}
            <Link
              to="/terms"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Terms and Conditions
            </Link>
          </CheckboxInput>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {isLoading ? <LoadingSpinner size="sm" showText={false} className="mr-3" /> : null}
              {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
