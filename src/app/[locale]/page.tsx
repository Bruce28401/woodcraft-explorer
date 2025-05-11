// Removed 'use client'

import HomePageContent from '@/components/home-page-content';
import { locales } from '@/app/i18n/settings';

// This function needs to be defined outside the client component
// or be static if it's intended for generateStaticParams.
// For client-side rendering, this component becomes the default export.
export default function Home({ params }: { params: { locale: string } }) {
  // The actual rendering is now handled by HomePageContent
  return <HomePageContent />;
}


// generateStaticParams should remain if you want to pre-render 
// the basic shell for each locale.
export async function generateStaticParams() {
  // const languages = await getAvailableLocales(); // Example if locales were dynamic
  return locales.map((locale) => ({ locale }));
}

