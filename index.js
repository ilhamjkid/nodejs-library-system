const path = require("path");

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const rootDir = require("./helpers/rootDir");

const server = express();
const PORT = process.env.PORT || 5000;

server.set("view engine", "ejs");
server.set("views", path.join(rootDir, "views"));
server.use(express.static(path.join(rootDir, "public")));
server.use(expressLayouts);

server.use("/", (req, res, next) => {
  res.locals.user = { isAdmin: false };
  res.locals.isAuthenticated = true;
  next();
});
server.get("/", (req, res, next) => {
  res.status(200).render("home/index", {
    layout: "layouts/main",
    pageTitle: "Daftar Buku",
    path: "/",
  });
});
server.get("/loan", (req, res, next) => {
  res.status(200).render("home/loan", {
    layout: "layouts/main",
    pageTitle: "Buku Dipinjam",
    path: "/loan",
  });
});
server.get("/profile", (req, res, next) => {
  res.status(200).render("home/profile", {
    layout: "layouts/main",
    pageTitle: "Profil Pengguna",
    path: "/profile",
  });
});

server.use("/admin", (req, res, next) => {
  res.locals.user = { isAdmin: true };
  res.locals.isAuthenticated = true;
  next();
});
server.get("/admin/borrower", (req, res, next) => {
  res.status(200).render("admin/borrower", {
    layout: "layouts/main",
    pageTitle: "Daftar Peminjam",
    path: "/admin/borrower",
  });
});
server.get("/admin/book-order", (req, res, next) => {
  res.status(200).render("admin/book-order", {
    layout: "layouts/main",
    pageTitle: "Order Buku",
    path: "/admin/book-order",
  });
});
server.get("/admin/book-list", (req, res, next) => {
  res.status(200).render("admin/book-list", {
    layout: "layouts/main",
    pageTitle: "Daftar Buku",
    path: "/admin/book-list",
  });
});
server.get("/admin/book-manage", (req, res, next) => {
  res.status(200).render("admin/book-manage", {
    layout: "layouts/main",
    pageTitle: "Tambah Buku",
    path: "/admin/book-manage",
  });
});
server.get("/admin/profile-admin", (req, res, next) => {
  res.status(200).render("admin/profile-admin", {
    layout: "layouts/main",
    pageTitle: "Profil Admin",
    path: "/admin/profile-admin",
  });
});

server.use("/auth", (req, res, next) => {
  res.locals.user = null;
  res.locals.isAuthenticated = false;
  next();
});
server.get("/auth/register", (req, res, next) => {
  res.status(200).render("auth/register", {
    layout: "layouts/main",
    pageTitle: "Daftar",
    path: "/auth/register",
  });
});
server.get("/auth/login", (req, res, next) => {
  res.status(200).render("auth/login", {
    layout: "layouts/main",
    pageTitle: "Masuk",
    path: "/auth/login",
  });
});

server.use((req, res, next) => {
  res.status(404).render("errors/error", {
    user: null,
    isAuthenticated: false,
    layout: "layouts/main",
    pageTitle: "Kesalahan",
    path: "*",
    statusCode: 404,
    errorMessage: "Halaman Tidak Ditemukan",
  });
});

server.listen(PORT, () => {
  console.log("Server is running");
  if (process.env.NODE_ENV === "development") {
    console.log(`Link: http://localhost:${PORT}`);
  }
});
