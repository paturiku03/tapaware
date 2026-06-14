const db = require('../models/db');
const auditLog = require('../utils/auditLogger');

exports.getAllHouseholds = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM households ORDER BY created_at ASC'
        );
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

};

exports.addHousehold = async (req, res) => {

    const { household_number, purok, owner_name, address } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO households(household_number,purok,owner_name,address) VALUES (?,?,?,?)',
            [household_number, purok, owner_name, address]
        );
        await auditLog({
            user_id: req.user ? req.user.id : null,
            user_name: req.user ? req.user.name : 'Unknown',
            user_role: req.user ? req.user.role : 'staff',
            action: 'ADD_HOUSEHOLD',
            table_affected: 'households',
            record_id: result.insertId,
            details: `Added household: ${household_number} - ${owner_name}, purok: ${purok}`,
            ip_address: req.ip
        });
        res.status(201).json({ message: 'household added successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
};