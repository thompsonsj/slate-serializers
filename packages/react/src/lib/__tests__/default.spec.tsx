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
          <code>
            &lt;textarea&gt;
          </code>
          !
        </p>
      </div>
    `);
  });

  it('renders the code mark as inline code', () => {
    const slate = [
      {
        type: 'p',
        children: [{ text: 'Use ' }, { text: 'npm', code: true }, { text: ' here.' }],
      },
    ]
    const { container } = render(<SlateToReact node={slate} />)
    expect(container.innerHTML).toBe('<p>Use <code>npm</code> here.</p>')
    expect(container.querySelector('pre')).toBeNull()
  })

  it('combines the code mark with other marks', () => {
    const slate = [
      {
        type: 'p',
        children: [{ text: 'Use ' }, { text: 'npm', bold: true, code: true }, { text: ' here.' }],
      },
    ]
    const { container } = render(<SlateToReact node={slate} />)
    expect(container.innerHTML).toBe('<p>Use <strong><code>npm</code></strong> here.</p>')
  })

  it('still wraps a code-block element in pre and code', () => {
    const slate = [
      {
        type: 'code-block',
        children: [{ text: 'const a = 1' }],
      },
    ]
    const config = {
      ...defaultReactConfig,
      elementTransforms: {
        ...defaultReactConfig.elementTransforms,
        'code-block': ({ children }) => (
          <pre>
            <code>{children}</code>
          </pre>
        ),
      },
    }
    const { container } = render(<SlateToReact node={slate} config={config} />)
    expect(container.innerHTML).toBe('<pre><code>const a = 1</code></pre>')
  })

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
