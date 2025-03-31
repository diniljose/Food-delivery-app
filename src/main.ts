import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { globalSetupValidations, setUpCookies, setupCors, setupHelmets } from './resources/secuirities';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';



async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 20971520,
    }),
  );

  // app.useWebSocketAdapter(new IoAdapter(app));

  app.useWebSocketAdapter(new IoAdapter(app));

  app.register(fastifyStatic, {
    root: join(__dirname, '..', 'public'),
    // prefix: '/uploads/',
    // cacheControl: true,  // Enable caching
    // maxAge: '1d',       // Cache files for 1 day
  });

  //await trackSecurity(app); //very trackcode in middleware
  await globalSetupValidations(app);
  //await setupSwagger(app);
  await setUpCookies(app);
  try {
    // await Promise.all([setupCors(app), setupHelmets(app)]);
    await app.listen(3000, '0.0.0.0');
  } catch (error) {
    console.error('Error during bootstrap:', error);
  }
}

bootstrap();
