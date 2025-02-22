import React from 'react';

import { ThemeProvider } from 'theme-ui';
import theme from 'theme';

import SEO from 'components/seo';
import Layout from 'components/layout';
import Banner from 'sections/banner';
import Support from 'sections/idea';
import PremiumFeature from 'sections/premium-feature';
import AppFeature from 'sections/app-feature';
import Dashboard from 'sections/about';
import Pricing from 'sections/pricing';
import Subscribe from 'sections/subscribe';

export default function IndexPage() {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <SEO
          title="Startup Agency Alpha Landing"
          description="Coleção de modelos de landings gratuitos de topo de linha, criados com o react / next js. Gratuito para baixar, basta editar e implantar!"
        />
        <Banner />
        <Support />
        <PremiumFeature />
        <Subscribe />
        <Dashboard />
      </Layout>
    </ThemeProvider>
  );
}
