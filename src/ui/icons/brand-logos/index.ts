export { AppleLogo } from './apple-logo';
export { FacebookLogo } from './facebook-logo';
export { GitHubLogo } from './github-logo';
export { GoogleLogo } from './google-logo';
export { MicrosoftLogo } from './microsoft-logo';
export { TwitterLogo } from './twitter-logo';

export const brandLogos = {
  google: () =>
    import('./google-logo').then((mod) => ({ default: mod.GoogleLogo })),
  apple: () => import('./apple-logo').then((mod) => ({ default: mod.AppleLogo })),
  facebook: () =>
    import('./facebook-logo').then((mod) => ({ default: mod.FacebookLogo })),
  twitter: () =>
    import('./twitter-logo').then((mod) => ({ default: mod.TwitterLogo })),
  github: () =>
    import('./github-logo').then((mod) => ({ default: mod.GitHubLogo })),
  microsoft: () =>
    import('./microsoft-logo').then((mod) => ({ default: mod.MicrosoftLogo })),
} as const;

export type BrandProvider = keyof typeof brandLogos;
