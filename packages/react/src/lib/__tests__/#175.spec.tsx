import renderer from 'react-test-renderer';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  SlateToReact,
  payloadSlateToReactConfig,
  SlateToReactConfig,
} from '@slate-serializers/react';

import { comprehensiveExampleSlate } from './fixtures/payload/comprehensive';

describe('Issue 175', () => {
  test('convert fixture with default config', async () => {
    const tree = renderer
      .create(<SlateToReact node={comprehensiveExampleSlate} />)
      .toJSON();
    expect(tree).toMatchInlineSnapshot(`
      [
        <h1>
          Heading 1: Payload CMS Slate Example Content
        </h1>,
        <h2>
          Heading 2: Text formatting
        </h2>,
        "Some ",
        <strong>
          bold text
        </strong>,
        " in a sentence.",
        <u>
          Underlined text
        </u>,
        " and ",
        <i>
          italic text
        </i>,
        ".",
        <h3>
          Heading 3: Formatting combinations
        </h3>,
        "Combine ",
        <strong>
          all three
        </strong>,
        " of the aforementioned tags. Throw a ",
        <s>
          strikethrough
        </s>,
        " in there too.",
        <h4>
          Heading 4: Code
        </h4>,
        <pre>
          2 &gt; 1 but is &lt; 3 &amp; it can break HTML
        </pre>,
        <h5>
          Heading 5: Text indent
        </h5>,
        "Indented text.",
        "Indented text in indented text.",
        <h6>
          Heading 6: More combinations
        </h6>,
        <strong />,
        <a
          href="https://github.com/thompsonsj"
        >
          <strong>
            A link in bold
          </strong>
        </a>,
        ". ",
        <a
          href="https://github.com/thompsonsj"
          target="_blank"
        >
          A link with a new tab
        </a>,
        ".",
        <h2>
          Lists
        </h2>,
        <ul>
          <li>
            Unordered List Item 1
          </li>
          <li>
            Unordered List Item 2
          </li>
        </ul>,
        <ol>
          <li>
            Ordered list item 1
          </li>
          <li>
            Ordered list item 2
          </li>
          <li>
            Ordered list item 3
          </li>
        </ol>,
      ]
    `);
  });

  it('convert fixture with Payload config with customisations based on #175', () => {
    const config: SlateToReactConfig = {
      react: {
        ...payloadSlateToReactConfig.react,
        elementTransforms: {
          ...payloadSlateToReactConfig.react.elementTransforms,
          upload: ({ node, attribs, children }) => {
            if (node.value?.mimeType && node.value?.url) {
              if (node.value?.mimeType.match(/^image/)) {
                return (
                  <img
                    src={node.value.url}
                    alt={node.value.alt || node.value.filename}
                    className={'w-full border-2'}
                  />
                );
              }
            }
            return;
          },
        },
      },
      dom: {
        ...payloadSlateToReactConfig.dom,
        defaultTag: 'p',
        markMap: {
          ...payloadSlateToReactConfig.dom.markMap,
          strikethrough: ['s'],
          bold: ['strong'],
          underline: ['u'],
          italic: ['i'],
          code: ['code'],
        },
        alwaysEncodeBreakingEntities: false,
      },
    };

    const tree = renderer
      .create(<SlateToReact node={comprehensiveExampleSlate} config={config} />)
      .toJSON();
    expect(tree).toMatchInlineSnapshot(`
      [
        <h1>
          Heading 1: Payload CMS Slate Example Content
        </h1>,
        <h2>
          Heading 2: Text formatting
        </h2>,
        <p>
          Some 
          <strong>
            bold text
          </strong>
           in a sentence.
        </p>,
        <p>
          <u>
            Underlined text
          </u>
           and 
          <i>
            italic text
          </i>
          .
        </p>,
        <h3>
          Heading 3: Formatting combinations
        </h3>,
        <p>
          Combine 
          <strong>
            all three
          </strong>
           of the aforementioned tags. Throw a 
          <s>
            strikethrough
          </s>
           in there too.
        </p>,
        <h4>
          Heading 4: Code
        </h4>,
        <p>
          <code>
            2 &gt; 1 but is &lt; 3 & it can break HTML
          </code>
        </p>,
        <h5>
          Heading 5: Text indent
        </h5>,
        <p>
          Indented text.
        </p>,
        <p>
          Indented text in indented text.
        </p>,
        <h6>
          Heading 6: More combinations
        </h6>,
        <p>
          <strong />
          <a
            data-link-type="custom"
            href="https://github.com/thompsonsj"
          >
            <strong>
              A link in bold
            </strong>
          </a>
          . 
          <a
            data-link-type="custom"
            href="https://github.com/thompsonsj"
            target="_blank"
          >
            A link with a new tab
          </a>
          .
        </p>,
        <h2>
          Lists
        </h2>,
        <ul>
          <li>
            Unordered List Item 1
          </li>
          <li>
            Unordered List Item 2
          </li>
        </ul>,
        <ol>
          <li>
            Ordered list item 1
          </li>
          <li>
            Ordered list item 2
          </li>
          <li>
            Ordered list item 3
          </li>
        </ol>,
        <img
          alt="31.png"
          className="w-full border-2"
          src="/images/31.png"
        />,
      ]
    `);
  });
});
