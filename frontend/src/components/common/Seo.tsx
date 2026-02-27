import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title?: string;
  description?: string;
}

const SITE_NAME = 'Haesiku Tech Blog';

export default function Seo({ title, description = '기술 블로그' }: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
}
