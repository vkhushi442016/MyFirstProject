// pagination.js
const applyPaginations = (connection) => {
    return (tableName, orderByColumn = "id") => {
        return (req, res, whereClause = "", params = []) => {
            let page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit);
            if (!limit || limit <= 0) limit = 5;
            let offset = (page - 1) * limit;

            // Total count
            const countQuery = `SELECT COUNT(*) as count FROM ${tableName} ${whereClause}`;
            connection.query(countQuery, params, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                const totalItems = result[0].count;
                const totalPages = Math.ceil(totalItems / limit) || 1;

                // Fetch paginated data
                const dataQuery =
                    `SELECT * FROM ${tableName} 
                                    ${whereClause} 
                                    ORDER BY ${orderByColumn} 
                                    LIMIT ? OFFSET ?
                                    `;

                connection.query(dataQuery, [...params, limit, offset], (err, results) => {
                    if (err) return res.status(500).json({ error: err.message });

                    res.json({
                        data: results,
                        page,
                        totalPages,
                        totalItems
                    });
                });
            });
        };
    };
};

module.exports = applyPaginations;