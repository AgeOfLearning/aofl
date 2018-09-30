# @aofl/uuid-service

An ultra-light (192b gzip) uuid like random value generator.

> Note: this service does not generate actual uuids and does not guarantee uniqueness. Do not use it to enforce data integrity

## Exmaples
* https://stackblitz.com/edit/1-0-0-uuid?embed=1

## Installation
```bash
npm i -S uuid
```

## Usage

```javascript
import {uuid} from '@aofl/uuid-service';

uuid(); // 'c50afaae-5a30-4d39-8af4-105b05983052'
```
