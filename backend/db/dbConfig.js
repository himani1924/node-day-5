//db connection

import config from '../config/index.js';
import pkg from 'pg'
import util from 'util'; 
const { Pool } = pkg;

const pg_pool =  new Pool({
    user: config.user,
    database: config.database,
    password: config.password,
    dbPort: config.dbPort,
    max: config.max,
    idleTimeoutMillis: config.idleTimeoutMillis,
    connectionTimeoutMillis: config.connectionTimeoutMillis
})

const pool =  {
    query:(sql,args)=>{
        return util.promisify(pg_pool.query).call(pg_pool,sql,args)
    }
}

export default pool;