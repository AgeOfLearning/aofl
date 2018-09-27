# @aofl/server-environment

Helps determine dev, stage, prod environments based on hostname.

---
## Installation
```bash
npm i -S @aofl/server-environment
```

---
## Usage
```javascript
import {getServerEnvironment, environmentTypeEnumerate} from '@aofl/server-environment';

const env = getServerEnvironment(/localhost/, /^stage\./);
const debugMode = (env === environmentTypeEnumerate.DEV);

```
---
## Methods

### getServerEnvironment
Takes a devRegex and a stageRegex and tests them against hostname. Returns 'production' if the regexes do not capture any results from hostname.

| Name       | Type   | Description |
|------------|--------|-------------|
| devRegex   | RegExp |             |
| stageRegex | RegEx  |             |

---

## Constants

### environmentTypeEnumerate
| Key   | Value       |
|-------|-------------|
| DEV   | development |
| STAGE | stage       |
| PROD  | production  |
