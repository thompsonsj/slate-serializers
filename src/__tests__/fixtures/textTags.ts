interface Ifixture {
  name: string
  html: string
  slate: object[]
}

export const fixtures: Ifixture[] = [
  {
    name: "strong",
    html: "<strong>Bold</strong>",
    slate: [
      {
        children: [
          {
            bold: true,
            text: "Bold"
          }
        ],
      },
    ],
  },
  {
    name: "strong in paragraph",
    html: "<p><strong>Bold</strong></p>",
    slate: [
      {
        children: [
          {
            bold: true,
            text: "Bold"
          },
        ],
        type: 'p',
      },
    ],
  },
  {
    name: "strong mid-sentence",
    html: "Some <strong>bold text</strong> in a sentence.",
    /*
    Expected but not received:
    {
        "text": "Some "
    },
    {
        "text": "bold text",
        "bold": true
    },
    {
        "text": " in a sentence."
    }
    */
    slate: [
      {
        "children": [
          {
            "text": "Some ",
          },
        ],
      },
      {
        "children": [
          {
            "bold": true,
            "text": "bold text",
          },
        ],
      },
      {
        "children": [
          {
            "text": " in a sentence.",
          },
        ],
      }
    ]
  },
  {
    name: "pre",
    html: "<pre><code>Pre</code></pre>",
    slate: [
      {
        children: [
          {
            code: true,
            text: "Pre",
          },
        ],
      },
    ],
  },
]
