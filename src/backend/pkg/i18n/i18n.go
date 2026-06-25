package i18n

import (
	"context"
	"strings"
)

type langMap map[string]string

var dict = map[string]langMap{
	"pt": {
		"invalid_payload": "Carga de dados inválida",
		"email_exists": "E-mail já cadastrado",
		"user_created": "Usuário criado com sucesso",
		"invalid_credentials": "E-mail ou senha inválidos",
		"login_success": "Login efetuado com sucesso",
		"server_error": "Erro interno no servidor",
		"missing_token": "Token de autenticação ausente",
		"invalid_token_format": "Formato de token inválido",
		"invalid_token": "Token inválido ou expirado",
		"read_token_error": "Erro ao ler payload do token",
		"unauthorized": "Não autorizado",
		"invalid_id": "ID inválido",
		"not_found": "Recurso não encontrado",
		// App specific
		"empty_planning_title": "O título do planejamento não pode estar vazio",
		"invalid_month": "Mês inválido",
		"planning_create_error": "Erro ao criar planejamento no banco",
		"planning_not_found": "Planejamento não encontrado",
		"planning_fetch_error": "Erro ao buscar planejamentos",
		"planning_delete_error": "Erro ao excluir planejamento",
		"block_title_type_required": "Título e tipo são obrigatórios",
		"block_create_error": "Erro ao criar bloco de finanças",
		"block_not_found": "Bloco não encontrado ou acesso negado",
		"item_invalid_desc_amount": "Descrição inválida ou valor negativo",
		"item_create_error": "Falha ao adicionar item",
		"process_password_error": "Falha ao processar a senha",
		"user_create_error": "Falha ao criar usuário",
		"token_generate_error": "Erro ao gerar token de autenticação",
		"all_fields_required": "Todos os campos são obrigatórios",
	},
	"en": {
		"invalid_payload": "Invalid payload data",
		"email_exists": "Email is already registered",
		"user_created": "User successfully created",
		"invalid_credentials": "Invalid email or password",
		"login_success": "Login successful",
		"server_error": "Internal server error",
		"missing_token": "Missing authentication token",
		"invalid_token_format": "Invalid token format",
		"invalid_token": "Invalid or expired token",
		"read_token_error": "Error reading token payload",
		"unauthorized": "Unauthorized",
		"invalid_id": "Invalid ID",
		"not_found": "Resource not found",
		// App specific
		"empty_planning_title": "Planning title cannot be empty",
		"invalid_month": "Invalid month",
		"planning_create_error": "Error creating planning in database",
		"planning_not_found": "Planning not found",
		"planning_fetch_error": "Error fetching plannings",
		"planning_delete_error": "Error deleting planning",
		"block_title_type_required": "Title and type are required",
		"block_create_error": "Error creating finance block",
		"block_not_found": "Block not found or access denied",
		"item_invalid_desc_amount": "Invalid description or negative amount",
		"item_create_error": "Failed to add item",
		"process_password_error": "Failed to process password",
		"user_create_error": "Failed to create user",
		"token_generate_error": "Error generating auth token",
		"all_fields_required": "All fields are required",
	},
	"es": {
		"invalid_payload": "Datos de carga inválidos",
		"email_exists": "El correo electrónico ya está registrado",
		"user_created": "Usuario creado exitosamente",
		"invalid_credentials": "Correo electrónico o contraseña inválidos",
		"login_success": "Inicio de sesión exitoso",
		"server_error": "Error interno del servidor",
		"missing_token": "Falta el token de autenticación",
		"invalid_token_format": "Formato de token inválido",
		"invalid_token": "Token inválido o vencido",
		"read_token_error": "Error al leer el payload del token",
		"unauthorized": "No autorizado",
		"invalid_id": "ID inválido",
		"not_found": "Recurso no encontrado",
		// App specific
		"empty_planning_title": "El título del plan no puede estar vacío",
		"invalid_month": "Mes inválido",
		"planning_create_error": "Error al crear el plan en la base de datos",
		"planning_not_found": "Plan no encontrado",
		"planning_fetch_error": "Error al buscar los planes",
		"planning_delete_error": "Error al eliminar el plan",
		"block_title_type_required": "El título y el tipo son obligatorios",
		"block_create_error": "Error al crear el bloque financiero",
		"block_not_found": "Bloque no encontrado o acceso denegado",
		"item_invalid_desc_amount": "Descripción inválida o valor negativo",
		"item_create_error": "Fallo al agregar el ítem",
		"process_password_error": "Fallo al procesar la contraseña",
		"user_create_error": "Fallo al crear el usuario",
		"token_generate_error": "Error al generar el token de autenticación",
		"all_fields_required": "Todos los campos son obligatorios",
	},
}

// GetLangFromContext extracts the preferred language from context
func GetLangFromContext(ctx context.Context) string {
	if lang, ok := ctx.Value("lang").(string); ok {
		return lang
	}
	return "pt" // default fallback
}

// Translate returns the translated string based on key and preferred language
func Translate(lang string, key string) string {
	// Pega os primeiros 2 caracteres (ex: "pt-BR" -> "pt")
	baseLang := "pt"
	if len(lang) >= 2 {
		baseLang = strings.ToLower(lang[:2])
	}
	
	if _, ok := dict[baseLang]; !ok {
		baseLang = "pt"
	}
	
	if val, ok := dict[baseLang][key]; ok {
		return val
	}
	
	if val, ok := dict["pt"][key]; ok {
		return val
	}
	
	return key
}

// T is a shorthand to get the translation directly from context
func T(ctx context.Context, key string) string {
	return Translate(GetLangFromContext(ctx), key)
}
