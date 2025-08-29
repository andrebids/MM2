# Plano de Desenvolvimento - Módulo MMM-CryptoPanel

## Visão Geral
Desenvolvimento de um painel informativo de criptomoedas simples para o MagicMirror², baseado no design da imagem de referência que mostra Bitcoin, Ethereum, Tether, BNB e Solana com preços e variações percentuais.

## Objetivos
- Exibir lista de criptomoedas populares com preços atuais
- Mostrar variação percentual com indicadores visuais (verde/vermelho)
- Interface limpa e minimalista integrada ao MagicMirror
- Suporte a múltiplos idiomas (português/inglês)
- Atualização automática dos dados

## Estrutura do Módulo

### Localização
```
modules/default/cryptopanel/
├── cryptopanel.js          # Script principal do módulo
├── node_helper.js          # Helper para chamadas à API
├── css/
│   └── cryptopanel.css     # Estilos customizados
├── translations/
│   ├── en.json
│   └── pt.json
└── README.md
```

**Nota:** O nome do módulo deve seguir o padrão `MMM-CryptoPanel` para módulos externos, mas como será um módulo padrão, `cryptopanel` é aceitável.

## Opções de Implementação

### Opção A: Widget CoinGecko (Recomendado - Fase 1)
**Vantagens:**
- Implementação rápida (1-2 horas)
- Dados sempre atualizados
- Design profissional
- Menos código para manter
- Funciona imediatamente

**Desvantagens:**
- Menos controlo sobre o design
- Pode não integrar perfeitamente com o tema do MagicMirror

### Opção B: API CoinGecko Customizada (Fase 2)
**Vantagens:**
- Controlo total sobre o design
- Melhor integração com o tema do MagicMirror
- Mais flexibilidade
- Design personalizado

**Desvantagens:**
- Mais código para manter
- Requer gestão de rate limits da API
- Implementação mais complexa

## Cronograma de Desenvolvimento

### Fase 1: Widget CoinGecko (1-2 horas)
1. **Criar estrutura do módulo** (15 min)
   - Criar pasta `modules/default/cryptopanel/`
   - Criar ficheiros base: `cryptopanel.js`, `css/cryptopanel.css`
   - Criar ficheiros de tradução: `translations/en.json`, `translations/pt.json`
   - Implementar estrutura básica do módulo com `Module.register()`

2. **Implementar módulo principal** (30 min)
   - Configurar defaults
   - Implementar carregamento do widget CoinGecko via `getScripts()`
   - Configurar sistema de traduções com `getTranslations()`
   - Implementar `getDom()` para renderização

3. **Estilização básica** (15 min)
   - CSS para integração com o tema do MagicMirror
   - Ajustes de layout e cores
   - Garantir responsividade

4. **Testes e ajustes** (30 min)
   - Testar funcionamento
   - Ajustar configurações
   - Verificar responsividade
   - Implementar sistema de logging

### Fase 2: API CoinGecko Customizada (2-3 horas)
1. **Implementar Node Helper** (45 min)
   - Criar `node_helper.js` com `NodeHelper.create()`
   - Implementar chamadas à API CoinGecko
   - Gestão de erros e rate limits
   - Sistema de logging no helper

2. **Redesenhar módulo principal** (45 min)
   - Remover dependência do widget
   - Implementar `socketNotificationReceived()` para receber dados
   - Implementar renderização customizada no `getDom()`
   - Sistema de atualização automática com `setInterval()`

3. **Design customizado** (60 min)
   - CSS completo para o design da imagem
   - Ícones das criptomoedas
   - Indicadores de variação percentual
   - Layout responsivo
   - Integração com tema do MagicMirror

4. **Testes avançados** (30 min)
   - Testar diferentes configurações
   - Verificar performance
   - Testar com diferentes idiomas
   - Validar comunicação entre módulo e node helper

### Fase 3: Melhorias e Documentação (1 hora)
1. **Otimizações** (30 min)
   - Melhorar performance
   - Adicionar animações suaves
   - Otimizar carregamento

2. **Documentação** (30 min)
   - Criar README.md completo
   - Screenshots do módulo funcionando
   - Instruções de instalação e configuração

## Especificações Técnicas

### Configuração Padrão
```javascript
defaults: {
    updateInterval: 60000,        // Atualização a cada 1 minuto
    coins: ["bitcoin", "ethereum", "tether", "binancecoin", "solana"],
    currency: "usd",              // Moeda base
    showHeader: true,             // Mostrar cabeçalho
    headerText: "Criptomoedas",   // Texto do cabeçalho
    language: "pt"                // Idioma padrão
}
```

### Estrutura Básica do Módulo
```javascript
Module.register("cryptopanel", {
    defaults: {
        // configurações padrão
    },

    start: function() {
        // inicialização
    },

    getDom: function() {
        // geração do DOM
    },

    socketNotificationReceived: function(notification, payload) {
        // receber dados do node helper
    }
});
```

### Criptomoedas Suportadas
- **Bitcoin (BTC)** - Laranja
- **Ethereum (ETH)** - Azul
- **Tether (USDT)** - Verde
- **BNB (BNB)** - Amarelo
- **Solana (SOL)** - Roxo

### API Endpoints (Opção B)
- **Base URL:** `https://api.coingecko.com/api/v3/`
- **Endpoint:** `/coins/markets`
- **Parâmetros:** `vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin,solana&order=market_cap_desc&per_page=5&page=1&sparkline=false`

## Design e Interface

### Elementos Visuais
- **Fundo:** Branco com transparência
- **Bordas:** Arredondadas (10px)
- **Sombra:** Sutil para profundidade
- **Tipografia:** Sans-serif, legível

### Indicadores de Variação
- **Positiva:** Verde (#00c853)
- **Negativa:** Vermelho (#f44336)
- **Seta:** Para cima (positiva) / Para baixo (negativa)

### Layout
- **Cabeçalho:** Título centralizado
- **Lista:** Cada criptomoeda em linha separada
- **Elementos:** Ícone + Nome/Símbolo + Preço/Variação

## Traduções

### Português (pt.json)
```json
{
    "HEADER": "Criptomoedas",
    "LOADING": "A carregar...",
    "ERROR": "Erro ao carregar dados",
    "UPDATED": "Atualizado em {time}"
}
```

### Inglês (en.json)
```json
{
    "HEADER": "Cryptocurrencies",
    "LOADING": "Loading...",
    "ERROR": "Error loading data",
    "UPDATED": "Updated at {time}"
}
```

## Configuração no MagicMirror

### Exemplo de Configuração
```javascript
{
    module: "cryptopanel",
    position: "top_right",
    config: {
        updateInterval: 60000,
        coins: ["bitcoin", "ethereum", "tether", "binancecoin", "solana"],
        currency: "usd",
        showHeader: true,
        language: "pt"
    }
}
```

### Configuração no config.js
```javascript
{
    module: "cryptopanel",
    position: "top_right",
    header: "Criptomoedas",  // Cabeçalho opcional
    config: {
        updateInterval: 60000,
        coins: ["bitcoin", "ethereum", "tether", "binancecoin", "solana"],
        currency: "usd",
        showHeader: true,
        language: "pt"
    }
}
```

## Considerações de Performance

### Otimizações
- **Cache de dados:** Evitar chamadas desnecessárias à API
- **Rate limiting:** Respeitar limites da API CoinGecko
- **Lazy loading:** Carregar dados apenas quando necessário
- **Error handling:** Gestão robusta de erros

### Limitações da API
- **Rate limit:** 50 calls/minute para API gratuita
- **Dados:** Atualização a cada 1-2 minutos
- **Disponibilidade:** Pode ter downtime ocasional

## Testes e Validação

### Cenários de Teste
1. **Funcionamento básico:** Módulo carrega e exibe dados
2. **Atualização automática:** Dados atualizam conforme configurado
3. **Múltiplos idiomas:** Traduções funcionam corretamente
4. **Responsividade:** Layout adapta-se a diferentes tamanhos
5. **Gestão de erros:** Comportamento quando API falha
6. **Performance:** Não impacta performance do MagicMirror
7. **Sistema de logging:** Logs apropriados para debugging

### Critérios de Aceitação
- [ ] Módulo carrega sem erros
- [ ] Dados de criptomoedas são exibidos corretamente
- [ ] Variações percentuais são mostradas com cores apropriadas
- [ ] Atualização automática funciona
- [ ] Traduções funcionam em português e inglês
- [ ] Design integra-se bem com o tema do MagicMirror
- [ ] Performance não é impactada
- [ ] Sistema de logging funciona corretamente
- [ ] Node helper comunica adequadamente com o módulo principal

## Próximos Passos

1. **Iniciar Fase 1:** Implementar versão com widget CoinGecko
2. **Testar funcionalidade:** Verificar se atende aos requisitos básicos
3. **Decidir sobre Fase 2:** Avaliar se é necessário design customizado
4. **Implementar melhorias:** Baseado no feedback dos testes
5. **Documentar:** Criar documentação completa

## Recursos Necessários

### APIs
- **CoinGecko API:** https://api.coingecko.com/api/v3/
- **Widget CoinGecko:** https://widgets.coingecko.com/

### Documentação
- **MagicMirror²:** https://docs.magicmirror.builders/
- **Guia de Desenvolvimento:** MAGICMIRROR_MODULE_DEVELOPMENT_GUIDE.md

### Ferramentas
- Editor de código (VS Code recomendado)
- Navegador para testes
- Terminal para comandos Git

## Boas Práticas de Documentação

### README.md Obrigatório
O README deve incluir:
- Screenshot de alta qualidade do módulo funcionando
- Descrição clara e concisa do que faz
- APIs externas que utiliza (com links)
- Se requer chaves de API e limitações
- Instruções de instalação e configuração
- Troubleshooting para problemas comuns

### Estrutura do README
```markdown
# MMM-CryptoPanel

## Screenshot
[Incluir screenshot de alta qualidade]

## Descrição
Painel informativo de criptomoedas para MagicMirror².

## Instalação
1. Clone o repositório
2. Configure o módulo no config.js

## Configuração
```javascript
{
    module: "cryptopanel",
    config: {
        // configurações
    }
}
```

## Dependências
- CoinGecko API: https://api.coingecko.com/api/v3/
- Requer chave de API: Não
- Limitações: 50 calls/minute (API gratuita)

## Troubleshooting
[Problemas comuns e soluções]
```

---

**Data de Criação:** $(date)
**Versão:** 1.0
**Estado:** Planeamento
**Próxima Revisão:** Após implementação da Fase 1
