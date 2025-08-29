# Guia Completo de Desenvolvimento de Módulos MagicMirror²

## Índice
1. [Introdução](#introdução)
2. [Estrutura de um Módulo](#estrutura-de-um-módulo)
3. [Arquivo Principal do Módulo](#arquivo-principal-do-módulo)
4. [Node Helper](#node-helper)
5. [Métodos Auxiliares do MagicMirror](#métodos-auxiliares-do-magicmirror)
6. [Sistema de Logging](#sistema-de-logging)
7. [Sistema de Notificações](#sistema-de-notificações)
8. [Boas Práticas de Documentação](#boas-práticas-de-documentação)
9. [Exemplos Práticos](#exemplos-práticos)

---

## Introdução

O MagicMirror² é uma plataforma modular de espelho inteligente de código aberto. Este guia fornece todas as informações necessárias para desenvolver módulos customizados.

### Conselhos Gerais

- **Inclua sempre no README:**
  - Screenshot de alta qualidade do módulo funcionando
  - Descrição clara e concisa do que faz
  - APIs externas que utiliza (com links)
  - Se requer chaves de API e limitações

### Nomenclatura de Módulos

Recomenda-se o padrão: `MMM-MyNewCoolModule`

### Quick Start

Use o template oficial: [MMM-Template](https://github.com/Dennis-Rosenbaum/MMM-Template)

---

## Estrutura de um Módulo

### Localização
- Todos os módulos são carregados na pasta `modules/`
- Módulos padrão: `modules/default/`
- Seu módulo deve estar numa subpasta de `modules/`

### Estrutura de Ficheiros

```
modulename/
├── modulename.js          # Script principal do módulo
├── node_helper.js         # Helper Node.js (opcional)
├── public/                # Ficheiros acessíveis via browser
├── css/
│   └── modulename.css     # Estilos do módulo
├── translations/          # Ficheiros de tradução
│   ├── en.json
│   └── pt.json
└── README.md
```

---

## Arquivo Principal do Módulo

### Estrutura Básica

```javascript
Module.register("modulename", {
    // Configuração padrão
    defaults: {
        text: "Hello World!"
    },

    // Método obrigatório - gera o DOM
    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = this.config.text;
        return wrapper;
    }
});
```

### Propriedades da Instância do Módulo

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `this.name` | String | Nome do módulo |
| `this.identifier` | String | Identificador único da instância |
| `this.hidden` | Boolean | Se o módulo está oculto |
| `this.config` | Object | Configuração do módulo |
| `this.data` | Object | Metadados adicionais |

### Propriedades do Objeto `this.data`

- `data.classes` - Classes adicionadas ao wrapper DOM
- `data.file` - Nome do ficheiro principal
- `data.path` - Caminho da pasta do módulo
- `data.header` - Cabeçalho do módulo
- `data.position` - Posição onde será mostrado

### Métodos Subclassificáveis

#### `init()`
Chamado quando o módulo é instanciado.

#### `loaded(callback)`
Chamado quando o módulo é carregado. **IMPORTANTE:** Deve chamar `callback()` quando terminar.

```javascript
loaded: function(callback) {
    this.finishLoading();
    Log.log(this.name + " is loaded!");
    callback();
}
```

#### `start()`
Chamado quando todos os módulos estão carregados.

```javascript
start: function() {
    this.mySpecialProperty = "So much wow!";
    Log.log(this.name + " is started!");
}
```

#### `getScripts()`
Retorna array de scripts adicionais a carregar.

```javascript
getScripts: function() {
    return [
        "script.js",                    // Tenta carregar de js/vendor.js
        "moment.js",                    // Definido em js/vendor.js
        this.file("another_file.js"),   // Carrega da pasta do módulo
        "https://code.jquery.com/jquery-2.2.3.min.js"  // URL externa
    ];
}
```

#### `getStyles()`
Retorna array de folhas de estilo a carregar.

```javascript
getStyles: function() {
    return [
        "script.css",
        "font-awesome.css",
        this.file("another_file.css"),
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
    ];
}
```

#### `getTranslations()`
Retorna dicionário de ficheiros de tradução.

```javascript
getTranslations: function() {
    return {
        en: "translations/en.json",
        de: "translations/de.json"
    };
}
```

#### `getDom()`
**OBRIGATÓRIO** - Retorna objeto DOM para renderizar.

```javascript
getDom: function() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = "Hello world!";
    return wrapper;
}
```

#### `getHeader()`
Retorna string do cabeçalho do módulo.

```javascript
getHeader: function() {
    return this.data.header + " Foo Bar";
}
```

#### `notificationReceived(notification, payload, sender)`
Recebe notificações de outros módulos.

```javascript
notificationReceived: function(notification, payload, sender) {
    if (sender) {
        Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
    } else {
        Log.log(this.name + " received a system notification: " + notification);
    }
}
```

#### `socketNotificationReceived(notification, payload)`
Recebe notificações do node helper.

```javascript
socketNotificationReceived: function(notification, payload) {
    Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
}
```

#### `suspend()` e `resume()`
Chamados quando o módulo é ocultado/mostrado.

### Métodos da Instância do Módulo

#### `this.file(filename)`
Retorna caminho completo para ficheiro no módulo.

#### `this.updateDom(speed|options)`
Atualiza o DOM do módulo.

```javascript
// Atualização simples
this.updateDom();

// Com animação
this.updateDom(1000);

// Com opções avançadas
this.updateDom({
    speed: 1000,
    animate: {
        in: "backInDown",
        out: "backOutUp"
    }
});
```

#### `this.sendNotification(notification, payload)`
Envia notificação para todos os módulos.

#### `this.sendSocketNotification(notification, payload)`
Envia notificação para o node helper.

#### `this.hide(speed, callback, options)` e `this.show(speed, callback, options)`
Controla visibilidade do módulo.

```javascript
// Ocultar com lock string
this.hide(0, null, { lockString: this.identifier });

// Mostrar com força
this.show(0, null, { force: true });
```

#### `this.translate(identifier, variables)`
Sistema de tradução.

```javascript
// Tradução simples
this.translate("INFO");

// Tradução com variáveis
this.translate("RUNNING", { timeUntilEnd: timeUntilEnd });
```

### Sistema de Locking de Visibilidade

```javascript
// Módulo B pede ao Módulo A para se ocultar
moduleA.hide(0, null, { lockString: "module_b_identifier" });

// Módulo C também pede para ocultar
moduleA.hide(0, null, { lockString: "module_c_identifier" });

// Módulo B pede para mostrar (remove apenas o seu lock)
moduleA.show(0, null, { lockString: "module_b_identifier" });

// Módulo C pede para mostrar (remove o último lock, módulo fica visível)
moduleA.show(0, null, { lockString: "module_c_identifier" });
```

---

## Node Helper

### Estrutura Básica

```javascript
const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
    // Métodos do helper
});
```

### Propriedades Disponíveis

- `this.name` - Nome do módulo
- `this.path` - Caminho do módulo
- `this.expressApp` - Instância Express (para rotas)
- `this.io` - Instância Socket.IO

### Métodos Subclassificáveis

#### `init()`
Chamado quando o helper é instanciado.

#### `start()`
Chamado quando todos os helpers estão carregados.

```javascript
start: function() {
    this.mySpecialProperty = "So much wow!";
    Log.log(this.name + " is started!");
}
```

#### `stop()`
Chamado quando o servidor é encerrado.

```javascript
stop: function() {
    Log.log("Shutting down MyModule");
    this.connection.close();
}
```

#### `socketNotificationReceived(notification, payload)`
Recebe notificações do módulo.

```javascript
socketNotificationReceived: function(notification, payload) {
    Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
}
```

### Métodos da Instância

#### `this.sendSocketNotification(notification, payload)`
Envia notificação para o módulo.

### Rotas Express

```javascript
start: function() {
    this.expressApp.get("/foobar", function(req, res) {
        res.send("GET request to /foobar");
    });
}
```

### Módulos Node Nativos

Para usar módulos nativos, instale `@electron/rebuild`:

```bash
npm install --save-dev @electron/rebuild
```

Adicione ao `package.json`:

```json
{
    "scripts": {
        "postinstall": "./node_modules/.bin/electron-rebuild"
    }
}
```

---

## Métodos Auxiliares do MagicMirror

### `MM.getModules()`

Retorna array de todas as instâncias de módulos carregadas.

```javascript
let modules = MM.getModules();
```

### Filtros Disponíveis

#### `.withClass(classnames)`
Filtra por classes CSS.

```javascript
let modules = MM.getModules().withClass("classname");
let modules = MM.getModules().withClass("classname1 classname2");
let modules = MM.getModules().withClass(["classname1", "classname2"]);
```

#### `.exceptWithClass(classnames)`
Remove módulos com certas classes.

```javascript
let modules = MM.getModules().exceptWithClass("classname");
```

#### `.exceptModule(module)`
Remove módulo específico.

```javascript
let modules = MM.getModules().exceptModule(this);
```

#### `.enumerate(callback)`
Executa função em todos os módulos filtrados.

```javascript
MM.getModules().enumerate(function(module) {
    Log.log(module.name);
});
```

### Exemplo Completo

```javascript
notificationReceived: function(notification, payload, sender) {
    if (notification === "DOM_OBJECTS_CREATED") {
        MM.getModules()
            .exceptModule(this)
            .enumerate(function(module) {
                module.hide(1000, function() {
                    // Módulo oculto
                });
            });
    }
}
```

---

## Sistema de Logging

### No Módulo Principal

```javascript
Log.info("info");
Log.log("log");
Log.error("error");
```

### No Node Helper

Adicione no início do ficheiro:

```javascript
const Log = require("logger");
```

---

## Sistema de Notificações

### Notificações do Sistema

| Notificação | Payload | Descrição |
|-------------|---------|-----------|
| `ALL_MODULES_STARTED` | none | Todos os módulos iniciados |
| `DOM_OBJECTS_CREATED` | none | Todos os objetos DOM criados |
| `MODULE_DOM_CREATED` | none | DOM do módulo carregado |
| `MODULE_DOM_UPDATED` | none | DOM do módulo atualizado |

### Notificações dos Módulos Padrão

| Notificação | Payload | Descrição |
|-------------|---------|-----------|
| `SHOW_ALERT` | message details | Mostra alerta |
| `HIDE_ALERT` | none | Oculta alerta |
| `CALENDAR_EVENTS` | calendar events | Eventos do calendário |
| `ARTICLE_NEXT` | none | Próximo artigo |
| `ARTICLE_PREVIOUS` | none | Artigo anterior |
| `ARTICLE_MORE_DETAILS` | none | Mais detalhes |
| `ARTICLE_LESS_DETAILS` | none | Menos detalhes |
| `ARTICLE_TOGGLE_FULL` | none | Alternar tela cheia |

---

## Boas Práticas de Documentação

### Pontos Importantes

1. **Não assuma conhecimento prévio!**
2. **Dependências:** Especifique exatamente o que é necessário
3. **Ordem lógica:** Siga sequência lógica de operações
4. **Informação correta:** Não adivinhe como as coisas funcionam
5. **Atualizado:** Mantenha documentação atualizada
6. **Screenshots:** Inclua screenshots atualizados
7. **Teste:** Siga suas próprias instruções do zero
8. **Acessível:** Qualquer pessoa deve conseguir seguir
9. **Respeitoso:** Responda questões com respeito

### Estrutura Recomendada do README

```markdown
# MMM-MyModule

## Screenshot
[Incluir screenshot de alta qualidade]

## Descrição
Descrição clara e concisa do que o módulo faz.

## Instalação
1. Clone o repositório
2. Instale dependências
3. Configure o módulo

## Configuração
```javascript
{
    module: "MMM-MyModule",
    config: {
        // opções de configuração
    }
}
```

## Dependências
- API externa: [link]
- Requer chave de API: Sim/Não
- Limitações: [especificar]

## Troubleshooting
[Problemas comuns e soluções]
```

---

## Exemplos Práticos

### Módulo Simples (Hello World)

```javascript
Module.register("helloworld", {
    defaults: {
        text: "Hello World!"
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = this.config.text;
        return wrapper;
    }
});
```

### Módulo com Atualização Periódica

```javascript
Module.register("clock", {
    defaults: {
        updateInterval: 1000
    },

    start: function() {
        let self = this;
        setInterval(function() {
            self.updateDom();
        }, this.config.updateInterval);
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = new Date().toLocaleTimeString();
        return wrapper;
    }
});
```

### Módulo com Node Helper

**modulename.js:**
```javascript
Module.register("modulename", {
    defaults: {
        apiKey: ""
    },

    start: function() {
        this.sendSocketNotification("SET_CONFIG", this.config);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "DATA_RECEIVED") {
            this.data = payload;
            this.updateDom();
        }
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = this.data || "Loading...";
        return wrapper;
    }
});
```

**node_helper.js:**
```javascript
const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Node helper started");
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "SET_CONFIG") {
            this.config = payload;
            // Fazer requisição à API
            this.fetchData();
        }
    },

    fetchData: function() {
        // Simular dados
        const data = "Dados da API";
        this.sendSocketNotification("DATA_RECEIVED", data);
    }
});
```

### Módulo com Traduções

**translations/en.json:**
```json
{
    "INFO": "Really important information!",
    "RUNNING": "Ends in {timeUntilEnd}"
}
```

**translations/pt.json:**
```json
{
    "INFO": "Informação realmente importante!",
    "RUNNING": "Termina em {timeUntilEnd}"
}
```

**modulename.js:**
```javascript
Module.register("modulename", {
    getTranslations: function() {
        return {
            en: "translations/en.json",
            pt: "translations/pt.json"
        };
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = this.translate("INFO");
        return wrapper;
    }
});
```

---

## Conclusão

Este guia fornece todas as informações essenciais para desenvolver módulos MagicMirror². Lembre-se de:

1. Seguir as boas práticas de documentação
2. Testar o módulo completamente
3. Incluir screenshots e documentação clara
4. Respeitar a comunidade e responder questões com educação
5. Manter o código limpo e bem comentado

**"IF YOU WRITE IT GOOD, THEY WILL COME!"**

---

*Baseado na documentação oficial do MagicMirror² em https://docs.magicmirror.builders/development/*
