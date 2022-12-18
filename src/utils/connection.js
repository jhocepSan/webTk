import {createPool} from 'mysql2/promise';
import {configuraciones} from '../config/config.js';

export const pool=createPool(configuraciones.CONFIGDBLOCAL);
