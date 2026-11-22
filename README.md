# Merc Jewelry Admin Portal

An administrator website for a jewelry store. The store owner can look at every product, search for one, add a new product, change a product's details (such as the price or how many are in stock), and delete a product. Everything is saved, so the changes are still there after you refresh the page or restart the project.

This project was built by a team of four as a group assignment. It is a **React** website that talks to a small **Express** server, which keeps all the product information in a file called `db.json`.

---

## Table of contents

1. [What the website does](#1-what-the-website-does)
2. [What you need before you start](#2-what-you-need-before-you-start)
3. [How to run the project (step by step)](#3-how-to-run-the-project-step-by-step)
4. [How to use the website](#4-how-to-use-the-website)
5. [How the project works](#5-how-the-project-works)
6. [Project folders and files](#6-project-folders-and-files)
7. [The product data](#7-the-product-data)
8. [The server (API)](#8-the-server-api)
9. [Running the tests](#9-running-the-tests)
10. [Commands cheat sheet](#10-commands-cheat-sheet)
11. [How the team worked (Git)](#11-how-the-team-worked-git)
12. [The team](#12-the-team)
13. [Troubleshooting](#13-troubleshooting)
14. [Glossary](#14-glossary)

---

## 1. What the website does

| Page | Web address | What you can do there |
|---|---|---|
| Home | `/` | Read about the store and jump to the products |
| Products | `/products` | See all products, and search by name, category, or material |
| Add product | `/products/new` | Fill in a form to add a new product |
| Product details | `/products/1` (the number is the product's id) | See one product, change its details and save, or delete it |
| Not found | any other address | A friendly page that says the page does not exist |

Every page also has:

- A **header** at the top with the store name and the menu links (Home, Products, Add product).
- A **footer** at the bottom with the store's phone number, email, address, and opening hours. This information comes from the server, not from the page itself.

The website also works on a phone: the layout changes to fit smaller screens.

**Categories** in the store: Rings, Necklaces, Earrings, Bracelets, Watches, and Cufflinks.

---

## 2. What you need before you start

You need three free programs on your computer.

| Program | What it is for | How to check you have it |
|---|---|---|
| **Node.js** (version 18 or newer) | Runs the project. It also installs npm, which downloads the project's tools | Open a terminal and type `node -v`. You should see something like `v20.11.0` |
| **Git** | Downloads the project from GitHub | Type `git --version` |
| **A code editor** such as [VS Code](https://code.visualstudio.com/) | Lets you read and change the code | Open it from your applications |

If a command says "not found", install that program from its website: [nodejs.org](https://nodejs.org/) and [git-scm.com](https://git-scm.com/).

**What is a terminal?** It is a window where you type commands. In VS Code, open it from the menu: **Terminal, then New Terminal**. On Windows you can also use Git Bash or PowerShell, and on Mac or Linux use the Terminal app.

---

## 3. How to run the project (step by step)

### Step 1: Download the project

In your terminal, go to the folder where you keep your projects, then run:

```bash
git clone <repo-url>
cd <repo-folder>
```

Replace `<repo-url>` with the project's GitHub address (the green **Code** button on the GitHub page), and `<repo-folder>` with the folder name that appears after cloning.

### Step 2: Install the project's tools

```bash
npm install
```

This downloads everything the project needs into a folder called `node_modules`. It can take a minute or two. You only need to do this once, or again if someone adds a new tool.

### Step 3: Start the project

```bash
npm start
```

This starts **two things at the same time**:

1. The **server**, which holds the product data (at `http://localhost:3001`)
2. The **website**, which you look at in your browser (at `http://localhost:5173`)

You should see lines in the terminal like these:

```
Server running on http://localhost:3001
VITE ... ready
Local: http://localhost:5173/
```

Leave this terminal open. If you close it, the project stops.

### Step 4: Open it in your browser

Go to **http://localhost:5173**. You should see the Home page with the store name in the header and the contact details in the footer.

### Step 5: Stop the project

Click in the terminal and press `Ctrl + C` (hold the Control key and press C).

### If the data gets messy

While you try out adding, editing, and deleting, the product data changes. To get the original products back at any time, stop the project and run:

```bash
npm run reset
```

---

## 4. How to use the website

### Look at the products

Click **Products** in the menu. You will see every product as a card with its picture, name, category, material, price, and how many are in stock.

### Search

On the Products page, type in the search box. The list shrinks as you type. You can search by a product's **name**, **category**, or **material**. For example, typing `gold` shows the gold products, and typing `ring` shows the rings. Clear the box to see everything again.

### Add a product

1. Click **Add product** in the menu.
2. Fill in the form: name, description, category, material, price, stock (how many you have), and an image link.
3. Click **Add Product**.
4. The new product is saved on the server, and it appears in the product list.

### Change a product

1. On the Products page, click a product (or its **Manage** link).
2. The details page opens with the form already filled in.
3. Change what you want, for example the price or the stock.
4. Click **Save changes**. You will see "Changes saved." The new details are saved on the server.

If something is not valid (an empty name, a price of 0 or less, or stock that is not a whole number), a red message tells you what to fix and nothing is saved.

### Delete a product

1. Open the product's details page.
2. Click **Delete product**.
3. A box asks you to confirm. Click **OK** to delete, or **Cancel** to keep it.
4. After deleting, you are taken back to the product list.

---

## 5. How the project works

You do not need to understand all of this to run the project, but it helps if you want to read the code.

```
   Your browser                  Express server              db.json
  (React website)  --request-->  (server/index.js)  <--->  (the data file)
  localhost:5173   <--answer---  localhost:3001
```

1. **You click or type** in the website.
2. The website sends a **request** to the server (for example "give me all products" or "add this product").
3. The server **reads or changes the file `server/db.json`**.
4. The server sends an **answer** back, and the website shows it.

Because the server saves changes into `db.json`, your changes **stay** after a refresh or a restart. That is what "simulated backend" means: a real server with a simple file instead of a big database.

### What each part is built with

| Tool | What it does in this project |
|---|---|
| **React** | Builds the pages from small pieces called components (Header, Footer, ProductList...) |
| **Vite** | Runs the website while you work and shows your changes right away |
| **React Router** | Lets you move between pages (Home, Products...) without reloading the whole site |
| **Express** | The server that reads and writes the product data |
| **Vitest and React Testing Library** | Run the automatic tests |

### React ideas used in the code

- **Components**: each page and each part of a page (like Header and Footer) is its own function that returns what to show.
- **State** (`useState`): remembers things that change, such as what you typed in a form.
- **Effects** (`useEffect`): run code when a page opens, such as asking the server for data.
- **Routing** (`useParams`, `useNavigate`): read the product number from the address, and move to another page after saving or deleting.
- **A custom hook** (`useFetch`): our own reusable helper in `src/hooks/useFetch.js` that loads data from the server and tells the page if it is still loading or if something went wrong.

---

## 6. Project folders and files

```
.
├── README.md                  This file
├── package.json               Lists the project's tools and its commands (npm start, npm test...)
├── index.html                 The single web page React fills in
├── vite.config.js             Settings for Vite and for the tests
├── server/
│   ├── index.js               The Express server (all the API routes)
│   ├── db.json                The live data: store info and products
│   └── db.seed.json           A clean copy of the data, used by npm run reset
└── src/
    ├── main.jsx               Starts the website
    ├── App.jsx                Sets up the header, footer, and all page addresses (routes)
    ├── api.js                 Holds the server address in one place
    ├── index.css              Shared colours, fonts, and styles
    ├── setupTests.js          Setup file for the tests
    ├── hooks/
    │   └── useFetch.js        Helper that loads data from the server
    ├── components/
    │   ├── Header.jsx         Top of every page: store name and menu
    │   ├── Footer.jsx         Bottom of every page: contact details
    │   └── ...                Other shared pieces (such as the product card and form)
    ├── pages/
    │   ├── Home.jsx           The Home page
    │   ├── ProductList.jsx    The Products page with search
    │   ├── AddProduct.jsx     The Add product page
    │   ├── ProductDetail.jsx  The page to edit or delete one product
    │   └── NotFound.jsx       The "page not found" page
    └── __tests__/             The automatic tests, one file for each feature
```

If you want to change what the website says or how it looks, the pages are in `src/pages/`, the shared pieces are in `src/components/`, and the colours and fonts are at the top of `src/index.css`.

---

## 7. The product data

Every product in `server/db.json` has these fields:

| Field | What it is | Example |
|---|---|---|
| `id` | A unique number. The server gives it automatically | `1` |
| `name` | The product's name | `"Solitaire Ring"` |
| `description` | A short description | `"Classic round-cut stone with a slim band"` |
| `category` | One of: Rings, Necklaces, Earrings, Bracelets, Watches, Cufflinks | `"Rings"` |
| `material` | What it is made of | `"18k Gold"` |
| `price` | Price in US dollars (a number above 0) | `1250` |
| `stock` | How many are in stock (a whole number, 0 or more) | `6` |
| `image` | A web link to a picture | `"https://placehold.co/600x600?text=Solitaire+Ring"` |

The file starts with **12 products, two in each category**. The pictures are placeholder images. To use real photos, replace the `image` links with real picture links, or save photos in a `public/images/` folder and use paths such as `/images/solitaire-ring.jpg`.

The file also has a `store_info` section with the store's name, tagline, description, phone number, email, address, and opening hours. The header and footer read this, so changing it in `db.json` changes what the website shows.

---

## 8. The server (API)

You can look at the server's answers directly in your browser while the project is running. An **API** is just a list of addresses that give you data.

| What you want | Method | Address |
|---|---|---|
| Everything in the data file | GET | http://localhost:3001 |
| All products | GET | http://localhost:3001/products |
| One product | GET | http://localhost:3001/products/1 |
| The store information | GET | http://localhost:3001/store_info/1 |
| Add a product | POST | `http://localhost:3001/products` |
| Change a product | PATCH | `http://localhost:3001/products/1` |
| Delete a product | DELETE | `http://localhost:3001/products/1` |

Your browser can only visit **GET** addresses by typing them in the address bar. The website sends the other three kinds of request for you when you press the buttons.

The server also **checks the data** it receives. It refuses a product with an empty name, a price that is not above 0, or stock that is not a whole number, and it answers with an error message instead of saving.

---

## 9. Running the tests

Tests are small programs that check the website still works. If someone changes the code and breaks something, a test fails and tells you.

Run every test once:

```bash
npm test -- --run
```

Run just one test file, for example for the product detail page:

```bash
npm test -- --run src/__tests__/ProductDetail.test.jsx
```

You should see passing tests in green, like `6 passed`. The tests do **not** need the server running, because they use a pretend server.

Each feature has its own test file in `src/__tests__/`:

| What is tested | Examples of what is checked |
|---|---|
| Header | The store name shows, and each menu link goes to the right page |
| Footer | The phone and email links work, and the address is shown |
| Home | The store information from the server is shown |
| Product list and search | One card per product, and the search filters the list |
| Add product | Required fields, and a correct request is sent |
| Product details | The form is filled in, saving and deleting send the right requests |

---

## 10. Commands cheat sheet

| Command | What it does |
|---|---|
| `npm install` | Downloads the project's tools (do this once after cloning) |
| `npm start` | Starts the server **and** the website together |
| `npm run server` | Starts only the server (port 3001) |
| `npm run dev` | Starts only the website (port 5173) |
| `npm run reset` | Puts the product data back to the original clean copy |
| `npm test` | Runs the tests (keeps watching for changes) |
| `npm test -- --run` | Runs the tests once and stops |
| `npm run build` | Makes a finished, ready-to-publish copy of the website in a `dist` folder |

---

## 11. How the team worked (Git)

We used **Git** and **GitHub** so that four people could work on the same project without getting in each other's way.

- **`main`** holds the finished, working version of the project.
- **`develop`** was where everyone's finished work was combined and tested before going to `main`.
- **Feature branches** (`feature/...`) were one branch per person, each with their own part of the project.

| Feature branch | What it built |
|---|---|
| `feature/routing-landing` | The Home page and the page links |
| `feature/product-list-search` | The product list, product cards, and search |
| `feature/add-product-form` | The add product form |
| `feature/product-detail-admin` | The product detail page: edit and delete |

The steps for each person were:

1. Create a branch from `develop`.
2. Work in small steps, saving each step with a commit.
3. Push the branch to GitHub and open a **pull request** (a request to combine the branch into `develop`).
4. A teammate reviews it, then it is merged, and the feature branch is deleted.
5. At the end, `develop` was merged into `main`.

If you want to work on this project too, the same steps apply:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-change
# make changes, then:
git add .
git commit -m "feat: describe what you changed"
git push -u origin feature/your-change
```

Then open a pull request on GitHub with **base: `develop`**.

---

## 12. The team

| Name | Part of the project |
|---|---|
| Collins Osano| Project setup, server, header, footer, and the Product detail page |
| Evans Mutai| Product list, search, End-to-end CRUD check and detail-page bug fixes |
| Mirriam Chebet | Add product form,  Responsive, keyboard and form bug fixes|
| Rachel Wanjohi | Home page, Responsive check and list/search bug fixes |


---

## 13. Troubleshooting

Most problems have a short fix. Look for your message in the table.

| What you see | What it means and how to fix it |
|---|---|
| `command not found: npm` or `node` | Node.js is not installed. Install it from [nodejs.org](https://nodejs.org/), then open a new terminal |
| `Missing script: "start"` | You are in the wrong folder. Run `ls` and check you can see `package.json`, or `cd` into the project folder |
| The page is **completely white** | Open the browser's console (press `F12`, then the **Console** tab). The red message tells you which file has the problem. A common cause is a missing file or a hook (`useState`...) written outside a component |
| `Failed to resolve import "./something"` | A file the code imports is missing or in the wrong folder. Check the name and the capital letters carefully |
| The footer says "Store details are unavailable" | The server is not running. Start everything with `npm start` |
| `EADDRINUSE` (port already in use) | Something else is using port 3001 or 5173. Close the other program, or stop the old `npm start` window |
| `Cannot GET /` at port 3001 | You are looking at the server, not the website. Open http://localhost:5173 for the website |
| Products look wrong or the data is broken | Stop the project and run `npm run reset` |
| The server crashes with a JSON error | `server/db.json` has a typing mistake such as a missing comma or bracket. Fix it, or run `npm run reset` |
| Tests fail with `document is not defined` | The test settings are missing. Check `vite.config.js` has the `test` section with `environment: "jsdom"`, and that `src/setupTests.js` exists |
| A change you made does not show up | Save the file, then refresh the page with `Ctrl + Shift + R` |

If you are still stuck, copy the **exact error message** from the terminal or the browser console. The error almost always names the file and line to look at.

---

## 14. Glossary

| Word | Simple meaning |
|---|---|
| **React** | A tool for building websites out of small reusable pieces |
| **Component** | One piece of a website, such as the Header or a product card |
| **State** | Information a component remembers and can change, such as what you typed |
| **Hook** | A special React function (names start with `use`) such as `useState` or `useEffect` |
| **Route** | A web address that shows a certain page, such as `/products` |
| **Server** | A program that waits for requests and sends back answers |
| **API** | The list of addresses a server answers, such as `/products` |
| **JSON** | A simple way to write data as text, which is what `db.json` uses |
| **Request** | A message from the website to the server. GET reads, POST adds, PATCH changes, and DELETE removes |
| **Repository (repo)** | A project folder tracked by Git, stored on GitHub |
| **Branch** | A separate copy of the project to work on without affecting the main one |
| **Commit** | A saved step in the project's history |
| **Pull request** | A request to combine one branch into another, so teammates can review it first |
| **Test** | A small program that checks that part of the website still works |
| **localhost** | Your own computer, used as the address while you develop |

---

## Useful links

- [React documentation](https://react.dev/)
- [React Router documentation](https://reactrouter.com/)
- [Vite documentation](https://vite.dev/)
- [Express documentation](https://expressjs.com/)
- [Vitest documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Git basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)