# MagicMirror² - Configuração Local

## Instalação Concluída ✅

O MagicMirror² foi instalado com sucesso na pasta `C:\Users\Andre\Desktop\magic`.

## Como Usar

### Método 1: Script de Inicialização (Modo Normal)
1. Dê duplo clique no arquivo `start-magicmirror.bat`
2. O MagicMirror² será iniciado automaticamente

### Método 2: Script de Desenvolvimento (Recomendado para Programação)
1. Dê duplo clique no arquivo `start-dev.bat`
2. O MagicMirror² será iniciado em modo de desenvolvimento (sem kiosk)

### Método 3: Linha de Comando
1. Abra o PowerShell ou Prompt de Comando
2. Navegue para a pasta: `cd "C:\Users\Andre\Desktop\magic"`
3. Para modo normal: `npm start`
4. Para modo desenvolvimento: `npm run start:windows:dev`

## Acesso ao MagicMirror

Após iniciar, você pode acessar o MagicMirror através do navegador:
- **URL Local**: http://localhost:8080
- **URL da Rede**: http://[SEU-IP]:8080

## Configuração

O arquivo de configuração está em: `config/config.js`

### Módulos Padrão Incluídos:
- **Clock**: Relógio digital
- **Calendar**: Calendário
- **Current Weather**: Previsão do tempo atual
- **Weather Forecast**: Previsão do tempo para os próximos dias
- **News Feed**: Feed de notícias
- **Compliments**: Elogios personalizados
- **Hello World**: Módulo de exemplo

## Personalização

### Adicionar Módulos:
1. Navegue para a pasta `modules/`
2. Clone ou baixe módulos de terceiros
3. Configure-os no arquivo `config/config.js`

### Modificar Configuração:
1. Edite o arquivo `config/config.js`
2. Reinicie o MagicMirror para aplicar as mudanças

## Modo de Desenvolvimento

Para programar e desenvolver módulos, use o **modo de desenvolvimento**:

### Vantagens do Modo Dev:
- ✅ **Sem modo kiosk** - você pode acessar outras janelas
- ✅ **Console de desenvolvedor** disponível (F12)
- ✅ **Recarregamento automático** ao editar arquivos
- ✅ **Logs detalhados** no terminal
- ✅ **Debugging** mais fácil

### Como usar:
```powershell
# Iniciar em modo desenvolvimento
npm run start:windows:dev

# Ou usar o script
start-dev.bat
```

## Comandos Úteis

- **Iniciar modo normal**: `npm start`
- **Iniciar modo desenvolvimento**: `npm run start:windows:dev`
- **Iniciar apenas servidor web**: `npm run server`
- **Parar**: `Ctrl + C` no terminal
- **Reiniciar**: Pare e execute o comando novamente

## Suporte

- **Documentação Oficial**: https://docs.magicmirror.builders
- **Fórum**: https://forum.magicmirror.builders
- **GitHub**: https://github.com/MagicMirrorOrg/MagicMirror

## Próximos Passos

1. Personalize a configuração no arquivo `config/config.js`
2. Adicione módulos de terceiros conforme necessário
3. Configure o auto-inicialização se desejar

---

**MagicMirror²** - Transforme seu espelho em um assistente pessoal inteligente! 🪞✨
