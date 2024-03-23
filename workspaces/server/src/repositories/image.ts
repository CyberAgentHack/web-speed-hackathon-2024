import { HTTPException } from 'hono/http-exception';
import { err, ok, type Result } from 'neverthrow';

import type { PostImageRequestBody } from '@wsh-2024/schema/src/api/images/PostImageRequestBody';
import type { PostImageResponse } from '@wsh-2024/schema/src/api/images/PostImageResponse';
import { image } from '@wsh-2024/schema/src/models';

import { getDatabase } from '../database/drizzle';

type ImageRepositoryInterface = {
  create(options: { body: Omit<PostImageRequestBody, 'content'> }): Promise<Result<PostImageResponse, HTTPException>>;
};

class ImageRepository implements ImageRepositoryInterface {
  async create(options: {
    body: Omit<PostImageRequestBody, 'content'>;
  }): Promise<Result<PostImageResponse, HTTPException>> {
    try {
      const result = await getDatabase()
        .insert(image)
        .values(options.body)
        .returning({
          alt: image.alt,
          id: image.id,
        })
        .execute();

      if (result[0] == null) {
        throw new HTTPException(500, { message: 'Failed to create image.' });
      }
      return ok(result[0]);
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Failed to create image.` }));
    }
  }
}

export const imageRepository = new ImageRepository();
