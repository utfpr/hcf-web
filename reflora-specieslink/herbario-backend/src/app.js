import express from 'express';
import cors from 'cors';
import parser from 'body-parser';
import morgan from 'morgan';

import routes from './routes';
import errors from './middlewares/erros-middleware';

import { daemonFazRequisicaoReflora } from './herbarium/reflora/main';
import { daemonSpeciesLink } from './herbarium/specieslink/main';

const app = express();
app.use(cors());
app.use(parser.json());
app.use(morgan('dev'));

app.use('/api', routes);
app.use(errors);

daemonFazRequisicaoReflora();
daemonSpeciesLink();

export default app;
