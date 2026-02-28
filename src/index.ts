import { SmartCoercionPlugin } from '@orpc/json-schema';
import { OpenAPIGenerator } from '@orpc/openapi';
import { OpenAPIHandler } from '@orpc/openapi/node'; // or '@orpc/server/node'
import { onError } from '@orpc/server';
import { CORSPlugin } from '@orpc/server/plugins';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { apiReference } from "@scalar/express-api-reference";
import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import { serve } from 'inngest/express';
import { functions, inngest } from './inngest';
import { auth } from './lib/auth';
import { router } from './routes';

const app = express()
app.use(cors())

const schemaConverters = [new ZodToJsonSchemaConverter()];

const handler = new OpenAPIHandler(router, {
  plugins: [
    new CORSPlugin(),
    new SmartCoercionPlugin({schemaConverters}),
  ],
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
})

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(express.json());

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/api/reference", apiReference({
    sources: [
      {
        title: "XZ API",
        url: `/api/openapi.json`,
        default: true,
      },
      {
        title: "Auth",
        url: `/api/auth/open-api/generate-schema`,
      },
    ],
    theme: "solarized",
    pageTitle: "Xz Api Reference",
    defaultHttpClient: {
      clientKey: "fetch",
      targetKey: "node",
    },
  })
);

const generator = new OpenAPIGenerator({
  schemaConverters
});

app.get("/api/openapi.json", async (_req, res) => {
  const docs = await generator.generate(router, {
    info: {
      title: "Xz Algorithms",
      version: "1.0.0",
    },
    servers: [{ url: "/api"}]
  });
  return res.json(docs);
})

app.get("/api/invoke", async (_req, res, next) => {
  await inngest.send({
    name: "test/hello.world",
    data: {
      email: "testUser@example.com",
    },
  }).catch(err => next(err));
  return res.json({ ok: true });
})

app.use('/api{/*path}', async (req: Request, res: Response, next: NextFunction) => {
  const { matched } = await handler.handle(req, res, {
    prefix: '/api',
    context: {
      headers: req.headers,
    },
  })

  if (matched) {
    return
  }

  next()
})

app.listen(3000, () => console.log('Server listening on port 3000'))
