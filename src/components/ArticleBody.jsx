import { PortableText } from '@portabletext/react';
import { urlFor } from '../blog/sanity';

const isExternal = (href = '') => /^https?:\/\//.test(href);

const components = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        {...(isExternal(value?.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) =>
      value?.asset ? (
        <figure>
          <img
            src={urlFor(value).width(1440).fit('max').url()}
            alt={value.alt || ''}
            loading="lazy"
            decoding="async"
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      ) : null,
  },
};

/** Article text from Sanity (Portable Text). */
export default function ArticleBody({ value }) {
  return (
    <div className="article__body">
      <PortableText value={value} components={components} />
    </div>
  );
}
