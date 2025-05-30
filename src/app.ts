/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/globalErrorhandler';
import notFound from './app/middleware/notfound';
import router from './app/routes';
import multer, { memoryStorage } from 'multer';
import catchAsync from './app/utils/catchAsync';
import { uploadToS3 } from './app/utils/s3';
import sendResponse from './app/utils/sendResponse';
const app: Application = express();
app.use(express.static('public'));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
);

// Remove duplicate static middleware
// app.use(app.static('public'));
const storage = memoryStorage()
const upload = multer({storage})
app.post(
  '/upload',
  upload.single('image'),
  catchAsync(async (req, res, next) => {
    req.body.image = await uploadToS3({
      file: req.file,
      fileName: `images/user/profile/${Math.floor(100000 + Math.random() * 900000)}`,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Image uploaded successfully',
      data: req.body,
    });
  }),
);
// application routes
app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.send('server is running');
});
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
