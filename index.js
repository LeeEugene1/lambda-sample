const mysql = require('mysql2/promise');

const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: '',
    secretAccessKey: '',
    region: ''//ap-northeast-2
});
const pool = mysql.createPool({
    host: '',
    user: "",
    password: "",
    database: ''
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
    try{
        const result = await execute(`
            select * from tb_test
        `);

        function uploadBufferToS3(buffer, fileName) {
            const params = {
                Bucket: '',//bucket 이름
                Key: fileName,
                Body: buffer,
                ACL: 'public-read',//private 도 있음
                ContentType: 'application/json'
                
            };
            return s3.upload(params).promise();
      }

      //주의! await안달면 안기다리고 넘어감
      await uploadBufferToS3(JSON.stringify({result}), `[폴더명]/[파일명].json`)

    return {
        statusCode: 200,
        body: JSON.stringify({ message: `send s3() :${new Date()}` }),
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
  
  