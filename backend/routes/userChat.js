const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // Tu conexión a Postgres

// Guardar un mensaje nuevo en la DB
router.post('/enviar', async (req, res) => {
    const { emisor_id, receptor_id, contenido } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO mensajes (emisor_id, receptor_id, contenido) VALUES ($1, $2, $3) RETURNING *',
            [emisor_id, receptor_id, contenido]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener historial entre dos usuarios
router.get('/historial/:user1/:user2', async (req, res) => {
    try {
        const { user1, user2 } = req.params;
        const result = await pool.query(
            `SELECT * FROM mensajes 
             WHERE (emisor_id = $1 AND receptor_id = $2) 
             OR (emisor_id = $2 AND receptor_id = $1) 
             ORDER BY fecha ASC`,
            [user1, user2]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;