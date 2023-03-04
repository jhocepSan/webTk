import express from 'express';
import morgan from 'morgan'
import cors from 'cors'
import loginRoutes from '../routes/login.routes.js'
import clubRoutes from '../routes/club.routes.js'
import confRoutes from '../routes/configuraciones.routes.js'
import userRoutes from '../routes/user.routes.js'
import competidorRoutes from '../routes/competidor.routes.js'
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'
import {PORT}from '../config/configDeploy.js'
const app =express();
const __dirname = dirname(fileURLToPath(import.meta.url))
//Settings
app.set('port',PORT);
//Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
console.log(__dirname)
//file static
app.use(express.static(join(__dirname,"../app/tk-web/build/")))
//Routes
app.use('/login',loginRoutes);
app.use('/club',clubRoutes);
app.use('/config',confRoutes);
app.use('/usuario',userRoutes);
app.use('/competidor',competidorRoutes);

app.get("*", (req, res) => {
    res.sendFile(
      dirname(join(__dirname,"../app/tk-web/build/index.html"))
    );
  });

export default app;
