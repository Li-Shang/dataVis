let mysql = require('mysql');

exports.import2mysql = function(user, password) {
    console.log('import sql');

    let path = __dirname.replace(/\\/g, "\/") + '/bank-full.csv';


    let pool = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: user,
        password: password
    });
    pool.query('CREATE DATABASE IF NOT EXISTS `bank`;',
        function(error, results, field) {
            if (error) throw error;

            pool = mysql.createPool({
                connectionLimit: 10,
                host: 'localhost',
                user: user,
                password: password,
                database: 'bank',
                multipleStatements: true
            });
            let data =
                'USE `bank`; DROP TABLE IF EXISTS `bank_table`;\
                      CREATE TABLE `bank_table` (\
                      `customer_id` int(11) NOT NULL AUTO_INCREMENT,\
                      `age` int(11) DEFAULT NULL,\
                      `job` varchar(45) DEFAULT NULL,\
                      `marital` varchar(45) DEFAULT NULL,\
                      `education` varchar(45) DEFAULT NULL,\
                      `default` varchar(45) DEFAULT NULL,\
                      `balance` int(11) DEFAULT NULL,\
                      `housing` varchar(45) DEFAULT NULL,\
                      `loan` varchar(45) DEFAULT NULL,\
                      `contact` varchar(45) DEFAULT NULL,\
                      `day` int(11) DEFAULT NULL,\
                      `month` varchar(45) DEFAULT NULL,\
                      `duration` int(11) DEFAULT NULL,\
                      `campaign` int(11) DEFAULT NULL,\
                      `pdays` int(11) DEFAULT NULL,\
                      `previous` int(11) DEFAULT NULL,\
                      `poutcome` varchar(45) DEFAULT NULL,\
                      `y` varchar(45) DEFAULT NULL,\
                      PRIMARY KEY (`customer_id`)\
                  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;'

            pool.query(data, function(error, results, field) {
                if (error) throw error;
                data =
                    'TRUNCATE TABLE bank_table;\
                            LOAD DATA LOCAL INFILE ?\
                            INTO TABLE bank_table\
                            FIELDS TERMINATED BY \';\'\
                            OPTIONALLY ENCLOSED BY \'"\'\
                            LINES TERMINATED BY \'\\n\'\
                            IGNORE 1 ROWS\
                            (`age`, `job`, `marital`, `education`, `default`, `balance`, `housing`, `loan`, `contact`,\
                            `day`, `month`, `duration`, `campaign`, `pdays`, `previous`, `poutcome`, `y`)\
                            SET `customer_id` = null;';
                pool.query(data, [path],
                    function(
                        error, results, field) {
                        if (error) throw error;
                        alert('import done!');
                        $('#import-panel').hide();
                    });
            });
        });
};
