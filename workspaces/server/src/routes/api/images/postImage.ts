import fs from 'node:fs/promises';
import path from 'node:path';

import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { PostImageRequestBodySchema } from '@wsh-2024/schema/src/api/images/PostImageRequestBody';
import { PostImageResponseSchema } from '@wsh-2024/schema/src/api/images/PostImageResponse';

import { IMAGES_PATH } from '../../../constants/paths';
import { authMiddleware } from '../../../middlewares/authMiddleware';
import { imageRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'post',
  path: '/api/v1/images',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: PostImageRequestBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PostImageResponseSchema,
        },
      },
      description: 'Create image.',
    },
  },
  tags: ['[Admin] Images API'],
});

app.use(route.getRoutingPath(), authMiddleware);
app.openapi(route, async (c) => {
  const formData = c.req.valid('form');

  const result = await imageRepository.create({
    body: {
      alt: formData.alt,
    },
  });

  if (result.isErr()) {
    throw result.error;
  }

  await fs.mkdir(IMAGES_PATH, {
    recursive: true,
  });
  await fs.writeFile(
    path.resolve(IMAGES_PATH, `./${result.value.id}.jpg`),
    Buffer.from(await formData.content.arrayBuffer()),
  );

  return c.json(result.value);
});

export { app as postImageApp };
