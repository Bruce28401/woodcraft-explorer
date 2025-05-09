import ComponentCard from '@/components/component-card';
import { getComponents } from '@/services/component';
import { locales } from '../i18n/settings';

const Home = async ({ params }: { params: { locale: string } }) => {
  const components = await getComponents();
  return (
    <main className='max-w-screen-2xl mx-auto'>
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
        {components.map((component) => (
          <ComponentCard key={component.component_id} component={component} />
        ))}
      </section>
    </main>
  );
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default Home;
