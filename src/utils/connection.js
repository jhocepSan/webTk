import {createPool} from 'mysql2/promise';
import {configuraciones} from '../config/config.js';

var pool =null;
if (pool==null){
    pool=new createPool(configuraciones.CONFIGDBLOCAL);
}
export {pool};
