

const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use(
    "/uploads",
    express.static("uploads")
);

const db = new sqlite3.Database("./data/store.db");

const storage = multer.diskStorage({

    destination:(req,file,cb)=>{

        cb(null,"uploads/");

    },

    filename:(req,file,cb)=>{

        cb(
            null,
            Date.now() +
            path.extname(file.originalname)
        );

    }

});

const upload = multer({
    storage:storage
});

db.serialize(() => {

    db.run(`
CREATE TABLE IF NOT EXISTS admins(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
)
`);

db.run(`
INSERT OR IGNORE INTO admins(
    email,
    password
)
VALUES(
    'admin@urban.com',
    'admin123'
)
`);

    db.run(`
    CREATE TABLE IF NOT EXISTS products(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price TEXT,
        category TEXT,
        image TEXT
    )
`);

    db.run(`
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS orders(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT,
            total_amount TEXT
        )
    `);

});

app.get("/", (req,res)=>{
    res.send("Urban Fashion Backend Running");
});

app.post("/api/register", async (req, res) => {

    const { name, email, password } = req.body;

    try{

        const hashedPassword =
        await bcrypt.hash(password, 10);

        db.run(
            `INSERT INTO users(name,email,password)
             VALUES(?,?,?)`,
            [name, email, hashedPassword],

            function(err){

                if(err){

                    return res.json({
                        success:false,
                        message:"Email already exists"
                    });

                }

                res.json({
                    success:true,
                    message:"Registration successful"
                });

            }
        );

    }catch(error){

        res.status(500).json({
            success:false,
            message:"Server Error"
        });

    }

});

app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],

        async (err, row) => {

            if(err){

                return res.status(500).json({
                    success:false,
                    message:"Server Error"
                });

            }

            if(!row){

                return res.json({
                    success:false,
                    message:"Invalid Email or Password"
                });

            }

            const match =
            await bcrypt.compare(
                password,
                row.password
            );

            if(match){

                res.json({
                    success:true,
                    message:"Login Successful",
                    user:row
                });

            }else{

                res.json({
                    success:false,
                    message:"Invalid Email or Password"
                });

            }

        }

    );

});

app.post("/api/order", (req, res) => {

    const { customer_name, total_amount } = req.body;

    db.run(
        `INSERT INTO orders(
            customer_name,
            total_amount
        )
        VALUES(?,?)`,
        [customer_name, total_amount],

        function(err){

            if(err){

                return res.json({
                    success:false,
                    message:"Order Failed"
                });

            }

            res.json({
                success:true,
                message:"Order Saved Successfully"
            });

        }

    );

});

app.get("/api/users", (req, res) => {

    db.all(
        "SELECT * FROM users",
        [],
        (err, rows) => {

            res.json(rows);

        }
    );

});

app.get("/api/orders", (req, res) => {

    db.all(
        "SELECT * FROM orders",
        [],
        (err, rows) => {

            res.json(rows);

        }
    );

});

app.get("/api/analytics/users", (req,res)=>{

    db.get(
        "SELECT COUNT(*) AS total FROM users",
        [],
        (err,row)=>{
            res.json(row);
        }
    );

});

app.get("/api/analytics/orders", (req,res)=>{

    db.get(
        "SELECT COUNT(*) AS total FROM orders",
        [],
        (err,row)=>{
            res.json(row);
        }
    );

});

app.get("/api/analytics/revenue", (req,res)=>{

    db.get(
        "SELECT SUM(total_amount) AS total FROM orders",
        [],
        (err,row)=>{
            res.json(row);
        }
    );

});

app.get("/api/products",(req,res)=>{

    db.all(
        "SELECT * FROM products",
        [],
        (err,rows)=>{
            res.json(rows);
        }
    );

});

app.post("/api/products",(req,res)=>{

    const {
        name,
        price,
        category,
        image
    } = req.body;

    db.run(
        `INSERT INTO products(
            name,
            price,
            category,
            image
        )
        VALUES(?,?,?,?)`,
        [
            name,
            price,
            category,
            image
        ],

        function(err){

            if(err){

                return res.json({
                    success:false
                });

            }

            res.json({
                success:true
            });

        }
    );

});

app.delete(
"/api/products/:id",
(req,res)=>{

    db.run(
        "DELETE FROM products WHERE id=?",
        [req.params.id],

        function(err){

            res.json({
                success:true
            });

        }
    );

});

app.put("/api/products/:id",(req,res)=>{

    const {
        name,
        price,
        category,
        image
    } = req.body;

    db.run(
        `UPDATE products
         SET
         name=?,
         price=?,
         category=?,
         image=?
         WHERE id=?`,
        [
            name,
            price,
            category,
            image,
            req.params.id
        ],

        function(err){

            if(err){

                return res.json({
                    success:false
                });

            }

            res.json({
                success:true
            });

        }
    );

});

app.post(
"/api/upload",
upload.single("image"),

(req,res)=>{

    res.json({

        success:true,

        image:
        "/uploads/" +
        req.file.filename

    });

});

app.post(
"/api/admin/login",
(req,res)=>{

    const {
        email,
        password
    } = req.body;

    db.get(
        `
        SELECT *
        FROM admins
        WHERE email=?
        AND password=?
        `,
        [
            email,
            password
        ],

        (err,row)=>{

            if(row){

                res.json({
                    success:true
                });

            }else{

                res.json({
                    success:false
                });

            }

        }

    );

});

app.get("/api/analytics/products",(req,res)=>{

    db.get(
        "SELECT COUNT(*) AS total FROM products",
        [],
        (err,row)=>{
            res.json(row);
        }
    );

});

app.get("/api/recent-users",(req,res)=>{

    db.all(
        `
        SELECT *
        FROM users
        ORDER BY id DESC
        LIMIT 5
        `,
        [],
        (err,rows)=>{

            res.json(rows);

        }
    );

});

app.get("/api/recent-orders",(req,res)=>{

    db.all(
        `
        SELECT *
        FROM orders
        ORDER BY id DESC
        LIMIT 5
        `,
        [],
        (err,rows)=>{

            res.json(rows);

        }
    );

});

app.get("/api/recent-products",(req,res)=>{

    db.all(
        `
        SELECT *
        FROM products
        ORDER BY id DESC
        LIMIT 5
        `,
        [],
        (err,rows)=>{

            res.json(rows);

        }
    );

});

app.delete(
"/api/users/:id",
(req,res)=>{

    db.run(
        "DELETE FROM users WHERE id=?",
        [req.params.id],

        function(err){

            res.json({
                success:true
            });

        }
    );

});

app.delete(
"/api/orders/:id",
(req,res)=>{

    db.run(
        "DELETE FROM orders WHERE id=?",
        [req.params.id],

        function(err){

            res.json({
                success:true
            });

        }
    );

});

app.listen(3000, ()=>{
    console.log("Server running on http://localhost:3000");
});