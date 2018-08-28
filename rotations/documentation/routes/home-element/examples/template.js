(context, html) => html`
  <h4>Original Routes config:</h4>
<pre>
{
  'routes': [
    {
      'resolve': () => import('./routes/home/index.js'),
      'rotation': 'routes',
      'path': '/',
      'dynamic': false,
      'title': 'AofL::Home::CN'
    }
  ],
  'routes-b': [
    {
      'resolve': () => import('./routes-b/routes-b-home/index.js'),
      'rotation': 'routes-b',
      'path': '/',
      'dynamic': false,
      'title': 'AofL::Home:IOS',
      'locale': ''
    }
  ]
};
</pre>
  <h4>Routes config produced by Rotations class</h4>
<pre>${JSON.stringify(context.routes)}</pre>
`;
