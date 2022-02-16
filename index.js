const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const postsDB = require('./posts.json');


app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// enable body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('home', { postsDB });
});

app.get('/posts', (req, res) => {
    res.render('Manage', { postsDB });

});
app.get('/:id', (req, res) => {

    var found = postsDB.indexOf(postsDB.find(post => post.id == req.params.id))

    if (found == -1) {
        res.send("post not found");
    }
    res.render('singleStory', {
        id: postsDB[found].id,
        title: postsDB[found].title,
        picture: postsDB[found].picture,
        textstory: postsDB[found].textstory,
    });

});



app.get('/posts/new', (req, res) => {
    res.render('add');

});

app.post('/posts', (req, res) => {


    let { title, description, date, picture, textstory } = req.body;

    if (!title || !description || !date || !picture || !textstory) {
        res.status(400).send();
    }

    postsDB.push({
        id: (postsDB.length + 1).toString(),
        title,
        description,
        date,
        picture,
        textstory
    });
    writeToJson();
    res.redirect('/');
});
app.post('/posts/edit/:id', (req, res) => {

    var post = postsDB.filter(post => post.id == req.body.id);

    res.render('edit', {
        id: post[0].id,
        title: post[0].title,
        picture: post[0].picture,
        description: post[0].description,
        date: post[0].date,
        textstory: post[0].textstory
    });

});
app.post('/posts/edit', (req, res) => {

    found = postsDB.indexOf(postsDB.find(post => post.id = req.body.id));

    postsDB[found].id = req.body.id;
    postsDB[found].title = req.body.title;
    postsDB[found].description = req.body.description;
    postsDB[found].date = req.body.date;
    postsDB[found].picture = req.body.picture;
    postsDB[found].textstory = req.body.textstory;

    writeToJson();
    res.redirect('/');

});


app.post('/posts/delete/:id', (req, res) => {
    console.log(req.body.id);
    post = postsDB.indexOf(postsDB.find(post => post.id == req.body.id));
    delete postsDB[post];
    writeToJson();
    res.render('Home', { postsDB });
});

function writeToJson() {
    try {
        fs.writeFileSync('./posts.json', JSON.stringify(postsDB, null, 2), 'utf8');
        console.log("The file was saved!");
    } catch (err) {
        res.send("An error has ocurred when saving the file.");
    }
}


app.listen(5000, console.log('server is listening'));