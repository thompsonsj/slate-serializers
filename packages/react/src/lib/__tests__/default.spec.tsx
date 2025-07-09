import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SlateToReact } from '@slate-serializers/react';
import { config as defaultReactConfig } from './../config/default';

describe('React conversion', () => {
  test('convert domhandler element to React element', async () => {
    const slate = [
      {
        children: [
          {
            text: 'Paragraph',
          },
        ],
        type: 'p',
      },
    ];

    const tree = render(<SlateToReact node={slate} />);
    expect(tree.container).toMatchInlineSnapshot(`
      <div>
        <p>
          Paragraph
        </p>
      </div>
    `);
  });

  it('can handle inline code tags', () => {
    const slate = [
      {
        type: 'p',
        children: [
          {
            text: 'This is editable ',
          },
          {
            text: 'rich',
            bold: true,
          },
          {
            text: ' text, ',
          },
          {
            text: 'much',
            italic: true,
          },
          {
            text: ' better than a ',
          },
          {
            text: '<textarea>',
            code: true,
          },
          {
            text: '!',
          },
        ],
      },
    ];
    const tree = render(<SlateToReact node={slate} />);
    expect(tree.container).toMatchInlineSnapshot(`
      <div>
        <p>
          This is editable 
          <strong>
            rich
          </strong>
           text, 
          <i>
            much
          </i>
           better than a 
          <pre>
            &lt;textarea&gt;
          </pre>
          !
        </p>
      </div>
    `);
  });

  test('render Slate node as p tag if defaultTag is set', async () => {
    const slate = [
      {
        children: [
          {
            text: 'Paragraph',
          },
        ],
      },
    ];

    const config = {
      ...defaultReactConfig,
      defaultTag: 'p',
    };

    const tree = render(<SlateToReact node={slate} config={config} />);
    expect(tree.container).toMatchInlineSnapshot(`
      <div>
        <p>
          Paragraph
        </p>
      </div>
    `);
  });
});
