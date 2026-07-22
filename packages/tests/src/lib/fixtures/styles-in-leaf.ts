interface Ifixture {
  name: string
  html: string
  slate: object[]
}

export const fixtures: Ifixture[] = [
  {
    name: 'p tag element transform',
    html: '<p><span style="background-color:#38761D;"><span style="color:#FE9900;"><span style="font-family:arial narrow;"><span style="font-size:20px;"><strong><u><i>some title!</i></u></strong></span></span></span></span></p>',
    slate: [
      {
        type: 'p',
        children: [
          {
            backgroundColor: '#38761D',
            color: '#FE9900',
            fontFamily: "arial narrow",
            fontSize: "20px",
            text: "some title!",
            bold: true,
            italic: true,
            underline: true,
          },
        ]
      }
    ]
  },
  {
    name: '#180 leaf color only',
    html: '<p><span style="color:#f00;">Painted</span></p>',
    slate: [
      {
        type: 'p',
        children: [
          {
            color: '#f00',
            text: 'Painted',
          },
        ],
      },
    ],
  },
  {
    name: '#180 leaf color with bold',
    html: '<p><span style="color:red;"><strong>Bold red</strong></span></p>',
    slate: [
      {
        type: 'p',
        children: [
          {
            color: 'red',
            bold: true,
            text: 'Bold red',
          },
        ],
      },
    ],
  },
  {
    name: '#180 leaf color with code',
    html: '<p><span style="color:green;"><pre><code>&lt;code&gt;</code></pre></span></p>',
    slate: [
      {
        type: 'p',
        children: [
          {
            color: 'green',
            code: true,
            text: '<code>',
          },
        ],
      },
    ],
  },
]
