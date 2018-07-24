# @rxdi/starter-server-side
## Starter project Server Side based on @rxdi/core
## Powerful Dependency Injection inside Browser and Node using Typescript and RXJS 6
***
> The idea behind [@rxdi](https://github.com/rxdi) is to create independent, dependency injection that can be used everywhere.
> First steps where with platform called [@gapi](https://github.com/Stradivario/gapi) you can check repository [@gapi/core](https://github.com/Stradivario/gapi-core).
> Then because of the needs of the platform i decided to develop this Reactive Dependency Injection container helping me build progressive applications.
> Hope you like my journey!
> Any help and suggestions are appreciated!
Main repository [@rxdi/core](https://github.com/rxdi/core) 
***
### Installation and basic examples:

##### To start developing, run:

```bash
git clone https://github.com/rxdi/starter-server-side
```

Start App Development
```bash
npm run start
```

Build app for production

```bash
npm run build
```

(Optional)

Production build with [Parcel](https://parceljs.org/getting_started.html)
Production build is added inside @gapi/cli but if you want you can use parcel-bundler globally to build and start your application as follow:

Install Parcel:
```bash
npm install -g parcel-bundler
```

Build single bundle from first bootstrapped file in this case `main.ts`

```bash
parcel build src/main.ts --target node
```

This command will generate single file from this application inside `dist/main.js` with mappings `dist/main.map`

Starting bundled application
```bash
node ./dist/main.js
```

Important!

This will not bundle your node modules only rxdi application.

## Simplest app

main.ts
```typescript
import { Bootstrap } from '@rxdi/core';
import { AppModule } from './app/app.module';

Bootstrap(AppModule, {
    init: true,
    logger: {
        logging: true,
        date: true,
        hashes: true,
        exitHandler: true,
        fileService: true
    }
})
.subscribe(
    () => console.log('Started!'),
    (e) => console.error(e)
);
```

app.module.ts
```typescript
import { Module } from "@rxdi/core";
import { UserModule } from './user/user.module';

@Module({
    imports: [UserModule]
})
export class AppModule {}
```



user.module.ts
```typescript


import { Module } from '@rxdi/core';
import { UserService } from './services';
import { Observable } from 'rxjs';

@Module({
    services: [
        UserService,
        {
            provide: 'createUniqueHash',
            useDynamic: {
                fileName: 'createUniqueHash',
                namespace: '@helpers',
                extension: 'js',
                typings: '',
                outputFolder: '/node_modules/',
                link: 'https://ipfs.infura.io/ipfs/QmdQtC3drfQ6M6GFpDdrhYRKoky8BycKzWbTkc4NEzGLug'
            }
        },
        {
            provide: 'testFactoryAsync',
            lazy: true,
            useFactory: async () => {
                return new Promise((resolve) => {
                    setTimeout(() => resolve('dad2a'), 0);
                })
            }
        },
        {
            provide: 'testFactorySync',
            useFactory: () => {
                return 'dada';
            }
        },
        {
            provide: 'testValue2',
            useValue: 'dadada'
        },
        {
            provide: 'testChainableFactoryFunction',
            // lazy: true, if you don't provide lazy parameter your factory will remain Observable so you can chain it inside constructor
            useFactory: () => new Observable(o => o.next(15))
        },
    ]
})
export class UserModule {}
```

user.service.ts
```typescript

import { Service, OnInit } from "@rxdi/core";
import { Inject } from "@rxdi/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CREATE_UNIQUE_HASH } from "../user.tokens";

@Service()
export class UserService implements OnInit {
    constructor(
        @Inject(CREATE_UNIQUE_HASH) private ipfsDownloadedFactory: { testKey: () => string },
        @Inject('testFactoryAsync') private testFactoryAsync: string,
        @Inject('testChainableFactoryFunction') private chainableFactory: Observable<number>
    ) {}

    OnInit() {
        console.log('UserService', this.ipfsDownloadedFactory.testKey(), this.testFactoryAsync);
        this.chainableFactory
            .pipe(
                map((res) => res)
            )
            .subscribe(value => console.log('Value chaining factory ', value));
    }

}
```

Result
```typescript
1529604446114 Bootstrap -> @Module('AppModule')(adb785e839fa19736cea0920cd39b783): loading...
1529604446116 Bootstrap -> @Module('UserModule')(9ed4f039657f52019d2d9adb0f9df09f): loading...
1529604446118 Bootstrap -> @Module('UserModule')(9ed4f039657f52019d2d9adb0f9df09f): finished!
1529604446118 Bootstrap -> @Module('AppModule')(adb785e839fa19736cea0920cd39b783): finished!
1529604446119 Bootstrap -> @Service('createUniqueHash'): loading...
1529604446121 Bootstrap -> @Service('createUniqueHash'): will be downloaded inside ./node_modules/@helpers/createUniqueHash.js folder and loaded from there
1529604446121 Bootstrap -> @Service('createUniqueHash'): https://ipfs.infura.io/ipfs/QmdQtC3drfQ6M6GFpDdrhYRKoky8BycKzWbTkc4NEzGLug downloading...
1529604446137 Bootstrap -> @Service('testFactoryAsync'): loading...
1529604446146 Bootstrap -> @Service('testFactoryAsync'): loading finished! 21:07:26
1529604446795 Done!
1529604446797 Bootstrap: @Service('createUniqueHash.js'): Saved inside /home/rampage/Desktop/concept-starter/node_modules/@helpers
1529604446808 Bootstrap -> @Service('createUniqueHash'): loading finished! 21:07:26
1529604446810 Done!
1529604446811 Bootstrap: @Service('createUniqueHash.js'): Saved inside /home/rampage/Desktop/concept-starter/node_modules/@helpers
1529604446812 Bootstrap -> press start!
1529604446813 Start -> @Module('UserModule')(9ed4f039657f52019d2d9adb0f9df09f): @Service('UserService')(ea785b316b77dbfe5cb361a7cdcbcb31) initialized!
UserService TestKey dad2a
Value chaining factory  15
1529604446813 Start -> @Module('UserModule')(9ed4f039657f52019d2d9adb0f9df09f): loaded!
1529604446813 Start -> @Module('AppModule')(adb785e839fa19736cea0920cd39b783): loaded!
Started!
AppStopped
```
