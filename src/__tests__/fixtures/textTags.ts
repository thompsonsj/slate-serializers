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