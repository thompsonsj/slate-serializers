interface Ifixture {
  name: string
  html: string
  slate: object[]
}

export const fixtures: Ifixture[] = [
  {
    name: "blockquote",
    html: "<blockquote>Blockquote</blockquote>",
    slate: [
      {
        children: [
          {
            text: 'Blockquote',
          },
        ],
        type: 'blockquote',
      },
    ]
  },
  {
    name: "headings",
    html: "<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><h4>Heading 4</h4><h5>Heading 5</h5><h6>Heading 6</h6>",
    slate: [
      {
        children: [
          {
            text: 'Heading 1',
          },
        ],
        type: 'h1',
      },
      {
        children: [
          {
            text: 'Heading 2',
          },
        ],
        type: 'h2',
      },
      {
        children: [
          {
            text: 'Heading 3',
          },
        ],
        type: 'h3',
      },
      {
        children: [
          {
            text: 'Heading 4',
          },
        ],
        type: 'h4',
      },
      {
        children: [
          {
            text: 'Heading 5',
          },
        ],
        type: 'h5',
      },
      {
        children: [
          {
            text: 'Heading 6',
          },
        ],
        type: 'h6',
      },
    ]
  },
  {
    name: "paragraph",
    html: "<p>Paragraph 1</p>",
    slate: [
      {
        children: [
          {
            text: 'Paragraph 1',
          },
        ],
        type: 'p',
      },
    ]
  },
  {
    name: "link",
    html: '<a href="https://github.com/thompsonsj/slate-serializers">Slate Serializers | GitHub</a>',
    slate: [
      {
        children: [
          {
            text: 'Slate Serializers | GitHub',
          },
        ],
        newTab: false,
        type: 'link',
        url: 'https://github.com/thompsonsj/slate-serializers',
      },
    ]
  },
  {
    name: "unordered list",
    html: '<ul><li>Item 1</li><li>Item 2</li></ul>',
    slate: [
      {
        children: [
          {
            children: [
              {
                text: 'Item 1',
              },
            ],
            type: 'li',
          },
          {
            children: [
              {
                text: 'Item 2',
              },
            ],
            type: 'li',
          },
        ],
        type: 'ul',
      },
    ]
  },
  {
    name: "nested unordered list",
    html: '<ul><li>Item 1<ul><li>Nested item 1</li><li>Nested item 2</li></ul></li><li>Item 2</li></ul>',
    slate: [
      {
        children: [
          {
            children: [
              {
                text: 'Item 1',
              },
              {
                children: [
                  {
                    children: [
                      {
                        text: 'Nested item 1',
                      },
                    ],
                    type: "li"
                  },
                  {
                    children: [
                      {
                        text: 'Nested item 2',
                      },
                    ],
                    type: "li"
                  }
                ],
                type: 'ul'
              },
            ],
            type: 'li',
          },
          {
            children: [
              {
                text: 'Item 2',
              },
            ],
            type: 'li',
          },
        ],
        type: 'ul',
      },
    ]
  },
  {
    name: "ordered list",
    html: '<ol><li>Item 1</li><li>Item 2</li></ol>',
    slate: [
      {
        children: [
          {
            children: [
              {
                text: 'Item 1',
              },
            ],
            type: 'li',
          },
          {
            children: [
              {
                text: 'Item 2',
              },
            ],
            type: 'li',
          },
        ],
        type: 'ol',
      },
    ]
  },
]