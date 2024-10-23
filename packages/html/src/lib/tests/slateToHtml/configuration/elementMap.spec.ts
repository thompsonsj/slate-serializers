import { slateToHtml, slateToHtmlConfig } from '@slate-serializers/html'

describe("slateToHtml elementMap", () => {
  it('processes an element map value', () => {
    const html = '<h1>Heading 1</h1>'
    const slate = [
      {
        type: 'heading-one',
        children: [
          {
            text: 'Heading 1',
          },
        ],
      },
    ]
    const config = {
      ...slateToHtmlConfig,
      elementMap: {
        ['heading-one']: 'h1',
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })

  it('processes element map values for a table', () => {
    const html = '<table><thead><tr><th>Heading Column 1</th><th>Heading Column 2</th></tr></thead><tbody><tr><td>Cell Row 1 Column 1</td><td>Cell Row 1 Column 2</td></tr><tbody><tr><td>Cell Row 2 Column 1</td><td>Cell Row 2 Column 2</td></tr></tbody></tbody></table>'
    const slate = [{
      "type": "table",
      "children": [
        {
          "type": "thead",
          "children": [
            {
              "type": "tr",
              "children": [
                {
                  "type": "th",
                  "children": [
                    {
                      "text": "Heading Column 1"
                    }
                  ]
                },
                {
                  "type": "th",
                  "children": [
                    {
                      "text": "Heading Column 2"
                    }
                  ]
                },
              ]
            }
          ]
        },
        {
          "type": "tbody",
          "children": [
            {
              "type": "tr",
              "children": [
                {
                  "type": "td",
                  "children": [
                    {
                      "text": "Cell Row 1 Column 1"
                    }
                  ]
                },
                {
                  "type": "td",
                  "children": [
                    {
                      "text": "Cell Row 1 Column 2"
                    }
                  ]
                },
              ]
            },
            {
              "type": "tbody",
              "children": [
                {
                  "type": "tr",
                  "children": [
                    {
                      "type": "td",
                      "children": [
                        {
                          "text": "Cell Row 2 Column 1"
                        }
                      ]
                    },
                    {
                      "type": "td",
                      "children": [
                        {
                          "text": "Cell Row 2 Column 2"
                        }
                      ]
                    },
                  ]
                },
              ],
            },
          ],
        },
      ],
    }]
    const config = {
      ...slateToHtmlConfig,
      elementMap: {
        ...slateToHtmlConfig.elementMap,
        table: "table",
        tr: "tr",
        td: "td",
        thead: "thead",
        th: "th",
        tbody: "tbody",
      },
    }
    expect(slateToHtml(slate, config)).toEqual(html)
  })
})
