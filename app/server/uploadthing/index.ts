import { admin } from '@/app/middleware/admin';
import { DeleteFileSchema } from './dto';
import { deleteFile } from './dal';
import { standardSecurityMiddleware } from '@/app/middleware/arcjet/standard';
import { writeSecurityMiddleware } from '@/app/middleware/arcjet/write';

export const deleteFiles = admin
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .input(DeleteFileSchema)
  .handler(async ({ input }) => {
    await deleteFile(input.key);
    return { success: true };
  });
