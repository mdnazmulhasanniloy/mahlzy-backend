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
import fs from 'fs/promises';
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
const storage = memoryStorage();
const upload = multer({ storage });
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

app.get('/json', async (req: Request, res: Response) => {
  const response: any = await fetch(
    'https://geospatial.alberta.ca/titan/rest/services/boundary/fish_and_wildlife_administrative_area_10tm_nad83_aep_v2/MapServer/31/query?where=1%3D1&text=&objectIds=&time=&timeRelation=esriTimeRelationOverlaps&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=WMUNIT_CODE&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&sqlFormat=none&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson',
  );

  const data = await response.json();
  await fs.writeFile(
    'wildlife_data.json',
    JSON.stringify(data, null, 2),
    'utf-8',
  );
});
// application routes
app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.send('server is running');
});
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
