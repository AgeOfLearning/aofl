(context, html) => html`
<p>Basic example</p>
<aofl-picture>
  <aofl-source media="(max-width: 320px)" srcset="https://via.placeholder.com/300x150" width="300" height="150"></aofl-source>
  <aofl-source media="(max-width: 500px)" srcset="https://via.placeholder.com/500x250" width="500" height="250"></aofl-source>
  <aofl-source media="(max-width: 700px)" srcset="https://via.placeholder.com/700x350" width="700" height="350"></aofl-source>
  <aofl-img src="https://via.placeholder.com/1000x500" width="1000" height="500"></aofl-img>
</aofl-picture>


<p>Sources Disabled</p>
<aofl-picture disable-sources>
  <aofl-source media="(max-width: 320px)" srcset="https://via.placeholder.com/300x150" width="300" height="150"></aofl-source>
  <aofl-source media="(max-width: 500px)" srcset="https://via.placeholder.com/500x250" width="500" height="250"></aofl-source>
  <aofl-source media="(max-width: 700px)" srcset="https://via.placeholder.com/700x350" width="700" height="350"></aofl-source>
  <aofl-img src="https://via.placeholder.com/1000x500" width="1000" height="500"></aofl-img>
</aofl-picture>
`;
