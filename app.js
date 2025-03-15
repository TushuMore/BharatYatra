const express = require("express");
const path = require("path");
const app = express();
const db = require("./config/mongodb-connection");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isLoggedIn } = require("./middelwares/isLoggedIn");

// Database models required
const userModel = require("./models/user");
const contactModel = require("./models/contact");
const postCardModel = require("./models/postCard");
const bookingModel = require("./models/booking");

// Requiring config file with dotenv
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

//All routes are set here
app.get("/", (req, res) => {
  res.render('login');
})

app.get("/home",isLoggedIn, async(req, res) => {
  let cards = await postCardModel.find();
  res.render("index", { user: req.user, cards});  
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/booking",(req, res) => {
  res.render("booking");
});

app.get("/usersBooking", isLoggedIn, async(req, res) => {
  let bookings = await bookingModel.find();
  res.render("usersBooking", {bookings});
});

app.get("/users", isLoggedIn, async (req, res) => {
  let users = await userModel.find();
  res.render("users", { users });
});

app.get("/usersBooking", isLoggedIn, (req, res) => {
  res.render("usersBooking");
});

app.get("/profile",isLoggedIn, async(req, res) => {
  let bookings = await bookingModel.find();
  res.render("profile", {user: req.user, bookings});
});

app.get("/admin", isLoggedIn, async(req, res) => {
  let contacts = await contactModel.find();
  res.render("admin", {contacts});
});

// All forms are handeled here

// 1: SignUp the user.
app.post("/create", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    let existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.send("You already have an account!");
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          if (err) {
            return res.status(401).send(err.message);
          } else {
            let user = await userModel.create({
              username,
              email,
              password: hash,
            });

            let token = jwt.sign(
              { email: user.email, id: user._id, isAdmin: user.isAdmin, username: user.username },
              process.env.JWT_KEY
            );
            res.cookie("token", token);

            res.redirect("/");
          }
        });
      });
    }
  } catch (error) {
    res.send(error.message);
  }
});

// 2: Login the user
app.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).send("Email or password is incorrect!");
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (user) {
        let token = jwt.sign(
          { email: user.email, id: user._id, isAdmin: user.isAdmin, username: user.username },
          process.env.JWT_KEY
        );
        res.cookie("token", token);
        res.redirect("/home");
      } else {
        res.send("error: ", "Email or password is incorrect!");
      }
    });
  } catch (error) {
    res.send(error.message);
  }
});

// 3: Logout user
app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

// 4: Posting the contact data
app.post("/contact", async (req, res) => {
  try {
    let { contactEmail, query } = req.body;

    let details = await contactModel.create({
      email: contactEmail,
      query,
    });

    res.redirect("/home");
  } catch (error) {
    return res.send(error.message);
  }
});

// 5: Posting the booking cards
app.post("/postCard", async (req, res) => {
  try {
    let { cardName, location, price, image } = req.body;

    let cardDetail = await postCardModel.create({
      cardName,
      location,
      image,
      price,
    });

    res.redirect("/admin");
  } catch (error) {
    res.send(error.message);
  }
});

// 6: sending the booking data
app.post("/book", isLoggedIn, async (req, res) => {
  try {
    let { customerName, customerEmail, mobileNo, totalPerson, from, where } =
      req.body;

    let booking = await bookingModel.create({
      customerName,
      customerEmail,
      mobileNo,
      totalPerson,
      from,
      where,
    });

    res.redirect('/profile');
  } catch (error) {
    res.send(error.message);
  }
});

// 7: Deleting users 
app.get('/removeUser/:id', async(req, res) => {
  let deletedUser = await userModel.findOneAndDelete({_id: req.params.id});

  res.redirect('/users');
})

// 8: Deleting users 
app.get('/removeBooking/:id', async(req, res) => {
  let deletedBooking = await bookingModel.findOneAndDelete({_id: req.params.id});

  res.redirect('/usersBooking');
})

// 9: Cancle booking 
app.get('/cancleBooking/:id', async(req, res) => {
  let cancleBooking = await bookingModel.findOneAndDelete({_id: req.params.id});
  res.redirect('/profile');
})

// 9: Delete contact 
app.get('/deleteContact/:id', async(req, res) => {
  let deleteContact = await contactModel.findOneAndDelete({_id: req.params.id});
  res.redirect('/admin');
})

// Our server is live on 3000 port
app.listen(3000);
