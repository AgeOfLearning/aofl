export default `
:host {
  display: flex;
}

label {
  display: block;
  margin: 0 0 1rem 0;
}

.error {
  color: #e0520b;
  font-weight: 700;
}

.green {
  color: lightgreen;
  font-weight: 700;
}

form: {
  width: 50%;
  box-sizing: border-box;
}

input,
button,
select {
  font-size: 1.25em;
  padding: .5em;
  margin: 0 0 1em 0;
  width: 100%;
  box-sizing: border-box;
}

select {
  border: 1px solid #ccc;
  box-shadow: none;
}

input[type=submit] {
  border: 1px solid gold;
  background: gold;
}

select:focus {
  outline: none;
}

[disabled] {
  opacity: .35;
}
`;
