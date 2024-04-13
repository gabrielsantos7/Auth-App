# 🚀 API de Autenticação

<p align="center">
  <span>
    <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
    <img src="https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg" width="200" alt="Mongo Logo" />
  </span>
</p>

Bem-vindo à minha API de Autenticação! Ela oferece recursos para registro, login, gerenciamento de contas de usuários e upload de fotos de perfil.

## ℹ️ Sobre

Esta API foi desenvolvida com o NestJS, um framework para Node.js altamente modular e escalável. Ela usa o MongoDB como banco de dados para armazenar informações de usuário e implementa a técnica JWT (JSON Web Tokens) para autenticação e autorização.

## 🚪 Acesso à API

📢 Quer usar minha API em produção? Ficarei feliz em ajudar você a integrá-la à sua aplicação! Entre em contato comigo para discutir suas necessidades e como podemos trabalhar juntos. Estou ansioso para colaborar com você!

## 🛠️ Configuração Local

1. Clone o repositório:

   ```bash
   git clone https://github.com/gabrielsantos7/Auth-App.git
   ```
2. Instale as dependências:

   ```bash
   cd Auth-App
   npm install
   ```
3. Configure as variáveis de ambiente:

   Crie um arquivo _.env_ baseado no _.env.example_ e defina os valores apropriados para `DB_URL`, `JWT_SECRET` e `JWT_EXPIRATION`.
4. Inicie o servidor localmente:

   ```bash
   npm run start:dev
   ```

## 📦 Rotas

Segue abaixo uma tabela com as rotas disponíveis nesta API:

### 🛡️ Auth

O módulo **_Auth_** é responsável por lidar com a autenticação e autorização dos usuários na aplicação. Ele fornece rotas para registro de novos usuários e autenticação de usuários existentes.

| Método | Rota         | Descrição                               |
| ------- | ------------ | ----------------------------------------- |
| POST    | /auth/signup | 📝 Registrar um novo usuário             |
| POST    | /auth/login  | 🔑 Autenticar o usuário e gerar um token |

### 👥 Users

O módulo **_Users_** gerencia as operações relacionadas aos usuários da aplicação. Ele oferece funcionalidades para atualizar dados da conta do usuário, como nome, email e senha, bem como para remover a conta do usuário, se necessário.

| Método | Rota            | Descrição                                         |
| ------- | --------------- | --------------------------------------------------- |
| GET     | /users/profile  | 📄 Obter dados da conta do usuário autenticado     |
| PATCH   | /users/account  | 🔄 Atualizar dados da conta do usuário autenticado |
| PATCH   | /users/password | 🔐 Atualizar senha da conta do usuário autenticado |
| DELETE  | /users/delete   | ❌ Exclui a conta do usuário autenticado           |

### 🖼️ Uploads

O módulo **_Uploads_** trata do armazenamento e gerenciamento de uploads de arquivos, como fotos de perfil dos usuários. Ele fornece uma rota para que os usuários possam enviar suas fotos de perfil para a aplicação.

| Método | Rota           | Descrição                                           |
| ------- | -------------- | ----------------------------------------------------- |
| POST    | /uploads/photo | 🖼️ Upload de foto de perfil do usuário autenticado |

## 📝 Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Abra um pull request ou envie uma issue.

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para obter detalhes.
