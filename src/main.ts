import { Bootstrap } from '@rxdi/core';
import { AppModule } from './app/app.module';

Bootstrap(AppModule, {
    init: true,
    experimental: {
        crypto: {
            algorithm: 'aes256',
            cyperIv: 'Jkyt1H3FA8JK9L3A',
            cyperKey: '8zTVzr3p53VC12jHV54rIYu2545x47lY'
        }
    },
    logger: {
        logging: true,
        date: true,
        exitHandler: true,
        fileService: true,
        hashes: true
    }
})
.subscribe(
    () => console.log('Started!'),
    (e) => console.error(e)
);