# 🔥 O QUE ARRUMAR NO FIREBASE - Passo a Passo

## 📧 Problema: Email de recuperação de senha não está sendo enviado

Siga estes passos **EXATOS** no Firebase Console:

---

## ✅ PASSO 1: Acessar o Firebase Console

1. Vá para: https://console.firebase.google.com/
2. Faça login com sua conta Google
3. Selecione o projeto **"Tempos"** (tempos-9f627)

---

## ✅ PASSO 2: Verificar Authentication

1. No menu lateral esquerdo, clique em **Authentication** (ou **Autenticação**)
2. Clique na aba **Templates** (ou **Modelos**)
3. Procure por **"Password reset"** (ou **"Redefinir senha"**)

---

## ✅ PASSO 3: Habilitar e Configurar o Template de Email

1. Clique em **"Password reset"**
2. Verifique se está marcado como **"Enabled"** (Habilitado)
   - Se não estiver, clique no botão para habilitar

3. Clique em **"Edit"** (Editar) para configurar:
   - **Subject** (Assunto): Pode deixar o padrão ou personalizar
   - **Sender name** (Nome do remetente): Coloque **"TEMPOS"**
   - **Sender email** (Email do remetente): Deixe o padrão do Firebase (noreply@tempos-9f627.firebaseapp.com)

4. Clique em **"Save"** (Salvar)

---

## ✅ PASSO 4: Verificar Domínios Autorizados

1. Ainda em **Authentication**, clique em **Settings** (Configurações)
2. Role até a seção **"Authorized domains"** (Domínios autorizados)
3. Certifique-se de que estes domínios estão listados:
   - ✅ `tempos-9f627.firebaseapp.com`
   - ✅ `tempos-9f627.web.app`
   - ✅ `localhost` (para desenvolvimento)

---

## ✅ PASSO 5: Verificar se o Usuário Existe

**IMPORTANTE:** O Firebase só envia email para usuários que **JÁ ESTÃO CADASTRADOS**.

1. Em **Authentication**, clique na aba **Users** (Usuários)
2. Verifique se o email que você está testando aparece na lista
3. Se não aparecer, você precisa:
   - Criar uma conta no app primeiro
   - Ou criar manualmente no Firebase Console

---

## ✅ PASSO 6: Testar

1. Feche completamente o app
2. Abra o app novamente
3. Vá em "Esqueceu a senha?"
4. Digite um email que **JÁ ESTÁ CADASTRADO**
5. Clique em "Enviar"
6. Aguarde alguns minutos
7. Verifique:
   - ✅ Caixa de entrada
   - ✅ Pasta de spam/lixo eletrônico
   - ✅ Aguarde até 5 minutos (pode demorar)

---

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### ❌ "Email não encontrado"
**Causa:** O email não está cadastrado no Firebase  
**Solução:** Crie uma conta no app com esse email primeiro

### ❌ "Muitas tentativas"
**Causa:** Você tentou muitas vezes em pouco tempo  
**Solução:** Aguarde 15-30 minutos antes de tentar novamente

### ❌ Email não chega
**Causa:** Pode estar na pasta de spam ou o template não está habilitado  
**Solução:** 
- Verifique a pasta de spam
- Verifique se o template está "Enabled" no Firebase
- Aguarde até 5 minutos

### ❌ Erro no console do app
**Causa:** Problema de configuração ou conexão  
**Solução:** 
- Verifique os logs no terminal onde o app está rodando
- Verifique sua conexão com a internet
- Verifique se o Firebase está configurado corretamente

---

## 📸 ONDE ENCONTRAR NO FIREBASE CONSOLE

```
Firebase Console
└── Authentication
    ├── Users (verificar se o email existe)
    ├── Settings
    │   └── Authorized domains (verificar domínios)
    └── Templates
        └── Password reset (HABILITAR E CONFIGURAR)
```

---

## ✅ CHECKLIST RÁPIDO

Antes de testar, verifique:

- [ ] Template "Password reset" está **Enabled** (Habilitado)
- [ ] Template "Password reset" foi **Editado** e **Salvo**
- [ ] Domínios autorizados estão configurados
- [ ] O email que você está testando **JÁ ESTÁ CADASTRADO** no Firebase
- [ ] Você aguardou alguns minutos após enviar
- [ ] Você verificou a pasta de spam

---

## 🆘 AINDA NÃO FUNCIONA?

Se após seguir todos os passos ainda não funcionar:

1. **Verifique os logs do app:**
   - Abra o terminal onde o app está rodando
   - Tente recuperar a senha
   - Procure por mensagens de erro no console

2. **Verifique o Firebase Console:**
   - Vá em Authentication > Users
   - Veja se há algum erro ou aviso

3. **Teste com outro email:**
   - Crie uma nova conta com outro email
   - Tente recuperar a senha desse novo email

4. **Verifique a internet:**
   - Certifique-se de que está conectado
   - Tente em outra rede (WiFi diferente ou dados móveis)

---

## 📝 RESUMO

**O mais importante:**
1. ✅ Habilitar o template "Password reset" em Authentication > Templates
2. ✅ O email precisa estar cadastrado antes de tentar recuperar
3. ✅ Verificar a pasta de spam
4. ✅ Aguardar alguns minutos

Se tudo isso estiver ok, o email deve funcionar! 🎉

