import { pool } from "../db.js";

export const getClinica = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM usuario');
    res.json(rows);
}

// Este tipo de código se usa comúnmente en APIs RESTful para interactuar
// y enviar datos a los usuarios a través de una aplicación web

// export const getClinicas = async (req, res) => {
//     const { id } = req.params;
//     const [rows] = await pool.query('SELECT * FROM producto WHERE id = ?', [id]);
//     res.json(rows[0]);
// }