var router = require('express').Router();
var pg = require('pg');
//configuration object// this is the name of the db we want to connect to
//key database, value rho
var config = {
    database: 'rho'
};

//initialized the database connection pool
var pool = new pg.Pool(config);

router.get('/:id', function(req, res) {
        pool.connect(function(err, client, done) {
                if (err) {
                    console.log('Error connecting to the DB', err);
                    res.sendStatus(500);
                    done();
                    return;
                } //end of if statement
                client.query('SELECT * FROM books WHERE id = $1;', [req.params.id], function(err, result) {
                        done();
                        if (err) {
                            console.log('Error querying the DB', err);
                            res.sendStatus(500);
                            return;
                        } //end of if statement

                    }); //end of client query
            }); //end of pool.connt

    }); //end of router.get



//create a new books -----> POST
router.get('/', function(req, res) {
        //err is an error object, will be not-null if there was an error connecting
        //possible errors, db not running,
        //client - object that is used to make queries against the database
        //done is a function to call when you are done (return connection back to the pool)
        pool.connect(function(err, client, done) { //callback function when connection has been made (or error); 3 parameters
            if (err) {
                console.log('error connecting to database', err);
                res.sendStatus(500);
                done();
                return;
            } //close of if statement

            client.query('SELECT * FROM books;', function(err, result) { //1st argument: sql string; 2nd argument (opertional) input parameters; 3rd argument callback function to execute once the query is finished
                //takes an error object and a result object as args
                done();
                if (err) {
                    console.log('Error querying the DB', err);
                    res.sendStatus(500);
                    done(); //release connection
                    return;
                } //end of if statement
                console.log('got rows from the DB', result.rows);
                res.send(result.rows);
            }); //end of client.query
        }); //close pg connect function
    }); //end of router.get

router.post('/', function(req, res) {

    pool.connect(function(err, client, done) {

            if (err) {
              console.log('Error connecting the DB', err);
                res.sendStatus(500);
                done();
                return;

            } //end of if statement

            client.query('INSERT INTO books (author, title, published, edition, publisher) VALUES($1, $2, $3, $4, $5) returning *', [req.body.author, req.body.title, req.body.published, req.body.edition, req.body.publisher], function(err, result) {
                    done();
                    if (err) {
                        console.log('err', err);
                        res.sendStatus(500);
                        return;

                    } //end of if

                    res.send(result.rows);
                }); //end of client query
        }); //end pool connect

}); //end of router post


//read ------> GET

module.exports = router;
