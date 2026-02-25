const mysql = require('mysql2/promise');
const config = require('../config');

const pool = mysql.createPool(config.database);

const db = {
    async query(sql, params) {
        const [rows] = await pool.execute(sql, params);
        return rows;
    },
    
    async queryOne(sql, params) {
        const rows = await this.query(sql, params);
        return rows[0] || null;
    },
    
    async insert(table, data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
        const result = await pool.execute(sql, values);
        return result[0];
    },
    
    async update(table, data, where, whereParams = []) {
        const sets = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), ...whereParams];
        const sql = `UPDATE ${table} SET ${sets} WHERE ${where}`;
        const result = await pool.execute(sql, values);
        return result[0];
    },
    
    async delete(table, where, whereParams = []) {
        const sql = `DELETE FROM ${table} WHERE ${where}`;
        const result = await pool.execute(sql, whereParams);
        return result[0];
    },
    
    async transaction(callback) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const result = await callback(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },
    
    pool
};

process.on('SIGINT', async () => {
    await pool.end();
    console.log('MySQL connection pool closed');
});

module.exports = db;
