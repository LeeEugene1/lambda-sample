const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: "",
    user: "",
    password: "",
    database: ""
  });

async function execute(sql, values) {
    const connection = await pool.getConnection();
    try {
        const [rows, fields] = await connection.execute(sql, values);
        return rows;
    } finally {
        connection.release(); 
    }
}

exports.handler = async (event) => {
    console.log('Create Top Creators View')
    try{
        const test = 200
        const test2 = 2
        const cals = await execute(`SELECT ? - ? AS result;`,[test, test2])
       
        return {
            statusCode: 200,
            body: JSON.stringify({ message: `result :${cals[0].result}` }),
        };
    }catch(error){
        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Internal Server Error",
                message: error.message, // Include the error message for debugging purposes
            }),
        };
    }
  };