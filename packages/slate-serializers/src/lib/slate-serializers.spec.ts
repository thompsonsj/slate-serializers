import {
  htmlToSlate,
  slateToDom,
  slateToHtml,
  payloadSlateToDomConfig,
  payloadHtmlToSlateConfig,
  slateDemoHtmlToSlateConfig,
  slateDemoSlateToDomConfig,
} from '../.';

/**
 * Simple tests for re-exported libraries
 */
describe('Functional re-exported libraries', () => {
  describe('Default config', () => {
    const html = `<h1>Heading 1</h1>`;
    const slate = [
      {
        children: [
          {
            text: 'Heading 1',
          },
        ],
        type: 'h1',
      },
    ];

    it('htmlToSlate', () => {
      expect(slateToHtml(slate)).toMatchInlineSnapshot(`"<h1>Heading 1</h1>"`);
    });

    it('slateToHtml', () => {
      expect(slateToDom(slate)).toMatchInlineSnapshot(`
        [
          <h1>
            Document {
              "children": [
                Heading 1,
              ],
              "endIndex": null,
              "next": null,
              "parent": null,
              "prev": null,
              "startIndex": null,
              "type": "root",
            }
          </h1>,
        ]
      `);
    });

    it('slateToHtml', () => {
      expect(htmlToSlate(html)).toMatchInlineSnapshot(`
        [
          {
            "children": [
              {
                "text": "Heading 1",
              },
            ],
            "type": "h1",
          },
        ]
      `);
    });
  });

  describe('Payload CMS config', () => {
    const html = `<h1>Heading 1</h1>`;
    const slate = [
      {
        children: [
          {
            text: 'Heading 1',
          },
        ],
        type: 'h1',
      },
    ];

    it('htmlToSlate', () => {
      expect(slateToHtml(slate, payloadSlateToDomConfig)).toMatchInlineSnapshot(
        `"<h1>Heading 1</h1>"`
      );
    });

    it('slateToHtml', () => {
      expect(slateToDom(slate, payloadSlateToDomConfig)).toMatchInlineSnapshot(`
        [
          <h1>
            Document {
              "children": [
                Heading 1,
              ],
              "endIndex": null,
              "next": null,
              "parent": null,
              "prev": null,
              "startIndex": null,
              "type": "root",
            }
          </h1>,
        ]
      `);
    });

    it('slateToHtml', () => {
      expect(htmlToSlate(html, payloadHtmlToSlateConfig))
        .toMatchInlineSnapshot(`
        [
          {
            "children": [
              {
                "text": "Heading 1",
              },
            ],
            "type": "h1",
          },
        ]
      `);
    });
  });

  describe('Slate Demo config', () => {
    const html = `<h1>Heading 1</h1>`;
    const slate = [
      {
        children: [
          {
            text: 'Heading 1',
          },
        ],
        type: 'h1',
      },
    ];

    it('htmlToSlate', () => {
      expect(
        slateToHtml(slate, slateDemoSlateToDomConfig)
      ).toMatchInlineSnapshot(`"Heading 1"`);
    });

    it('slateToHtml', () => {
      expect(slateToDom(slate, slateDemoSlateToDomConfig))
        .toMatchInlineSnapshot(`
        [
          Document {
            "children": [
              Document {
                "children": [
                  Heading 1,
                ],
                "endIndex": null,
                "next": null,
                "parent": null,
                "prev": null,
                "startIndex": null,
                "type": "root",
              },
            ],
            "endIndex": null,
            "next": null,
            "parent": null,
            "prev": null,
            "startIndex": null,
            "type": "root",
          },
        ]
      `);
    });

    it('slateToHtml', () => {
      expect(htmlToSlate(html, slateDemoHtmlToSlateConfig))
        .toMatchInlineSnapshot(`
        [
          {
            "children": [
              {
                "text": "Heading 1",
              },
            ],
            "type": "heading-one",
          },
        ]
      `);
    });
  });
});
