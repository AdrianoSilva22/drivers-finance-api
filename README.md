# Drivers Finance API

Bem-vindo à documentação da API Drivers Finance! Esta API é projetada para ajudar motoristas de aplicativos a gerenciar suas finanças de maneira eficaz, oferecendo recursos para ganhos, despesas e resumos financeiros.

## Configuração do Ambiente

### Pré-requisitos

- Node.js e npm instalados
- Banco de dados MySQL

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/AdrianoSilva22/drivers-finance-api.git
   cd drivers-finance-api
Instale as dependências:

bash
Copy code
npm install
Configure seu banco de dados MySQL atualizando as configurações de conexão em config/connection.ts.

Execute a aplicação:

bash
Copy code
npm start
A API estará disponível em http://localhost:3003.

Endpoints da API
1. Criar um Novo Motorista
Endpoint: POST /http://localhost:3003/driver/save)
Descrição: Cadastre um novo motorista.
Corpo da Requisição:
json
Copy code
{
  "cpf": XXXXXXXXXXX,
  "name": "João Silva",
  "email": "joao@example.com",
  "login": "joao123",
  "senha": "senha123",
  "phone_number": "81965658989",
  "active": true,
  "gender": "MASCULINO"
}
Resposta de Sucesso: 200 OK
Resposta de Erro: 404 Error


2. Criar uma Nova Entrada de Ganho
Endpoint: POST /http://localhost:3003/income/save
Descrição: Cria uma nova entrada de ganho/ Receita.
Corpo da Requisição:
json
Copy code
{
    "incomeDescription": "Corrida de aplicativo Uber",
    "incomeType": "variable",
    "incomeAmount": 50.56,
    "driverCpf":XXXXXXXXXXX
}
Resposta de Sucesso: 200 OK
Resposta de Erro: 404 Error

3. Criar uma Nova Entrada de Despesa
Endpoint: POST /http://localhost:3003/expense/save)
Descrição: Cria uma nova entrada de despesa.
Corpo da Requisição:
json
Copy code
{
    "expenseDescription": "Gasolina",
    "expenseType": "fixed",
    "expenseAmount": 205.22,
    "driverCpf": XXXXXXXXXXX
}
Resposta de Sucesso: 200 OK
Resposta de Erro: 404 Error

AH, caso você queira olhar o seu saldo,
seja valor, ou se ta negativado / positivo, é simples ,
 basta chamar a rota get de drive, cuja URL é : 
 /getTotalBalance/:cpf .


Contribuições
Contribuições são bem-vindas! Sinta-se à vontade para abrir problemas (issues) ou enviar pull requests para aprimorar esta API.

