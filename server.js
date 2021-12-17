require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: `${process.env.APP_URL}/callback`
    }, (accessToken, refreshToken, extraParams, profile, done) => {
        var info = {
            'email': profile.displayName,
            'user_id': profile.user_id,
            'jwt': extraParams.id_token
        };
        return done(null, info);
    }
);

passport.use(strategy);
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

const app = express();

app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('trust proxy', true);

const sess = {
    secret: 'superSecret',
    cookie: {},
    resave: false,
    saveUninitialized: true
};
app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.use('/login', require('./routes/login'));
app.use('/userinfo', require('./routes/userinfo'));
app.use('/callback', require('./routes/callback'));
app.use('/users', require('./routes/users'));
app.use('/cargo', require('./routes/cargo'));
app.use('/slips', require('./routes/slips'));
app.use('/boats', require('./routes/boats'));

app.get('/', (req, res) => {
    res.render('index')
})

// START SERVER
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;