const loginRouter = require('express').Router()
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { registerUser } = require('../controllers/userController');


passport.use(new LocalStrategy(async (email, password, cb) => {
    try {
        const passwordCorrect = false
        const user = await User.findOne({ email });

        if (user) {
            passwordCorrect = await bcrypt.compare(password, user.passwordHash);
        }

        if (!(user && passwordCorrect)) {
            return cb(null, false, { message: 'Incorrect email or password.' });
        }
        return cb(null, user);
    } catch (err) {
        return cb(err);
    }
}));

passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        cb(null, { id: user.id, email: user.email, role: user.role });
    });
});

passport.deserializeUser((user, cb) => {
    process.nextTick(() => cb(null, user));
});


loginRouter.get('/login', (req, res, next) => {
    res.redirect('/login.html');
});

loginRouter.post('/login/password', passport.authenticate('local', {
    successRedirect: '/index.html',
    failureRedirect: '/login',
}));

loginRouter.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        return res.redirect('/login');
    });
});

loginRouter.get('/register', (req, res, next) => {
    res.redirect('/register.html');
});

loginRouter.post('/register/new', registerUser);





module.exports = loginRouter