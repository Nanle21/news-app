import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CheckboxInput, Logo, TextInput } from '../../../components';
import { useAuth } from '../../../hooks/useAuth';
import { useAppDispatch } from '../../../store/hooks';
import { showNotification } from '../../../store/slices/uiSlice';
import { handleApiError, setFieldErrors } from '../../../utils/formErrorHandler';
import { type LoginFormData, loginSchema } from '../schemas';

export default function Login() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { login, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const formErrorHandler = {
    setError,
    setFieldErrors: (errors: Record<string, string[]>) => setFieldErrors(setError, errors),
    clearErrors,
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password });
      dispatch(showNotification({ message: 'Login successful!', type: 'success' }));
      // Routing will automatically redirect
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
            {t('auth.signInTitle')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.orCreateAccount')}{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('auth.signUp')}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="rounded-md shadow-sm -space-y-px">
            <TextInput
              id="email"
              type="email"
              autoComplete="email"
              register={register('email')}
              placeholder={t('auth.email')}
              disabled={isLoading}
              error={errors.email}
              className="rounded-t-md"
            />
            <TextInput
              id="password"
              type="password"
              autoComplete="current-password"
              register={register('password')}
              placeholder={t('auth.password')}
              disabled={isLoading}
              error={errors.password}
              className="rounded-b-md"
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

          <div className="flex items-center justify-between">
            <CheckboxInput
              id="rememberMe"
              register={register('rememberMe')}
              disabled={isLoading}
              error={errors.rememberMe}
            >
              {t('auth.rememberMe')}
            </CheckboxInput>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Loading spinner"
                >
                  <title>{t('common.loading')}</title>
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : null}
              {isLoading ? t('auth.signingIn') : t('auth.signIn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
