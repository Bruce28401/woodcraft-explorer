import { defaultLocale } from './settings';

export function redirect() {
  return {
    redirect: {
      destination: `/${defaultLocale}/`,
      permanent: false,
    },
  };
}