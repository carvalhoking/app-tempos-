# 📧 Configurar Email de Recuperação de Senha no Firebase

## ⚠️ Problema: Email não está sendo enviado

Se o email de recuperação de senha não está sendo enviado, siga estes passos:

---

## 🔧 PASSO 1: Verificar se o Email está habilitado no Firebase

1. Acesse o Firebase Console: https://console.firebase.google.com/
2. Selecione o projeto **tempos-9f627**
3. Vá em **Authentication** (Autenticação)
4. Clique na aba **Templates** (Modelos)
5. Verifique se o template **"Password reset"** está ativo

---

## 📝 PASSO 2: Configurar o Template de Email

1. Na aba **Templates**, clique em **Password reset**
2. Verifique se está **habilitado** (Enabled)
3. Configure o email de remetente:
   - Clique em **Edit** (Editar)
   - Em **Sender name**, coloque: **TEMPOS**
   - Em **Sender email**, você pode usar o email padrão do Firebase ou configurar um domínio personalizado

---

## 🌐 PASSO 3: Configurar URL de Redirecionamento (Opcional mas Recomendado)

1. Ainda em **Authentication** > **Settings** (Configurações)
2. Role até a seção **Authorized domains** (Domínios autorizados)
3. Certifique-se de que seu domínio está listado:
   - `tempos-9f627.firebaseapp.com` (já deve estar)
   - Se tiver um domínio personalizado, adicione-o aqui

---

## 🔍 PASSO 4: Verificar se o Usuário Existe

O Firebase só envia email para usuários que **já estão cadastrados**. 

**Teste:**
1. Certifique-se de que o email que você está testando já foi cadastrado no app
2. Se não foi cadastrado, crie uma conta primeiro com esse email

---

## 🐛 PASSO 5: Verificar Logs de Erro

Se ainda não funcionar, verifique o console do app:

1. Abra o app
2. Tente recuperar a senha
3. Veja o console (no terminal onde está rodando o app)
4. Procure por mensagens como:
   - `❌ Erro ao enviar email de recuperação:`
   - `Código do erro:`
   - `Mensagem do erro:`

---

## ✅ PASSO 6: Testar Novamente

Após configurar:

1. Feche e abra o app novamente
2. Vá em "Esqueceu a senha?"
3. Digite um email **que já está cadastrado**
4. Clique em "Enviar"
5. Verifique:
   - **Caixa de entrada** do email
   - **Pasta de spam/lixo eletrônico**
   - Aguarde alguns minutos (pode demorar até 5 minutos)

---

## 🔐 Problemas Comuns

### Erro: "Email não encontrado"
- **Solução**: O email precisa estar cadastrado primeiro. Crie uma conta com esse email.

### Erro: "Muitas tentativas"
- **Solução**: Aguarde alguns minutos antes de tentar novamente.

### Email não chega
- **Solução**: 
  - Verifique a pasta de spam
  - Aguarde até 5 minutos
  - Verifique se o email está correto
  - Certifique-se de que o template está habilitado no Firebase

### Erro de configuração
- **Solução**: Verifique se o Firebase está configurado corretamente e se o projeto está ativo.

---

## 📱 Nota Importante

O Firebase usa o serviço de email padrão. Se você quiser usar um email personalizado, precisará:

1. Configurar um domínio personalizado
2. Verificar o domínio no Firebase
3. Configurar SPF/DKIM no DNS

Para a maioria dos casos, o email padrão do Firebase funciona perfeitamente.

---

## 🆘 Ainda não funciona?

Se após seguir todos os passos o email ainda não for enviado:

1. Verifique os logs do console do app
2. Verifique se há erros no Firebase Console > Authentication > Users
3. Tente criar um novo usuário e testar
4. Verifique sua conexão com a internet

