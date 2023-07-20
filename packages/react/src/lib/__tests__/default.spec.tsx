import renderer from 'react-test-renderer';
import { SlateToReact } from './../serializers';
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

    const tree = renderer.create(<SlateToReact node={slate} />).toJSON();
    expect(tree).toMatchInlineSnapshot(`
      <p>
        Paragraph
      </p>
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
    const tree = renderer.create(<SlateToReact node={slate} />).toJSON();
    expect(tree).toMatchInlineSnapshot(`
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
      dom: {
        ...defaultReactConfig.dom,
        defaultTag: 'p',
      },
    };

    const tree = renderer
      .create(<SlateToReact node={slate} config={config} />)
      .toJSON();
    expect(tree).toMatchInlineSnapshot(`
      <p>
        Paragraph
      </p>
    `);
  });
});
