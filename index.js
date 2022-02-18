const AWSXRay = require('aws-xray-sdk-core')
const captureMySQL = require('aws-xray-sdk-mysql')
const mysql = captureMySQL(require('mysql2'))
const AWS = require('aws-sdk')

const username = process.env.USER ? process.env.USER : '{{IAM_USER}}'
const host = process.env.HOST ? process.env.HOST : '{{RDS_HOST}}'
const database = process.env.DB_NAME ? process.env.DB_NAME : '{{DB_NAME}}'
const region = process.env.AWS_REGION ? process.env.AWS_REGION : '{{RDS_REGION}}'
const sqlport = 3306

AWSXRay.setContextMissingStrategy(() => {});

const signer = new AWS.RDS.Signer({
    region: region,
    hostname: host,
    port: sqlport,
    username: username
})

exports.handler = async (event) => {
    let connectionConfig = {
        host     : host,
        user     : username,
        database : database,
        ssl: 'Amazon RDS',
        authPlugins: { mysql_clear_password: () => () => signer.getAuthToken() }
    }

    var connection = mysql.createConnection(connectionConfig)
    // var query = event.query
    var query = 'select * from my_table_name'

    return new Promise( ( resolve, reject ) => {

        connection.connect()

        connection.query(query, function (error, results) {
            if (error)
                throw error
            console.log("Ran query: " + query)
            for (result in results) {
                console.log(results[result])
            }
            const response = {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(results)
            }
            resolve(response)
        })

        connection.end( err => {
            if ( err )
                return reject( err )
        })
    })
}