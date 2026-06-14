const db = require('../models/db');

const auditLog = async ({ user_id, user_name, user_role, action, table_affected, record_id, details, ip_address }) => {
    try {
        await db.query(
            `insert into audit_trail(user_id,user_name,user_role,action,table_affected,record_id,details,ip_address) 
            values(?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id || null,
                user_name || 'Unknown',
                user_role || 'Resident',
                action,
                table_affected,
                record_id || null,
                details || null,
                ip_address || null
            ]
        );

    }
    catch (error) {
        console.log('Error logging audit trail:', error.message);
    }
};

module.exports = auditLog;