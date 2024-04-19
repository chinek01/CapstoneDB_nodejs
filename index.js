import express from "express"
import bodyParser from "body-parser"
import pg from "pg"
import axios from "axios"
import { render } from "ejs"

const app = express()
const port = 3000 

app.use(bodyParser.urlencoded( {extended: true} ))
app.use(express.static("public"))

const db = new pg.Client({
    user: "postgres",
    password: "123456",
    host: "localhost",
    database: "library",
    port: 5432
})

db.connect()

let books = [
    {
        id: 1,
        cover: "https://covers.openlibrary.org/b/isbn/9780007492541-M.jpg",
        title: "The Painted Man",
        author: "Peter V. Brett",
        isbn: "9780007492541",
        read_date: "2010-10-20",
        recomend: 10,
        shop_link: "https://openlibrary.org/works/OL15185914W/The_Painted_Man?edition=key%3A/books/OL27523378M",
        entry: "Bardzo fajna książka, przeczytana już przeze mnie pare razy.",
        notes: "Jak wyżej, plus świetnie ilustracje w Polskim wydaniu"
    },
]

let find_obj = {}

function normalDate(someDate) {
    // const [date, time] = someDate
    //     .replace(/T/, ' ')
    //     .replace(/\..+/, '')
    //     .split(" ")

    // return {
    //     date,
    //     time
    // }

    const dateObj = new Date(someDate)
    const year = dateObj.getFullYear()     
    const month = dateObj.getMonth() 
    const day = dateObj.getDay()    

    var return_string = year + "-"
    
    if (month < 10) {
        return_string += "0"
    } 

    return_string += month + "-"

    if (day < 10) {
        return_string += "0"
    }

    return_string += day

    return return_string
}

async function getAllBooks() {
    try {
        const query = "select book_id, cover, isbn, read_date, recomend, entry, title, author from books order by book_id"

        const result = await db.query(query)

        // console.log(result.rows)

        books = []

        result.rows.forEach((book) => {
            var dateStr = book.read_date
            var dateObj = new Date(dateStr)
            var entryObj = ""

            if (book.entry.length > 200) {
                entryObj = book.entry.substring(0, 200) + " ..."
            } else {
                entryObj = book.entry
            }

            books.push ({
                book_id: book.book_id,
                book_cover: book.cover,
                book_isbn: book.isbn,
                // book_read_date: normalDate(book.read_date).date,
                // book_read_date: book.read_date,
                book_read_date: dateObj.toDateString(),
                book_recomend: book.recomend,
                book_entry: entryObj,
                book_title: book.title,
                book_author: book.author
            })
        })

    } catch (error) {
        console.log("Some DB error")
    }
}

async function getBookById(book_id) {
    try {
        const result = await db.query("select book_id, cover, isbn, read_date, recomend, shop_link, entry, notes, title, author from books where book_id = " + book_id)

        const read_date = normalDate(result.rows[0].read_date)

        // console.log(result.rows[0])
        // console.log(read_date)

        return {
            book_id: result.rows[0].book_id,
            cover: result.rows[0].cover,
            isbn: result.rows[0].isbn,
            read_date: read_date, 
            recomend: result.rows[0].recomend,
            shop_link: result.rows[0].shop_link,
            entry: result.rows[0].entry,
            notes: result.rows[0].notes, 
            title: result.rows[0].title, 
            author: result.rows[0].author,
        }
    }   
    catch (error) {
        console.log("Some DB error", error)
    }
}

async function getBookCount() {
    try {
        const query = "select count(book_id) from books"

        const result = await db.query(query)

        return result.rows[0]

    } catch (error) {
        console.log("Some DB error", error)
    }
}

async function getBookByName(book_name) {
    try {

        const result = await db.query("select book_id, cover, isbn, read_date, recomend, shop_link, entry, notes, title, author from books where book_id = " + book_name)

        const read_date = normalDate(result.rows[0].read_date)

        return {
            book_id: result.rows[0].book_id,
            cover: result.rows[0].cover,
            isbn: result.rows[0].isbn,
            read_date: read_date,
            recomend: result.rows[0].recomend,
            shop_link: result.rows[0].shop_link,
            entry: result.rows[0].entry,
            notes: result.rows[0].notes,
            title: result.rows[0].title,
            author: result.rows[0].author,
        }

    } catch (error) {
        console.log("Some DB error", error)
    }
}

async function deleteBook(id) {
    // console.log(id)
    try {
        await db.query("delete from books where book_id = " + id)
    } catch (error) {
        console.log("Some DB error - delete function :", error)
    }
}

async function updateBookById(id, 
    cover, isbn, read_date, recomend, shop_link, 
    entry, notes, title, author) {
    try {

        // update books set cover = '', isbn = '', read_date = '2023-03-01', recomend = 0, shop_link = '', notes = '', title = '', author = '' where book_id = 

        // await db.query("update books set cover = '$1', isbn = '$2', read_date = $3, recomend = $4, shop_link = '$5', entry = '$6', notes = '$7', title = '$8', author = '$9' where book_id = $10", [
        //     cover, isbn, read_date, recomend, shop_link, entry, notes, title, author, id
        // ])

        let query = "update books set " + 
        " cover = '" + cover + "'," + 
        " isbn = '" + isbn + "'," + 
        " read_date = '" + read_date + "'," +
        " recomend = " + recomend + "," +
        " shop_link = '" + shop_link + "'," + 
        " entry = '" + entry + "'," +
        " notes = '" + notes + "'," +
        " author = '" + author + "'," +
        " title = '" + title + "'" + 
        " where book_id = " + id

        // console.log(query)

        await db.query(query)

    } catch (error) {
        console.log("Some DB error:", error)
    }
}

async function insertBook(book) {
    try {
        // insert into books (cover, isbn, read_date, recomend, shop_link, entry, notes, title, author) values ('', '', '2024-03-01', 0, '', '', '', '', '')
        const insertQuery = `INSERT INTO books (cover, isbn, read_date, recomend, shop_link, entry, notes, title, author) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

        const queryParams = [
            book.book_cover, 
            book.book_isbn, 
            book.book_read_date, 
            book.book_recomend, 
            book.book_shop_link, 
            book.book_entry, 
            book.book_notes, 
            book.book_title, 
            book.book_author
        ];

        // console.log(insertQuery, queryParams);

        await db.query(insertQuery, queryParams);        

    } catch (error) {
        console.log("Some db error: ", error)
    }
}

// polskie wydanie 
// malowany człowiek ISBN: 9788379648580

// open liblary
// malowany człowiek ISBN: 9780007492541

app.get("/", async (req, res) => {
    // get all books from DB 
    await getAllBooks()

    // console.log(await getBookCount())

    res.render("index.ejs", {
        totalReadedBooks: books.length,
        bookList: books,
    })
})

app.get("/nf_read_book", (req, res) => {
    res.render("nf_read_book.ejs")
})

app.get("/pnf", (req, res) => {
    res.render("404.ejs")
})

app.get("/new", (req, res) => {
    // page new 
    if (find_obj != NaN) {
        res.render("new.ejs", {
            book_author: find_obj.book_author,
            book_title: find_obj.book_title, 
            isbn: find_obj.isbn, 
            cover: find_obj.cover,
        })
    } else {
        res.render("new.ejs")
    }
})

app.post("/new", async (req, res) => {
    // inset new book to DB 

    let book = {}

    if (find_obj != NaN) {

        book = {
            book_title: find_obj.book_title,
            book_author: find_obj.book_author[0],
            book_cover: find_obj.cover,
            book_isbn: find_obj.isbn,
            book_shop_link: req.body.book_shop_link,
            book_read_date: req.body.book_read_date,
            book_recomend: req.body.book_recomend,
            book_entry: req.body.book_entry,
            book_notes: req.body.book_notes,
        }
    } else {

        book = {
            book_title: req.body.book_title,
            book_author: req.body.book_author,
            book_cover: req.body.book_cover,
            book_isbn: req.body.book_isbn,
            book_shop_link: req.body.book_shop_link,
            book_read_date: req.body.book_read_date,
            book_recomend: req.body.book_recomend,
            book_entry: req.body.book_entry,
            book_notes: req.body.book_notes,
        }
    }

    if (book != NaN){
        await insertBook(book)
    } else {
        console.log("Some error ")
    }

    // clear find obj
    find_obj = {}

    // console.log(book)

    res.redirect("/")
})

app.get("/edit/:id", async (req, res) => {

    const id = parseInt(req.params.id)
    const result = await getBookById(id)

    res.render("edit.ejs", {
        book_title: result.title,
        book_author: result.author,
        book_cover: result.cover,
        book_isbn: result.isbn,
        book_shop_link: result.shop_link,
        book_read_date: result.read_date,
        book_recomend: result.recomend,
        book_entry: result.entry,
        book_notes: result.notes,
        book_id: result.book_id,
    })
})

app.post("/edit", async (req, res) => {
    
    await updateBookById(
        req.body.book_id,
        req.body.book_cover,
        req.body.book_isbn,
        req.body.book_read_date,
        req.body.book_recomend,
        req.body.book_shop_link,
        req.body.book_entry,
        req.body.book_notes,
        req.body.book_title,
        req.body.book_author,
    )

    // res.redirect("/")
    res.redirect("/book/" + req.body.book_id)
})

app.post("/search_engine", async (req, res) => {
    const main_api_url = "https://openlibrary.org/search.json?q="
    // cover example:
    // https://covers.openlibrary.org/b/isbn/9788375740578-M.jpg
    // remember to add -M.jpg    
    const cover_api_url = "https://covers.openlibrary.org/b/isbn/"

    const to_search = req.body.search_engine
    // console.log(to_search.replaceAll(" ", "+"))
    // console.log(to_search)

    try {
        // const query = main_api_url + to_search.replaceAll(" ", "+")
        const query = main_api_url + to_search
        const response = await axios.get(query)
        const result = JSON.parse(JSON.stringify(response.data)).docs
        
        find_obj = {
            book_author: result[0].author_name,
            book_title: result[0].title,
            isbn: to_search,
            cover: cover_api_url + to_search + "-L.jpg",
        }

        res.redirect("/new")

    } catch (error) {
        console.log("Some error:", error)
    }
})

app.get("/book", (req, res) => {
    res.render("book_1.ejs")
})

app.get("/book/:id", async (req, res) => {
    // get one book 
    const id = parseInt(req.params.id)
    const result = await getBookById(id)

    // console.log(result)

    res.render("book.ejs", {
        book_title: result.title,
        book_author: result.author,
        book_cover: result.cover,
        book_isbn: result.isbn,
        book_shop_link: result.shop_link,
        book_read_date: result.read_date,
        book_recomend: result.recomend,
        book_entry: result.entry,
        book_notes: result.notes,
        book_id: result.book_id,
    })
}) 

app.get("/delete/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    // console.log(id)

    await deleteBook(id)

    res.redirect("/")
})

// server init 
app.listen(port, () => {
    console.log("Server running on port: http://localhost:" + port + "/")
    // console.log(normalDate('2011-01-09T23:00:00.000Z').date)
})
