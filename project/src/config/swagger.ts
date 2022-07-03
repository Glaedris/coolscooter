import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export type SwaggerConfig = {
  uri: string;
};

const startSwagger = (app: INestApplication) => {
  const uri = `${process.env.API_VERSION}/${process.env.API_SWAGGER_PATH}`;

  const config = new DocumentBuilder()
    .setTitle('COOL SCOOTER')
    .addBearerAuth()
    .setDescription('The cool scooter API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(uri, app, document);
};

export { startSwagger };
