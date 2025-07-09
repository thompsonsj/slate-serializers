import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  SlateToReact,
  SlateToReactConfig,
  payloadSlateToReactConfig,
} from '@slate-serializers/react';
import { Post } from './payload-types';

// Type guard for Post
const isPost = (post: Post): post is Post => {
  return typeof post.id === 'string';
};

describe('React conversion - Payload CMS fixtures', () => {
  const fixture: Post['content'] = [
    {
      children: [
        {
          text: 'Example post content with an ',
        },
        {
          children: [
            {
              text: 'internal link to another post',
            },
          ],
          doc: {
            value: {
              id: '65cd31a44e1969ec392ec2d9',
              title: 'Example post',
              author: '65cd31594e1969ec392ec280',
              publishedDate: '2024-02-14T12:00:00.000Z',
              category: '65cd319e4e1969ec392ec2d5',
              content: [
                {
                  children: [
                    {
                      text: 'Example post contents.',
                    },
                  ],
                },
              ],
              status: 'published',
              createdAt: '2024-02-14T21:33:24.860Z',
              updatedAt: '2024-02-14T21:33:24.860Z',
            },
            relationTo: 'posts',
          },
          linkType: 'internal',
          type: 'link',
        },
        {
          text: '.',
        },
      ],
    },
  ];

  test('convert internal link', async () => {
    const tree = render(
      <SlateToReact node={fixture} config={payloadSlateToReactConfig} />,
    );
    expect(tree.container).toMatchInlineSnapshot(`
      <div>
        <p>
          Example post content with an 
          <a
            data-link-type="internal"
          >
            internal link to another post
          </a>
          .
        </p>
      </div>
    `);
  });

  test('convert internal link with customised config', async () => {
    const config: SlateToReactConfig = {
      ...payloadSlateToReactConfig,
      elementTransforms: {
        ...payloadSlateToReactConfig.elementTransforms,
        link: ({ node, children = [] }) => {
          const attrs: any = {};
          if (node.linkType) {
            attrs['data-link-type'] = node.linkType;
          }
          if (node.newTab) {
            attrs.target = '_blank';
          }
          const doc = node.doc?.value;
          if (isPost(doc) && node.linkType === 'internal') {
            attrs.href = `https://example.com/${doc.id}`;
          }
          return (
            <a href={node.url} {...attrs}>
              {children}
            </a>
          );
        },
      },
    };

    const tree = render(<SlateToReact node={fixture} config={config} />);
    expect(tree.container).toMatchInlineSnapshot(`
      <div>
        <p>
          Example post content with an 
          <a
            data-link-type="internal"
            href="https://example.com/65cd31a44e1969ec392ec2d9"
          >
            internal link to another post
          </a>
          .
        </p>
      </div>
    `);
  });
});
