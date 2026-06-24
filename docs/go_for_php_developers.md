# Guia Rápido: Go para Desenvolvedores PHP

Seja bem-vindo ao Go (Golang)! Como você tem vasta experiência em PHP (provavelmente com frameworks MVC como Laravel ou CodeIgniter), alguns conceitos estruturais mudam, enquanto os conceitos arquiteturais (Clean Code, SOLID, MVC) permanecem os mesmos.

Abaixo, um mapa de "tradução" entre o PHP e o Go que usamos na construção deste projeto:

## 1. O Servidor
- **No PHP**: O PHP roda sob um servidor web (Apache, Nginx). Cada vez que uma requisição chega, todo o framework (ex: Laravel) é carregado na memória, processa a requisição e morre (stateless completo).
- **No Go**: O Go compila a aplicação para um único arquivo binário nativo. O `main.go` sobe o próprio servidor web da linguagem (`http.ListenAndServe`) e fica ativo continuamente na memória. Cada requisição roda em uma leve "Goroutine" (uma thread emagrecedora), deixando a API incrivelmente rápida.

## 2. A Arquitetura (Clean Architecture)
Para manter o padrão de "Controllers Finos" e "Lógica no Service":
- **Controllers** -> Em Go, chamamos de **Handlers**. A única responsabilidade deles é lidar com o Request HTTP, ler JSON, chamar o Service, e escrever o JSON de resposta (`w http.ResponseWriter`).
- **Services** -> Igualzinho no PHP. Contém toda a lógica pesada de finanças, validações cruzadas e geração de tokens.
- **Repositories** -> Mesma ideia. Isola o banco de dados.
- **Models/Classes** -> Em Go não existem Classes tradicionais. Usamos **Structs** (`type User struct`).

## 3. Injeção de Dependências (DI)
- **No PHP/Laravel**: O Container Mágico lê as classes e injeta pra você (`public function index(UserService $service)`).
- **No Go**: Fazemos **Injeção Manual**. No arquivo `main.go`, nós instanciamos as peças "montando o lego" de baixo pra cima, repassando um para o outro (Repo -> Service -> Handler) usando funções "Construtoras" como `NewUserService(repo)`. Isso deixa evidente tudo que o projeto carrega e consome, sem magias escondidas.

## 4. Ponteiros (`&` e `*`)
Você verá muito o símbolo `*` (asterisco) e `&` (e comercial). No PHP, quando passamos um objeto para uma função, ele já é passado por Referência nativamente.
No Go, por padrão, tudo é passado por cópia (gasta mais memória se for algo grande).
- **Ponteiro (`*User`)**: É o equivalente exato a passar uma instância de um objeto por referência. 
- **Endereço (`&user`)**: Pegamos a struct na memória e passamos seu endereço real para que outras funções modifiquem ela original (muito usado com banco de dados `db.First(&user)`).

## 5. Tratamento de Erros (Esqueça Try/Catch)
- **No PHP**: Usamos blocos `try { ... } catch (Exception $e) { ... }`.
- **No Go**: Erros são valores. Uma função geralmente retorna 2 coisas: O resultado e um erro.
```go
// No PHP
try {
    $user = $repo->findByEmail($email);
} catch (Exception $e) {
    echo "Erro: " . $e->getMessage();
}

// No Go
user, err := repo.FindByEmail(email)
if err != nil {
    // Tratamos o erro exatamente onde ele aconteceu, evitando fluxo complexo do try catch
    fmt.Println("Erro:", err)
    return
}
```

## 6. O ORM (Eloquent vs GORM)
O **GORM** foi escolhido aqui porque é muito parecido com a sintaxe fluente e ativa do Eloquent (Laravel) ou DB Forge/Model do Codeigniter.
- **Migrations**: O GORM faz isso automaticamente! Quando usamos `db.AutoMigrate(&domain.User{})`, ele detecta que o campo de Struct mudou e altera o schema da tabela MySQL na hora.
- **Consultas**: `db.Where("email = ?", email).First(&user)` faz exatamente o que parece.

Explore o código fonte e os comentários no interior das funções! Eles detalham essas escolhas passo a passo para facilitar seu aprendizado inicial.
