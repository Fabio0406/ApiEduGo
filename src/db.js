import pkg from 'pg'

export const consul = new pkg.Pool({
    host: process.env.DB_HOST ||'containers-us-west-132.railway.app',
    user: process.env.DB_USER ||'postgres',
    password: process.env.DB_PASSWORD ||'4OXVGhIItH0keM1vxUhy',
    database: process.env.DB_DATABASE ||'railway',
    port: process.env.DB_PORT||'7453'
})