import { HttpException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { name, version } from '../package.json';
import {
    VALIDATION_ERROR_MESSAGE,
    VALIDATION_ERROR_STATUS_CODE,
} from './constants';
import { AppModule } from './modules';
import { Environment } from './providers';

const createServer = async () => {
    const app = await NestFactory.create(AppModule);

    const validationOptions = {
        exceptionFactory: (errors) => {
            const message = VALIDATION_ERROR_MESSAGE;
            const statusCode = VALIDATION_ERROR_STATUS_CODE;
            return new HttpException({ message, errors }, statusCode);
        },
        transform: true,
        forbidUnknownValues: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    };

    app.useGlobalPipes(new ValidationPipe(validationOptions));

    const config = new DocumentBuilder()
        .setTitle(name)
        .setVersion(version)
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('doc', app, document);

    await app.listen(8080);
};

(async () => {
    Environment.checkEnvironment();
    await createServer();
})();
