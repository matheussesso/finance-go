# Build stage
FROM golang:alpine AS builder
WORKDIR /app

# Instala dependências antes de copiar o código inteiro (cache layer)
COPY go.mod go.sum ./
RUN go mod download

# Copia todo o código do backend e compila o binário otimizado para produção
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o api ./cmd/api/main.go

# Production stage (Imagem minúscula, sem código fonte, apenas o binário)
FROM alpine:latest
WORKDIR /root/

# Adiciona certificados necessários caso a API precise fazer chamadas HTTPS externas
RUN apk --no-cache add ca-certificates tzdata

COPY --from=builder /app/api .

EXPOSE 8080
CMD ["./api"]
