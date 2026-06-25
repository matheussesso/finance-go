# Quick Guide: Go for PHP Developers

Welcome to Go (Golang)! Since you have vast experience in PHP (probably with MVC frameworks like Laravel or CodeIgniter), some structural concepts change, while architectural concepts (Clean Code, SOLID, MVC) remain the same.

Below is a "translation" map between PHP and Go that we use in building this project:

## 1. The Server
- **In PHP**: PHP runs under a web server (Apache, Nginx). Every time a request arrives, the entire framework (e.g., Laravel) is loaded into memory, processes the request, and dies (completely stateless).
- **In Go**: Go compiles the application into a single native binary file. `main.go` boots the language's own web server (`http.ListenAndServe`) and stays continuously active in memory. Each request runs in a lightweight "Goroutine" (a slimmed-down thread), making the API incredibly fast.

## 2. The Architecture (Clean Architecture)
To keep the pattern of "Skinny Controllers" and "Logic in the Service":
- **Controllers** -> In Go, we call them **Handlers**. Their only responsibility is dealing with the HTTP Request, reading JSON, calling the Service, and writing the response JSON (`w http.ResponseWriter`).
- **Services** -> Exactly the same as in PHP. Contains all the heavy finance logic, cross-validations, and token generation.
- **Repositories** -> Same idea. Isolates the database.
- **Models/Classes** -> In Go there are no traditional Classes. We use **Structs** (`type User struct`).

## 3. Dependency Injection (DI)
- **In PHP/Laravel**: The Magic Container reads the classes and injects them for you (`public function index(UserService $service)`).
- **In Go**: We do **Manual Injection**. In the `main.go` file, we instantiate the pieces "building the lego" from bottom up, passing one to the other (Repo -> Service -> Handler) using "Constructor" functions like `NewUserService(repo)`. This makes everything the project loads and consumes obvious, with no hidden magic.

## 4. Pointers (`&` and `*`)
You will see a lot of the `*` (asterisk) and `&` (ampersand) symbols. In PHP, when we pass an object to a function, it is already natively passed by Reference.
In Go, by default, everything is passed by copy (takes more memory if it's large).
- **Pointer (`*User`)**: It is the exact equivalent of passing an object instance by reference.
- **Address (`&user`)**: We take the struct in memory and pass its real address so other functions can modify the original (heavily used with the database `db.First(&user)`).

## 5. Error Handling (Forget Try/Catch)
- **In PHP**: We use `try { ... } catch (Exception $e) { ... }` blocks.
- **In Go**: Errors are values. A function generally returns 2 things: The result and an error.
```go
// In PHP
try {
    $user = $repo->findByEmail($email);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

// In Go
user, err := repo.FindByEmail(email)
if err != nil {
    // We handle the error exactly where it happened, avoiding the complex flow of try catch
    fmt.Println("Error:", err)
    return
}
```

## 6. The ORM (Eloquent vs GORM)
**GORM** was chosen here because it is very similar to the fluent and active syntax of Eloquent (Laravel) or DB Forge/Model from Codeigniter.
- **Migrations**: GORM does this automatically! When we use `db.AutoMigrate(&domain.User{})`, it detects that the Struct field changed and alters the MySQL table schema on the fly.
- **Queries**: `db.Where("email = ?", email).First(&user)` does exactly what it looks like.

Explore the source code and the comments inside the functions! They detail these choices step by step to facilitate your initial learning.
