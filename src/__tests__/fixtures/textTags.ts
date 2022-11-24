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
    name: "unarticulated annotation",
    html: "<u>Unarticulated Annotation</u>",
    slate: [
      {
        children: [
          {
            underline: true,
            text: "Unarticulated Annotation"
          }
        ],
      },
    ],
  },
  {
    name: "idiomatic text",
    html: "<i>Idiomatic Text</i>",
    slate: [
      {
        children: [
          {
            italic: true,
            text: "Idiomatic Text"
          }
        ],
      },
    ],
  },
  {
    name: "strikethrough",
    html: "<s>Strikethrough</s>",
    slate: [
      {
        children: [
          {
            strikethrough: true,
            text: "Strikethrough"
          }
        ],
      },
    ],
  },
  {
    name: "strong and idiomatic text",
    html: "<strong><i>Strong and Idiomatic Text</i></strong>",
    slate: [
      {
        children: [
          {
            bold: true,
            italic: true,
            text: "Strong and Idiomatic Text"
          }
        ],
      },
    ],
  },
  {
    name: "strong and unarticulated annotation",
    html: "<strong><u>Strong and Unarticulated Annotation</u></strong>",
    slate: [
      {
        children: [
          {
            bold: true,
            underline: true,
            text: "Strong and Unarticulated Annotation"
          }
        ],
      },
    ],
  },
  /** nesting three text marks doesn't work - italic is not included */
  /*{
    name: "strong, unarticulated annotation and idiomatic text",
    html: "<strong><u><i>Strong, Unarticulated Annotation and Idiomatic Text</i></u></strong>",
    slate: [
      {
        children: [
          {
            bold: true,
            italic: true,
            underline: true,
            text: "Strong, Unarticulated Annotation and Idiomatic Text"
          }
        ],
      },
    ],
  },*/
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
