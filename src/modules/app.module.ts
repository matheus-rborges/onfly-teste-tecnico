import { Module } from '@nestjs/common';
import * as controllers from '../controllers';
import { Environment } from '../providers';
import * as repositories from '../providers/repositories';
import * as services from '../providers/services';

Environment.initialize();

@Module({
    imports: [],
    controllers: Object.values(controllers),
    providers: [...Object.values(services), ...Object.values(repositories)],
})
export class AppModule {}
