# Sistema de Controle de Estoque - API RESTful
# Estoque API

## Descrição
Este projeto é uma API RESTful para o gerenciamento de um sistema de controle de estoque. Ele permite a criação, leitura, atualização e exclusão (CRUD) de **usuários**, **estoques** e **itens**, com autenticação via JWT e controle de permissões. Apenas usuários administradores podem criar estoques e realizar ações específicas, enquanto usuários comuns podem gerenciar os itens do estoque ao qual estão associados.

## Funcionalidades
- **Autenticação JWT**: Login e proteção de rotas usando tokens JWT.
- **CRUD de Usuários**:
    - Registro de novos usuários.
    - Login de usuários.
    - Exclusão de usuários (somente administradores).
- **CRUD de Estoques**:
    - Criação, visualização, atualização e exclusão de estoques (somente administradores).
    - Visualização de estoque por ID.
- **CRUD de Itens**:
    - Criação, visualização, atualização e exclusão de itens (apenas nos estoques associados ao usuário logado).
    - Visualização de todos os itens (somente administradores).
    - Visualização de itens por estoque.

## Tecnologias Utilizadas
- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework para construção de aplicações web e APIs.
- **MySQL**: Banco de dados relacional para armazenamento de informações.
- **JWT (JSON Web Token)**: Autenticação e controle de sessão.
- **dotenv**: Carregamento de variáveis de ambiente.
- **Bcrypt**: Hashing de senhas para armazenamento seguro.

## Requisitos
- Node.js (>= 14.x)
- MySQL (>= 5.x)
- npm (>= 6.x)

## Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
Crie um banco de dados MySQL com o nome `estoque_db`. Use o seguinte script para criar as tabelas:
```sql
CREATE DATABASE estoque_db;

USE estoque_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user'
);

CREATE TABLE estoques (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2),
    estoque_id INT,
    FOREIGN KEY (estoque_id) REFERENCES estoques(id) ON DELETE CASCADE
);
```

### 4. Configuração das variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```bash
PORT=3000
JWT_SECRET=sua_chave_secreta_jwt
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=estoque_db
```

### 5. Inicialize o servidor
```bash
npm start
```
A aplicação estará rodando em [http://localhost:3000](http://localhost:3000).

## Endpoints

### Autenticação
- `POST /api/users/register`: Registra um novo usuário (Acesso: Público).
- `POST /api/users/login`: Faz login e retorna um token JWT (Acesso: Público).

### Usuários
- `DELETE /api/users/:id`: Deleta um usuário (Acesso: Admin).

### Estoques
- `GET /api/estoques/:id`: Retorna um estoque por ID (Acesso: Protegido).
- `POST /api/estoques`: Cria um novo estoque (Acesso: Admin).
- `GET /api/estoques`: Retorna todos os estoques (Acesso: Admin).
- `PUT /api/estoques/:id`: Atualiza um estoque (Acesso: Admin).
- `DELETE /api/estoques/:id`: Deleta um estoque (Acesso: Admin).

### Itens
- `POST /api/itens`: Cria um novo item (Acesso: Protegido).
- `GET /api/itens`: Retorna todos os itens (Acesso: Admin).
- `GET /api/itens/:id`: Retorna um item por ID (Acesso: Protegido).
- `GET /api/itens/estoque/:estoque_id`: Retorna itens de um estoque específico (Acesso: Protegido).
- `PUT /api/itens/:id`: Atualiza um item (Acesso: Protegido).
- `DELETE /api/itens/:id`: Deleta um item (Acesso: Protegido).

## Como Contribuir
1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`).
4. Faça um push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Estrutura
- **Descrição**: Uma visão geral do que a aplicação faz.
- **Funcionalidades**: Lista das principais funcionalidades implementadas.
- **Tecnologias Utilizadas**: Lista das principais tecnologias e bibliotecas usadas.
- **Requisitos**: Informa as versões mínimas de Node.js, MySQL e npm necessárias.
- **Instalação**: Instruções detalhadas para clonar o repositório, instalar dependências, configurar o banco de dados e rodar a aplicação.
- **Endpoints**: Documentação de todas as rotas disponíveis.
- **Como Contribuir**: Instruções de como os desenvolvedores podem contribuir para o projeto.
- **Licença**: A licença escolhida para o projeto.