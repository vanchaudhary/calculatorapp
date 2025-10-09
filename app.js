const express = require('express');
const sql = require('mssql');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

// Database configuration
const dbConfig = process.env.AZURE_SQL_CONNECTION_STRING ? {
    server: 'calculator-sql-server-vc.database.windows.net',
    database: 'calculator',
    user: 'sqladmin',
    password: 'Calculator123!',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
} : {
    server: process.env.SQL_SERVER || 'localhost',
    database: process.env.SQL_DATABASE || 'calculator-db',
    user: process.env.SQL_USER || 'sa',
    password: process.env.SQL_PASSWORD || 'YourPassword123!',
    options: {
        encrypt: true,
        trustServerCertificate: process.env.NODE_ENV === 'development'
    }
};

// Middleware setup
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'calculator-demo-secret',
    resave: false,
    saveUninitialized: true,
    genid: () => uuidv4()
}));

// Database connection pool
let pool;

async function connectToDatabase() {
    try {
        if (process.env.AZURE_SQL_CONNECTION_STRING || process.env.SQL_SERVER) {
            pool = await sql.connect(dbConfig);
            console.log('✅ Connected to Azure SQL Database');
            console.log('📊 Database: calculator');
        } else {
            console.log('⚠️ Running in demo mode without database');
        }
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        console.log('⚠️ Running in demo mode without database');
    }
}

// Helper functions
async function getOrCreateUser(sessionId) {
    if (!pool) return null;
    
    try {
        // Check if user exists
        const result = await pool.request()
            .input('sessionId', sql.NVarChar, sessionId)
            .query('SELECT id FROM Users WHERE session_id = @sessionId');
        
        if (result.recordset.length > 0) {
            return result.recordset[0].id;
        }
        
        // Create new user
        const newUser = await pool.request()
            .input('sessionId', sql.NVarChar, sessionId)
            .query('INSERT INTO Users (session_id) OUTPUT INSERTED.id VALUES (@sessionId)');
        
        return newUser.recordset[0].id;
    } catch (err) {
        console.error('Error managing user:', err.message);
        return null;
    }
}

async function saveCalculation(userId, expression, result) {
    if (!pool || !userId) return;
    
    try {
        await pool.request()
            .input('userId', sql.UniqueIdentifier, userId)
            .input('expression', sql.NVarChar, expression)
            .input('result', sql.NVarChar, result.toString())
            .query('INSERT INTO Calculations (user_id, expression, result) VALUES (@userId, @expression, @result)');
        console.log('✅ Calculation saved:', expression, '=', result);
    } catch (err) {
        console.error('Error saving calculation:', err.message);
    }
}

async function getCalculationHistory(userId, limit = 5) {
    if (!pool || !userId) return [];
    
    try {
        const result = await pool.request()
            .input('userId', sql.UniqueIdentifier, userId)
            .input('limit', sql.Int, limit)
            .query(`
                SELECT TOP(@limit) 
                    expression + ' = ' + result as DisplayText,
                    FORMAT(created_at, 'MMM dd, HH:mm') as FormattedDate
                FROM Calculations 
                WHERE user_id = @userId 
                ORDER BY created_at DESC
            `);
        
        return result.recordset;
    } catch (err) {
        console.error('Error getting history:', err.message);
        return [];
    }
}

// Routes
app.get('/', async (req, res) => {
    console.log('🔍 GET / - Pool status:', !!pool);
    const userId = await getOrCreateUser(req.sessionID);
    console.log('🔍 GET / - User ID:', userId);
    const history = await getCalculationHistory(userId);
    console.log('🔍 GET / - History length:', history.length);
    
    res.render('calculator', { 
        history: history,
        sessionId: req.sessionID.substring(0, 8),
        hasDatabase: !!pool
    });
});

app.post('/calculate', async (req, res) => {
    const num1 = parseFloat(req.body.num1);
    const num2 = parseFloat(req.body.num2);
    const op = req.body.op;
    
    let result;
    switch (op) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '*': result = num1 * num2; break;
        case '/': result = num2 !== 0 ? num1 / num2 : 'Error: Division by zero'; break;
        default: result = 'Invalid operation';
    }
    
    // Save calculation to database
    const userId = await getOrCreateUser(req.sessionID);
    const expression = `${num1} ${op} ${num2}`;
    console.log('🔍 POST /calculate - Pool status:', !!pool);
    console.log('🔍 POST /calculate - User ID:', userId);
    console.log('🔍 POST /calculate - Expression:', expression, '=', result);
    await saveCalculation(userId, expression, result);
    
    // Get updated history
    const history = await getCalculationHistory(userId);
    
    res.render('calculator', { 
        history: history,
        sessionId: req.sessionID.substring(0, 8),
        hasDatabase: !!pool,
        result: result,
        lastCalculation: expression
    });
});

// API endpoint for statistics
app.get('/api/stats', async (req, res) => {
    const userId = await getOrCreateUser(req.sessionID);
    
    if (!pool || !userId) {
        return res.json({ totalCalculations: 0, daysActive: 0 });
    }
    
    try {
        const stats = await pool.request()
            .input('userId', sql.UniqueIdentifier, userId)
            .query(`
                SELECT 
                    COUNT(*) as TotalCalculations,
                    COUNT(DISTINCT CAST(created_at AS DATE)) as DaysActive
                FROM Calculations 
                WHERE user_id = @userId
            `);
        
        res.json(stats.recordset[0]);
    } catch (err) {
        console.error('Error getting stats:', err.message);
        res.json({ totalCalculations: 0, daysActive: 0 });
    }
});

// Initialize database connection and start server
async function startServer() {
    await connectToDatabase();
    
    app.listen(port, () => {
        console.log(`🚀 Calculator app listening at http://localhost:${port}`);
        console.log(`📊 Database: ${pool ? 'Connected' : 'Demo mode'}`);
    });
}

startServer().catch(console.error);
