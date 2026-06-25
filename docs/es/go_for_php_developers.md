# Guía Rápida: Go para Desarrolladores PHP

¡Bienvenido a Go (Golang)! Como tienes vasta experiencia en PHP (probablemente con frameworks MVC como Laravel o CodeIgniter), algunos conceptos estructurales cambian, mientras que los conceptos arquitectónicos (Clean Code, SOLID, MVC) siguen siendo los mismos.

A continuación, un mapa de "traducción" entre PHP y Go que usamos en la construcción de este proyecto:

## 1. El Servidor
- **En PHP**: PHP corre bajo un servidor web (Apache, Nginx). Cada vez que llega una solicitud, todo el framework (ej: Laravel) se carga en memoria, procesa la solicitud y muere (completamente stateless).
- **En Go**: Go compila la aplicación en un único archivo binario nativo. `main.go` levanta el propio servidor web del lenguaje (`http.ListenAndServe`) y se mantiene continuamente activo en memoria. Cada solicitud corre en una "Goroutine" liviana (un hilo reducido), haciendo la API increíblemente rápida.

## 2. La Arquitectura (Clean Architecture)
Para mantener el patrón de "Controladores Delgados" y "Lógica en el Servicio":
- **Controladores** -> En Go, los llamamos **Handlers**. Su única responsabilidad es manejar la Solicitud HTTP, leer JSON, llamar al Servicio y escribir el JSON de respuesta (`w http.ResponseWriter`).
- **Servicios** -> Igual que en PHP. Contiene toda la lógica pesada de finanzas, validaciones cruzadas y generación de tokens.
- **Repositorios** -> La misma idea. Aísla la base de datos.
- **Modelos/Clases** -> En Go no existen las Clases tradicionales. Usamos **Structs** (`type User struct`).

## 3. Inyección de Dependencias (DI)
- **En PHP/Laravel**: El Contenedor Mágico lee las clases y las inyecta por ti (`public function index(UserService $service)`).
- **En Go**: Hacemos **Inyección Manual**. En el archivo `main.go`, instanciamos las piezas "armando el lego" de abajo hacia arriba, pasando una a la otra (Repo -> Servicio -> Handler) usando funciones "Constructoras" como `NewUserService(repo)`. Esto deja evidente todo lo que el proyecto carga y consume, sin magias ocultas.

## 4. Punteros (`&` y `*`)
Verás mucho el símbolo `*` (asterisco) y `&` (ampersand). En PHP, cuando pasamos un objeto a una función, ya se pasa por Referencia nativamente.
En Go, por defecto, todo se pasa por copia (gasta más memoria si es algo grande).
- **Puntero (`*User`)**: Es el equivalente exacto a pasar una instancia de un objeto por referencia.
- **Dirección (`&user`)**: Tomamos el struct en memoria y pasamos su dirección real para que otras funciones la modifiquen original (muy usado con la base de datos `db.First(&user)`).

## 5. Manejo de Errores (Olvida Try/Catch)
- **En PHP**: Usamos bloques `try { ... } catch (Exception $e) { ... }`.
- **En Go**: Los errores son valores. Una función generalmente devuelve 2 cosas: El resultado y un error.
```go
// En PHP
try {
    $user = $repo->findByEmail($email);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

// En Go
user, err := repo.FindByEmail(email)
if err != nil {
    // Manejamos el error exactamente donde ocurrió, evitando el flujo complejo del try catch
    fmt.Println("Error:", err)
    return
}
```

## 6. El ORM (Eloquent vs GORM)
**GORM** fue elegido aquí porque es muy similar a la sintaxis fluida y activa de Eloquent (Laravel) o DB Forge/Model de Codeigniter.
- **Migraciones**: ¡GORM hace esto automáticamente! Cuando usamos `db.AutoMigrate(&domain.User{})`, detecta que el campo del Struct cambió y altera el esquema de la tabla MySQL sobre la marcha.
- **Consultas**: `db.Where("email = ?", email).First(&user)` hace exactamente lo que parece.

¡Explora el código fuente y los comentarios dentro de las funciones! Detallan estas elecciones paso a paso para facilitar tu aprendizaje inicial.
