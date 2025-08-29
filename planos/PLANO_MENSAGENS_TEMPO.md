# Plano: Mensagens de Boas-Vindas Baseadas no Tempo

## Objetivo
Transformar o módulo "compliments" em um sistema inteligente que fornece informações úteis sobre o tempo, ajudando o utilizador a preparar-se para o dia com base nas condições meteorológicas.

## Análise da Estrutura Atual do Projeto

### ✅ Pontos Positivos Identificados:
1. **Sistema de Notificações Funcional**: O módulo weather já envia notificações `WEATHER_UPDATED` e `CURRENTWEATHER_TYPE`
2. **Dados Meteorológicos Disponíveis**: WeatherObject tem todas as propriedades necessárias:
   - `temperature`, `feelsLikeTemp`, `humidity`, `windSpeed`
   - `precipitationProbability`, `precipitationAmount`
   - `weatherType`, `minTemperature`, `maxTemperature`
3. **Estrutura de Comunicação**: O compliments já tem `notificationReceived` implementado
4. **Sistema de Configuração**: Suporte para configurações personalizáveis

### ⚠️ Limitações Identificadas:
1. **Dados de UV**: Não disponíveis no WeatherObject atual
2. **Visibilidade**: Não disponível no WeatherObject atual
3. **Dados de Previsão**: Limitados ao que o provider suporta
4. **Integração com Calendar**: Requer desenvolvimento adicional

---

## Estrutura do Módulo Seguindo as Melhores Práticas

### Estrutura de Ficheiros Recomendada
```
compliments/
├── compliments.js          # Script principal do módulo (modificado)
├── node_helper.js          # Helper Node.js (opcional - para lógica complexa)
├── css/
│   └── compliments.css     # Estilos específicos (se necessário)
├── translations/           # Ficheiros de tradução
│   ├── en.json
│   └── pt.json
└── README.md              # Documentação atualizada
```

### Configuração Padrão (defaults)
```javascript
defaults: {
    // Configurações existentes
    compliments: {
        anytime: ["Olá! Que tal estás?"],
        morning: ["Bom dia! Que tenhas um dia fantástico!", "Bom dia! Aproveita o teu dia!", "Como dormiste?"],
        afternoon: ["Olá! Como vai o teu dia?", "Estás com bom aspeto!", "Que tal o dia?"],
        evening: ["Boa noite! Como foi o teu dia?", "Boa noite! Descansa bem!", "Olá! Como estás?"],
        "....-01-01": ["Feliz ano novo!"]
    },
    updateInterval: 30000,
    fadeSpeed: 4000,
    
    // Novas configurações para funcionalidade de tempo
    weatherAware: true,
    temperatureThresholds: {
        cold: 15,
        hot: 25
    },
    rainThreshold: 70,
    windThreshold: 30,
    weatherTypeMapping: {
        "clear-day": "sol",
        "rain": "chuva",
        "cloudy": "nublado",
        "partly-cloudy-day": "parcialmente nublado"
    },
    enableWeatherMessages: true,
    enableForecastMessages: true,
    enableClothingSuggestions: true
}
```

---

## Fase 1: Análise e Estrutura Base (Debug Simples)

### 1.1 Objetivos da Fase 1
- Estabelecer comunicação entre módulos weather e compliments
- Criar estrutura básica de mensagens baseadas no tempo
- Testar integração básica
- Implementar logging adequado

### 1.2 Implementação Seguindo as Melhores Práticas

#### 1.2.1 Modificar compliments.js
```javascript
Module.register("compliments", {
    // Configuração padrão (incluir weatherAware: true)
    defaults: {
        // ... configurações existentes ...
        weatherAware: true,
        temperatureThresholds: {
            cold: 15,
            hot: 25
        }
    },

    // Propriedades da instância
    weatherData: null,
    forecastData: null,

    // Método start() - chamado quando todos os módulos estão carregados
    start: function() {
        Log.info("Starting module: " + this.name);
        this.weatherData = null;
        this.forecastData = null;
        
        // Agendar atualizações
        this.scheduleUpdate();
    },

    // Método notificationReceived - recebe notificações de outros módulos
    notificationReceived: function(notification, payload, sender) {
        if (notification === "WEATHER_UPDATED") {
            Log.log(this.name + " received weather data from: " + (sender ? sender.name : "unknown"));
            this.weatherData = payload.currentWeather;
            this.forecastData = payload.forecastArray;
            this.updateDom();
        }
    },

    // Método getDom() - OBRIGATÓRIO
    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = this.config.classes ? this.config.classes : "thin xlarge bright pre-line";
        
        const complimentText = this.getWeatherBasedCompliment();
        if (complimentText) {
            wrapper.innerHTML = complimentText;
        } else {
            // Fallback para mensagens normais
            wrapper.innerHTML = this.getRandomCompliment();
        }
        
        return wrapper;
    },

    // Método para obter mensagem baseada no tempo
    getWeatherBasedCompliment: function() {
        if (!this.config.weatherAware || !this.weatherData) {
            return null;
        }

        const temp = this.weatherData.temperature;
        const hour = moment().hour();
        
        // Mensagens básicas por período
        if (hour >= 6 && hour < 12) {
            if (temp < this.config.temperatureThresholds.cold) {
                return "Bom dia! Está frio hoje, leva casaco!";
            }
            if (this.weatherData.precipitationProbability > this.config.rainThreshold) {
                return "Bom dia! Vai chover, não te esqueças do guarda-chuva!";
            }
        }
        
        return null;
    }
});
```

#### 1.2.2 Implementar Logging Adequado
```javascript
// Usar Log.info, Log.log, Log.error conforme apropriado
Log.info(this.name + " Weather data received: " + JSON.stringify(this.weatherData));
Log.error(this.name + " Failed to process weather data");
```

### 1.3 Critérios de Sucesso
- Módulo compliments recebe dados do weather via notificações
- Mensagens mudam baseadas no tempo
- Sistema funciona sem erros
- Logging adequado implementado

---

## Fase 2: Mensagens Inteligentes (Debug Intermédio)

### 2.1 Objetivos da Fase 2
- Implementar lógica mais sofisticada
- Adicionar mais variáveis meteorológicas disponíveis
- Criar mensagens contextuais
- Implementar sistema de tradução

### 2.2 Implementação

#### 2.2.1 Sistema de Tradução
```javascript
// Adicionar getTranslations()
getTranslations: function() {
    return {
        en: "translations/en.json",
        pt: "translations/pt.json"
    };
}
```

#### 2.2.2 Ficheiro de Traduções (translations/pt.json)
```json
{
    "COLD_MORNING": "Bom dia! Está frio, leva casaco quente!",
    "RAIN_MORNING": "Bom dia! Vai chover, leva guarda-chuva!",
    "WINDY_MORNING": "Bom dia! Está ventoso, leva casaco!",
    "SUNNY_MORNING": "Bom dia! Sol forte, não te esqueças do protetor solar!",
    "COLD_AFTERNOON": "Está frio, leva casaco!",
    "RAIN_AFTERNOON": "Vai chover, leva guarda-chuva!",
    "COLD_EVENING": "Boa noite! Está frio, leva casaco!",
    "RAIN_EVENING": "Boa noite! Vai chover, leva guarda-chuva!"
}
```

#### 2.2.3 Lógica de Decisão Melhorada
```javascript
getWeatherBasedCompliment: function() {
    if (!this.config.weatherAware || !this.weatherData) {
        return null;
    }

    const temp = this.weatherData.temperature;
    const hour = moment().hour();
    const windSpeed = this.weatherData.windSpeed;
    const rainProb = this.weatherData.precipitationProbability;
    const weatherType = this.weatherData.weatherType;

    // Determinar período do dia
    let timeOfDay = "anytime";
    if (hour >= 6 && hour < 12) timeOfDay = "morning";
    else if (hour >= 12 && hour < 18) timeOfDay = "afternoon";
    else timeOfDay = "evening";

    // Lógica de decisão
    if (timeOfDay === "morning") {
        if (temp < this.config.temperatureThresholds.cold) {
            return this.translate("COLD_MORNING");
        }
        if (rainProb > this.config.rainThreshold) {
            return this.translate("RAIN_MORNING");
        }
        if (windSpeed > this.config.windThreshold) {
            return this.translate("WINDY_MORNING");
        }
        if (weatherType && weatherType.includes("clear")) {
            return this.translate("SUNNY_MORNING");
        }
    }
    
    // Lógica similar para tarde e noite...
    
    return null;
}
```

### 2.3 Critérios de Sucesso
- Mensagens são contextuais e úteis
- Sistema responde a múltiplas variáveis
- Sistema de tradução funcionando
- Performance mantida

---

## Fase 3: Previsão e Planeamento (Debug Avançado)

### 3.1 Objetivos da Fase 3
- Integrar dados de previsão (forecast)
- Criar avisos antecipados
- Implementar sugestões de vestuário
- Adicionar configurações avançadas

### 3.2 Implementação

#### 3.2.1 Configurações Avançadas
```javascript
defaults: {
    // ... configurações anteriores ...
    enableForecastMessages: true,
    enableClothingSuggestions: true,
    forecastThresholds: {
        tempChange: 5,  // Mudança significativa de temperatura
        rainProbability: 50
    }
}
```

#### 3.2.2 Lógica de Previsão
```javascript
getForecastBasedMessage: function() {
    if (!this.config.enableForecastMessages || !this.forecastData || this.forecastData.length === 0) {
        return null;
    }

    const today = this.forecastData[0];
    const currentTemp = this.weatherData.temperature;
    const maxTemp = today.maxTemperature;
    const minTemp = today.minTemperature;

    // Verificar mudanças significativas
    if (maxTemp - currentTemp > this.config.forecastThresholds.tempChange) {
        return this.translate("TEMP_RISING", { maxTemp: Math.round(maxTemp) });
    }

    if (currentTemp - minTemp > this.config.forecastThresholds.tempChange) {
        return this.translate("TEMP_DROPPING", { minTemp: Math.round(minTemp) });
    }

    return null;
}
```

### 3.3 Critérios de Sucesso
- Mensagens incluem previsões
- Sugestões são práticas
- Sistema é proativo

---

## Fase 4: Personalização e Contexto (Debug Final)

### 4.1 Objetivos da Fase 4
- Adicionar contexto pessoal
- Implementar configurações personalizáveis
- Otimizar performance
- Documentação completa

### 4.2 Implementação

#### 4.2.1 Configurações Personalizáveis
```javascript
defaults: {
    // ... configurações anteriores ...
    personalPreferences: {
        coldSensitive: false,
        rainSensitive: true,
        windSensitive: false
    },
    customThresholds: {
        personalCold: 18,
        personalHot: 22
    }
}
```

#### 4.2.2 Integração com Calendar (Futuro)
```javascript
notificationReceived: function(notification, payload, sender) {
    if (notification === "WEATHER_UPDATED") {
        // ... código existente ...
    }
    if (notification === "CALENDAR_EVENTS") {
        this.calendarEvents = payload;
        this.updateDom();
    }
}
```

### 4.3 Critérios de Sucesso
- Sistema é personalizável
- Mensagens são relevantes
- Performance otimizada
- Documentação completa

---

## Estrutura Técnica Atualizada

### Ficheiros a Modificar
1. `magic/modules/default/compliments/compliments.js` - Principal
2. `magic/modules/default/compliments/translations/pt.json` - Traduções
3. `magic/config/config.js` - Configurações (opcional)

### Novas Funcionalidades
1. **Listener de dados meteorológicos** (via `WEATHER_UPDATED`)
2. **Sistema de decisão inteligente**
3. **Mensagens contextuais**
4. **Sistema de tradução**
5. **Configurações personalizáveis**

### Estrutura de Dados WeatherObject Disponível
```javascript
{
    temperature: number,
    feelsLikeTemp: number,
    humidity: number,
    windSpeed: number,
    precipitationProbability: number,
    precipitationAmount: number,
    weatherType: string,
    minTemperature: number,
    maxTemperature: number,
    date: moment
}
```

---

## Cronograma de Implementação

### Semana 1: Fase 1
- ✅ Análise do código atual
- Implementação básica de comunicação
- Testes simples
- Logging adequado

### Semana 2: Fase 2
- Lógica de decisão
- Sistema de tradução
- Mensagens contextuais
- Testes intermédios

### Semana 3: Fase 3
- Integração com previsões
- Mensagens de planeamento
- Configurações avançadas
- Testes avançados

### Semana 4: Fase 4
- Personalização
- Otimizações
- Documentação completa
- Testes finais

---

## Métricas de Sucesso

1. **Funcionalidade**: Sistema fornece informações úteis
2. **Performance**: Tempo de resposta < 1 segundo
3. **Precisão**: Mensagens relevantes > 90%
4. **Usabilidade**: Configuração simples e intuitiva
5. **Manutenibilidade**: Código limpo e bem documentado

---

## Notas de Debug e Limitações

### ✅ Funcionalidades Viáveis:
- Comunicação entre módulos via notificações
- Acesso a dados meteorológicos completos
- Sistema de configuração personalizável
- Mensagens baseadas em múltiplas variáveis
- Sistema de tradução nativo

### ⚠️ Limitações Identificadas:
- Dados de UV não disponíveis (requer provider específico)
- Visibilidade não disponível (requer provider específico)
- Integração com calendar requer desenvolvimento adicional
- Alguns weatherTypes podem variar entre providers

### 🔧 Soluções Propostas:
- Usar `weatherType` para determinar condições de sol
- Implementar fallbacks para dados indisponíveis
- Criar sistema de mapeamento de weatherTypes
- Desenvolver integração com calendar na Fase 4

---

## Implementação Recomendada Seguindo as Melhores Práticas

### Passo 1: Estrutura Básica
```javascript
Module.register("compliments", {
    defaults: {
        weatherAware: true,
        temperatureThresholds: { cold: 15, hot: 25 },
        rainThreshold: 70,
        windThreshold: 30
    },

    weatherData: null,
    forecastData: null,

    start: function() {
        Log.info("Starting module: " + this.name);
        this.scheduleUpdate();
    },

    notificationReceived: function(notification, payload, sender) {
        if (notification === "WEATHER_UPDATED") {
            Log.log(this.name + " received weather data from: " + (sender ? sender.name : "unknown"));
            this.weatherData = payload.currentWeather;
            this.forecastData = payload.forecastArray;
            this.updateDom();
        }
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = this.config.classes ? this.config.classes : "thin xlarge bright pre-line";
        
        const weatherMessage = this.getWeatherBasedCompliment();
        wrapper.innerHTML = weatherMessage || this.getRandomCompliment();
        
        return wrapper;
    }
});
```

### Passo 2: Sistema de Tradução
```javascript
getTranslations: function() {
    return {
        en: "translations/en.json",
        pt: "translations/pt.json"
    };
}
```

### Passo 3: Lógica de Decisão
```javascript
getWeatherBasedCompliment: function() {
    if (!this.config.weatherAware || !this.weatherData) {
        return null;
    }
    
    const temp = this.weatherData.temperature;
    const hour = moment().hour();
    
    if (hour >= 6 && hour < 12) {
        if (temp < this.config.temperatureThresholds.cold) {
            return this.translate("COLD_MORNING");
        }
        if (this.weatherData.precipitationProbability > this.config.rainThreshold) {
            return this.translate("RAIN_MORNING");
        }
    }
    
    return null;
}
```

---

## Documentação e README

### Estrutura Recomendada do README
```markdown
# Módulo Compliments com Integração Meteorológica

## Screenshot
[Incluir screenshot mostrando mensagens baseadas no tempo]

## Descrição
Módulo de boas-vindas inteligente que fornece mensagens contextuais baseadas nas condições meteorológicas atuais e previsões.

## Funcionalidades
- Mensagens baseadas na temperatura atual
- Avisos de chuva e vento
- Sugestões de vestuário
- Integração com dados de previsão
- Sistema de tradução completo

## Configuração
```javascript
{
    module: "compliments",
    config: {
        weatherAware: true,
        temperatureThresholds: {
            cold: 15,
            hot: 25
        },
        rainThreshold: 70,
        windThreshold: 30
    }
}
```

## Dependências
- Módulo weather (padrão do MagicMirror²)
- Provider meteorológico configurado

## Troubleshooting
- Verificar se o módulo weather está configurado
- Confirmar que as notificações estão a ser enviadas
- Verificar logs para erros de comunicação
```

---

*Plano atualizado em: 29/08/2025*
*Versão: 3.0*
*Estado: Análise completa - Pronto para implementação*
*Seguindo as melhores práticas do MagicMirror²*
*Limitações identificadas e soluções propostas*
