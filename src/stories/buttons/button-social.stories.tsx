import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ButtonSocial, type SocialProvider } from '@/ui/buttons';

/**
 * ButtonSocial is a specialized authentication button designed for social login flows.
 * It provides pre-styled buttons for popular OAuth providers including Google, Apple,
 * Facebook, Twitter, GitHub, and Microsoft.
 *
 * ## Features
 * - **6 OAuth Providers**: Google, Apple, Facebook, Twitter, GitHub, Microsoft
 * - **2 Style Variants**: filled (branded colors), outline (neutral)
 * - **Icon-only Mode**: Compact version for space-constrained layouts
 * - **Loading State**: Shows spinner during authentication
 * - **Accessibility**: Proper ARIA attributes and keyboard navigation
 *
 * ## Usage
 * ```tsx
 * import { ButtonSocial } from '@/ui';
 *
 * <ButtonSocial provider="google" />
 * <ButtonSocial provider="apple" variant="outline" />
 * <ButtonSocial provider="github" iconOnly aria-label="Sign in with GitHub" />
 * ```
 */
const meta = {
  title: 'Buttons/ButtonSocial',
  component: ButtonSocial,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    provider: {
      control: 'select',
      options: [
        'google',
        'apple',
        'facebook',
        'twitter',
        'github',
        'microsoft',
      ] as SocialProvider[],
      description: 'The OAuth provider for branding',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outline'],
      description: 'Visual style variant',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Show only the provider icon without text',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner and disables interaction',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label (required for icon-only buttons)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function',
    },
  },
} satisfies Meta<typeof ButtonSocial>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Google button with filled style.
 */
export const Default: Story = {
  args: {
    provider: 'google',
    variant: 'filled',
  },
};

/**
 * All 6 OAuth providers with filled (branded) style.
 */
export const AllProvidersFilled: Story = {
  args: { provider: 'google' },
  render: () => (
    <div className="flex flex-col gap-4">
      <ButtonSocial provider="google" />
      <ButtonSocial provider="apple" />
      <ButtonSocial provider="facebook" />
      <ButtonSocial provider="twitter" />
      <ButtonSocial provider="github" />
      <ButtonSocial provider="microsoft" />
    </div>
  ),
};

/**
 * All 6 OAuth providers with outline (neutral) style.
 */
export const AllProvidersOutline: Story = {
  args: { provider: 'google', variant: 'outline' },
  render: () => (
    <div className="flex flex-col gap-4">
      <ButtonSocial provider="google" variant="outline" />
      <ButtonSocial provider="apple" variant="outline" />
      <ButtonSocial provider="facebook" variant="outline" />
      <ButtonSocial provider="twitter" variant="outline" />
      <ButtonSocial provider="github" variant="outline" />
      <ButtonSocial provider="microsoft" variant="outline" />
    </div>
  ),
};

/**
 * Icon-only buttons for all providers. Useful for compact layouts.
 * Note: Icon-only buttons require `aria-label` for accessibility.
 */
export const IconOnly: Story = {
  args: {
    provider: 'google',
    iconOnly: true,
    'aria-label': 'Sign in with Google',
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ButtonSocial provider="google" iconOnly aria-label="Sign in with Google" />
      <ButtonSocial provider="apple" iconOnly aria-label="Sign in with Apple" />
      <ButtonSocial
        provider="facebook"
        iconOnly
        aria-label="Sign in with Facebook"
      />
      <ButtonSocial
        provider="twitter"
        iconOnly
        aria-label="Sign in with Twitter"
      />
      <ButtonSocial provider="github" iconOnly aria-label="Sign in with GitHub" />
      <ButtonSocial
        provider="microsoft"
        iconOnly
        aria-label="Sign in with Microsoft"
      />
    </div>
  ),
};

/**
 * Icon-only buttons with outline variant.
 */
export const IconOnlyOutline: Story = {
  args: {
    provider: 'google',
    iconOnly: true,
    variant: 'outline',
    'aria-label': 'Sign in with Google',
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ButtonSocial
        provider="google"
        iconOnly
        variant="outline"
        aria-label="Sign in with Google"
      />
      <ButtonSocial
        provider="apple"
        iconOnly
        variant="outline"
        aria-label="Sign in with Apple"
      />
      <ButtonSocial
        provider="facebook"
        iconOnly
        variant="outline"
        aria-label="Sign in with Facebook"
      />
      <ButtonSocial
        provider="twitter"
        iconOnly
        variant="outline"
        aria-label="Sign in with Twitter"
      />
      <ButtonSocial
        provider="github"
        iconOnly
        variant="outline"
        aria-label="Sign in with GitHub"
      />
      <ButtonSocial
        provider="microsoft"
        iconOnly
        variant="outline"
        aria-label="Sign in with Microsoft"
      />
    </div>
  ),
};

/**
 * Loading state with spinner animation.
 */
export const LoadingState: Story = {
  args: { provider: 'google', loading: true },
  render: () => (
    <div className="flex flex-col gap-4">
      <ButtonSocial provider="google" loading />
      <ButtonSocial provider="apple" variant="outline" loading />
      <ButtonSocial
        provider="github"
        iconOnly
        loading
        aria-label="Signing in with GitHub"
      />
    </div>
  ),
};

/**
 * Disabled state with reduced opacity and no interaction.
 */
export const DisabledState: Story = {
  args: { provider: 'google', disabled: true },
  render: () => (
    <div className="flex flex-col gap-4">
      <ButtonSocial provider="google" disabled />
      <ButtonSocial provider="apple" variant="outline" disabled />
      <ButtonSocial
        provider="github"
        iconOnly
        disabled
        aria-label="Sign in with GitHub"
      />
    </div>
  ),
};

/**
 * Button stretching to container width using className override.
 */
export const FullWidth: Story = {
  args: { provider: 'google', className: 'w-full' },
  render: () => (
    <div className="flex w-[400px] flex-col gap-4">
      <ButtonSocial provider="google" className="w-full" />
      <ButtonSocial provider="apple" variant="outline" className="w-full" />
    </div>
  ),
};

/**
 * Real-world usage example in a login form layout.
 */
export const LoginFormExample: Story = {
  args: { provider: 'google' },
  render: () => (
    <div className="border-border-primary w-[320px] rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-center text-xl font-semibold text-text-primary">
        Sign in to your account
      </h2>
      <div className="flex flex-col gap-3">
        <ButtonSocial provider="google" className="w-full" />
        <ButtonSocial provider="apple" className="w-full" />
        <ButtonSocial provider="github" className="w-full" />
      </div>
      <div className="my-6 flex items-center gap-3">
        <div className="bg-border-primary h-px flex-1" />
        <span className="text-sm text-text-secondary">or</span>
        <div className="bg-border-primary h-px flex-1" />
      </div>
      <p className="text-center text-sm text-text-secondary">
        Continue with email instead
      </p>
    </div>
  ),
};

/**
 * Compact login options using icon-only buttons.
 */
export const CompactLoginExample: Story = {
  args: {
    provider: 'google',
    iconOnly: true,
    'aria-label': 'Sign in with Google',
  },
  render: () => (
    <div className="border-border-primary w-[280px] rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-center text-lg font-semibold text-text-primary">
        Quick sign in
      </h2>
      <div className="flex justify-center gap-3">
        <ButtonSocial
          provider="google"
          iconOnly
          aria-label="Sign in with Google"
        />
        <ButtonSocial provider="apple" iconOnly aria-label="Sign in with Apple" />
        <ButtonSocial
          provider="github"
          iconOnly
          aria-label="Sign in with GitHub"
        />
        <ButtonSocial
          provider="microsoft"
          iconOnly
          aria-label="Sign in with Microsoft"
        />
      </div>
    </div>
  ),
};

/**
 * Complete matrix showing all provider × variant combinations.
 */
export const CompleteMatrix: Story = {
  args: { provider: 'google' },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Filled Variant</h3>
        <div className="flex flex-col gap-3">
          <ButtonSocial provider="google" />
          <ButtonSocial provider="apple" />
          <ButtonSocial provider="facebook" />
          <ButtonSocial provider="twitter" />
          <ButtonSocial provider="github" />
          <ButtonSocial provider="microsoft" />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Outline Variant</h3>
        <div className="flex flex-col gap-3">
          <ButtonSocial provider="google" variant="outline" />
          <ButtonSocial provider="apple" variant="outline" />
          <ButtonSocial provider="facebook" variant="outline" />
          <ButtonSocial provider="twitter" variant="outline" />
          <ButtonSocial provider="github" variant="outline" />
          <ButtonSocial provider="microsoft" variant="outline" />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Icon Only (Filled)</h3>
        <div className="flex flex-wrap gap-3">
          <ButtonSocial provider="google" iconOnly aria-label="Google" />
          <ButtonSocial provider="apple" iconOnly aria-label="Apple" />
          <ButtonSocial provider="facebook" iconOnly aria-label="Facebook" />
          <ButtonSocial provider="twitter" iconOnly aria-label="Twitter" />
          <ButtonSocial provider="github" iconOnly aria-label="GitHub" />
          <ButtonSocial provider="microsoft" iconOnly aria-label="Microsoft" />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Icon Only (Outline)</h3>
        <div className="flex flex-wrap gap-3">
          <ButtonSocial
            provider="google"
            iconOnly
            variant="outline"
            aria-label="Google"
          />
          <ButtonSocial
            provider="apple"
            iconOnly
            variant="outline"
            aria-label="Apple"
          />
          <ButtonSocial
            provider="facebook"
            iconOnly
            variant="outline"
            aria-label="Facebook"
          />
          <ButtonSocial
            provider="twitter"
            iconOnly
            variant="outline"
            aria-label="Twitter"
          />
          <ButtonSocial
            provider="github"
            iconOnly
            variant="outline"
            aria-label="GitHub"
          />
          <ButtonSocial
            provider="microsoft"
            iconOnly
            variant="outline"
            aria-label="Microsoft"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">States</h3>
        <div className="flex flex-wrap gap-4">
          <div className="text-center">
            <ButtonSocial provider="google" />
            <p className="mt-1 text-xs text-text-subtle">Default</p>
          </div>
          <div className="text-center">
            <ButtonSocial provider="google" disabled />
            <p className="mt-1 text-xs text-text-subtle">Disabled</p>
          </div>
          <div className="text-center">
            <ButtonSocial provider="google" loading />
            <p className="mt-1 text-xs text-text-subtle">Loading</p>
          </div>
        </div>
      </div>
    </div>
  ),
};
