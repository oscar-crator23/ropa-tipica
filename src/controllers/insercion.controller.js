import { pool } from "../db.js";

export const getInsercion = async (req, res) => {
    const {usuario, password} = req.body;
    const query = 'Insert into usuario (usuario, password)  values (?, ?)';
    pool.query(query, [usuario, password]);
};

// Este tipo de código se usa comúnmente en APIs RESTful para interactuar
// y enviar datos a los usuarios a través de una aplicación web

// export const getClinicas = async (req, res) => {
//     const { id } = req.params;
//     const [rows] = await pool.query('SELECT * FROM producto WHERE id = ?', [id]);
//     res.json(rows[0]);
// }