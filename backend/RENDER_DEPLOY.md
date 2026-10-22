# Deploy do backend no Render

## O que provisionar

1. Crie um PostgreSQL no Render, de preferência na mesma região do backend.
2. No Render, crie um Blueprint a partir deste repositório usando o `render.yaml` da raiz.
3. Quando solicitado, configure `DATABASE_URL` com a **Internal Database URL** do PostgreSQL.
4. Configure `ALLOWED_ORIGINS` com a origem exata do frontend, por exemplo `https://seu-site.vercel.app`. Para mais de uma origem, separe com vírgulas e sem barra final.
5. Faça o deploy e aguarde a verificação em `/api/v1/status`.

O Blueprint gera `JWT_SECRET`. O login é opcional para esta demonstração e não é necessário para acionar os controles. O serviço web está no plano gratuito no arquivo de configuração; serviços gratuitos podem dormir após inatividade. Para operação IoT contínua, confira os limites e planos atuais do Render.

## Login opcional

O endpoint `/api/v1/auth/register` permite criar uma conta para a tela de login. As rotas de sensores e controles ficam abertas para facilitar a apresentação; não é necessário criar conta para usar o dashboard ou o ESP32.

## Conectar o frontend

No provedor do frontend, configure a variável de build:

```text
VITE_BACKEND_URL=https://NOME-DO-SERVICO.onrender.com
```

Não inclua `/api/v1` nem uma barra final. Depois, faça novo build/deploy do frontend. Garanta que a mesma origem do frontend esteja em `ALLOWED_ORIGINS` no serviço do Render.

## Preparar o ESP32

1. Copie `firmware/ecoincubadora/secrets.h.example` para `firmware/ecoincubadora/secrets.h` e preencha localmente o Wi-Fi 2,4 GHz.
2. O sketch usa o domínio HTTPS do backend Render.
3. Para esta demonstração, o ESP32 aceita o certificado HTTPS sem validar a CA. Isso facilita a apresentação, mas deixa a conexão vulnerável a interceptação. Não use essa configuração com uma incubadora em operação real.
4. Grave o sketch e confirme no Monitor Serial HTTP `200` nas leituras e na consulta da fila.

O sketch mantém o endpoint local durante o desenvolvimento. O arquivo `secrets.h` é ignorado pelo Git. As leituras e usuários do SQLite local não são copiados automaticamente para o PostgreSQL do Render; o banco de produção começa vazio.

As rotas de sensor e atuadores estão públicas para esta apresentação. Qualquer pessoa com a URL pode enviar comandos aos relés; não use esta configuração para operação real.

## Migrações

O serviço executa `prisma migrate deploy` com o schema PostgreSQL antes de iniciar. As migrações SQLite de desenvolvimento permanecem separadas em `prisma/migrations`; o Render usa `prisma-render/migrations`.
## Formulario Fale Conosco

O formulario envia nome, e-mail e mensagem para `devmindsti@gmail.com`. Para habilitar o envio, crie uma chave de API no Resend, verifique um dominio remetente e configure estas variaveis do backend no Render:

- `RESEND_API_KEY`: a chave secreta da API Resend.
- `CONTACT_FROM_EMAIL`: remetente verificado, como `EcoIncubadora <contato@seudominio.com>`.

Mantenha a chave no backend, fora do repositorio. O e-mail informado sera usado como `Reply-To`. Sem essas variaveis, o formulario informa que o envio esta temporariamente indisponivel.


## Status do ESP32

O firmware envia um heartbeat autenticado a cada 15 segundos usando o MAC Wi-Fi como ID. Configure ESP32_DEVICE_TOKEN no backend do Render e informe o mesmo valor em DEVICE_API_TOKEN no arquivo local firmware/ecoincubadora/secrets.h, copiado do exemplo. Gere um segredo aleatorio com pelo menos 32 caracteres e mantenha secrets.h fora do Git. Apos gravar o firmware e aplicar a migracao Prisma, o painel considera o dispositivo offline apos 45 segundos sem heartbeat.