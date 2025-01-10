import { NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyHelmet from '@fastify/helmet';
import { fastifyCors } from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as fastifyXmlBodyparser from 'fastify-xml-body-parser';
import fastifyMultipart from '@fastify/multipart';

const whitelist = new Set([
  'http://localhost:4200',
  'https://localhost:4200',
]);
const allowedHeaders = [
  'Access-Control-Allow-Origin',
  'Origin',
  'X-Requested-With',
  'Accept',
  'Content-Type',
];
export async function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Kuwait evisa')
    .setDescription('Kuwait evisa Documentation')
    .setVersion(`v1`)
    .build();
  SwaggerModule.setup(`api`, app, SwaggerModule.createDocument(app, options));
}

export async function setupCors(app: NestFastifyApplication) {
  await app.register(fastifyCors, {
    origin: (origin, callback) => {
      if (origin === undefined || whitelist.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    allowedHeaders: allowedHeaders,
    methods: ['GET', 'PATCH', 'POST', 'DELETE'],
    exposedHeaders: 'cookies',
    credentials: true,
  });
}

// export async function setupHelmets(app: NestFastifyApplication) {
//   await app.register(fastifyHelmet, {
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: [`'self'`, 'unpkg.com'],
//         frameAncestors: ["'self'"],
//         styleSrc: [
//           `'self'`,
//           `'unsafe-inline'`,
//           'cdn.jsdelivr.net',
//           'fonts.googleapis.com',
//           'unpkg.com',
//         ],
//         fontSrc: [`'self'`, 'fonts.gstatic.com', 'data:'],
//         imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
//         scriptSrc: [
//           `'self'`,
//           `https: 'unsafe-inline'`,
//           `cdn.jsdelivr.net`,
//           `'unsafe-eval'`,
//         ],
//       },
//     },
//     xXssProtection: true,
//     xPoweredBy: false,
//     crossOriginEmbedderPolicy: true,
//     crossOriginOpenerPolicy: true,
//   });
//}

export async function setupHelmets(app: NestFastifyApplication) {
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        frameAncestors: ["'self'", 'http://localhost:4200'],
        scriptSrc: [
          `'self'`,
          `https: 'unsafe-inline'`,
          `http: 'unsafe-inline'`,
          `cdn.jsdelivr.net`,
          `'unsafe-eval'`,
        ],
        frameSrc: [
          "'self'", // Allow content from the same origin
          // 'https://test-nbkpayment.mtf.gateway.mastercard.com', // Allow embedding from the external domain
        ],
      },
    },
  });
}

export async function setUpCookies(app: NestFastifyApplication) {
  await app.register(fastifyCookie, {
    secret: process.env.Access_token_secret,
    parseOptions: {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24,
      // sameSite: 'none',
      sameSite: 'strict',
    },
  });
}

export async function globalSetupValidations(app: NestFastifyApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.register(fastifyXmlBodyparser);
  app.register(fastifyMultipart, {
    addToBody: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // Set max file size to 10 MB
      files: 10, // Allow up to 10 files
    },
  });
  //app.useGlobalInterceptors(new CustomErrorHandler());
}

export async function trackSecurity(app: NestFastifyApplication) {
  const fastifyInstance = app.getHttpAdapter().getInstance();
  fastifyInstance.addHook('onSend', (request, reply, payload, next) => {
    console.log('request header = ', request.headers);
    console.log('payload = ', payload);
    console.log('responce headers = ', reply.getHeaders()); // Log headers
    next();
  });
}
