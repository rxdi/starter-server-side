import { Module } from "@rxdi/core";
import { UserModule } from './user/user.module';
import { CoreModule } from './core/core.module';

@Module({
    imports: [
        CoreModule,
        UserModule
    ]
})
export class AppModule {}