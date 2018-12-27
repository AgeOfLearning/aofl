# IDE Setup

The AofL JS team primarily codes on VS Code. If you would like to include setup for other IDEs send us a pull request.

## VS Code

### Extensions

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)
- [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [Document This](https://marketplace.visualstudio.com/items?itemName=joelday.docthis)
- [.ejs](https://marketplace.visualstudio.com/items?itemName=QassimFarid.ejs-language-support)

### Configuration

```json
// Overwrite settings by placing them into your settings file.
{
  "files.trimTrailingWhitespace": true,

  "editor.tabSize": 2,
  "editor.rulers": [100, 120],
  "editor.wordWrapColumn": 120,
  "editor.wordWrap": "on",
  "editor.wrappingIndent": "indent",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.formatOnSave": false
  },

  "eslint.autoFixOnSave": true,
  "eslint.alwaysShowStatus": true,

  "prettier.disableLanguages": ["javascript"],

  "docthis.inferTypesFromNames": true,
  "docthis.includeMemberOfOnClassMembers": false,
  "docthis.includeMemberOfOnInterfaceMembers": false
}
```
