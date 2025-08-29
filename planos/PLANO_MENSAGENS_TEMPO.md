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

## Fase 1: Análise e Estrutura Base (Debug Simples)

### 1.1 Objetivos da Fase 1
- Estabelecer comunicação entre módulos weather e compliments
- Criar estrutura básica de mensagens baseadas no tempo
- Testar integração básica

### 1.2 Implementação
1. **Modificar compliments.js** para receber dados do weather
   - Adicionar listener para `WEATHER_UPDATED` notification
   - Criar estrutura para armazenar dados meteorológicos
   - Implementar fallback para dados indisponíveis

2. **Criar mensagens básicas** baseadas em:
   - Temperatura atual (`temperature`)
   - Sensação térmica (`feelsLikeTemp`)
   - Condições gerais (`weatherType`)
   - Hora do dia

3. **Mensagens de teste**:
   ```
   Manhã + Frio: "Bom dia! Está frio hoje, leva casaco!"
   Manhã + Chuva: "Bom dia! Vai chover, não te esqueças do guarda-chuva!"
   Manhã + Sol: "Bom dia! Está sol, aproveita o dia!"
   ```

### 1.3 Critérios de Sucesso
- Módulo compliments recebe dados do weather
- Mensagens mudam baseadas no tempo
- Sistema funciona sem erros

---

## Fase 2: Mensagens Inteligentes (Debug Intermédio)

### 2.1 Objetivos da Fase 2
- Implementar lógica mais sofisticada
- Adicionar mais variáveis meteorológicas disponíveis
- Criar mensagens contextuais

### 2.2 Implementação
1. **Variáveis meteorológicas a considerar** (baseadas no WeatherObject):
   - Temperatura atual (`temperature`) e sensação térmica (`feelsLikeTemp`)
   - Probabilidade de precipitação (`precipitationProbability`)
   - Velocidade do vento (`windSpeed`)
   - Humidade (`humidity`)
   - Tipo de tempo (`weatherType`)
   - Temperatura máxima/mínima (`maxTemperature`, `minTemperature`)

2. **Lógica de decisão**:
   ```
   SE manhã E temperature < 15°C: "Bom dia! Está frio, leva casaco quente!"
   SE manhã E precipitationProbability > 70%: "Bom dia! Vai chover muito, leva guarda-chuva!"
   SE manhã E windSpeed > 30km/h: "Bom dia! Está ventoso, leva casaco!"
   SE manhã E weatherType.includes("clear"): "Bom dia! Sol forte, não te esqueças do protetor solar!"
   ```

3. **Mensagens por período**:
   - **Manhã (6h-12h)**: Preparação para sair
   - **Tarde (12h-18h)**: Avisos para atividades
   - **Noite (18h-6h)**: Preparação para regresso

### 2.3 Critérios de Sucesso
- Mensagens são contextuais e úteis
- Sistema responde a múltiplas variáveis
- Performance mantida

---

## Fase 3: Previsão e Planeamento (Debug Avançado)

### 3.1 Objetivos da Fase 3
- Integrar dados de previsão (forecast)
- Criar avisos antecipados
- Implementar sugestões de vestuário

### 3.2 Implementação
1. **Dados de previsão** (via `forecastArray`):
   - Temperatura máxima/mínima do dia
   - Previsão para próximas horas
   - Tendência do tempo

2. **Mensagens de planeamento**:
   ```
   "Hoje vai estar frio (máx 12°C), leva casaco quente!"
   "Vai chover à tarde, leva guarda-chuva!"
   "Sol forte hoje, protetor solar essencial!"
   "Temperatura vai baixar à noite, leva casaco extra!"
   ```

3. **Sugestões de vestuário**:
   - Baseadas na temperatura e condições
   - Adaptadas à estação do ano
   - Considerando atividades típicas

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

### 4.2 Implementação
1. **Contexto pessoal**:
   - Preferências de vestuário
   - Atividades programadas (via calendar - desenvolvimento futuro)
   - Histórico de preferências

2. **Configurações**:
   - Ativar/desativar tipos de mensagens
   - Personalizar temperaturas de referência
   - Definir horários de avisos

3. **Mensagens avançadas**:
   ```
   "Tens reunião às 14h, vai chover, leva guarda-chuva!"
   "Hoje é dia de treino, está sol, perfeito para correr!"
   "Vais sair à noite, temperatura vai baixar para 8°C!"
   ```

### 4.3 Critérios de Sucesso
- Sistema é personalizável
- Mensagens são relevantes
- Performance otimizada

---

## Estrutura Técnica Atualizada

### Ficheiros a Modificar
1. `magic/modules/default/compliments/compliments.js` - Principal
2. `magic/config/config.js` - Configurações

### Novas Funcionalidades
1. **Listener de dados meteorológicos** (via `WEATHER_UPDATED`)
2. **Sistema de decisão inteligente**
3. **Mensagens contextuais**
4. **Configurações personalizáveis**

### Variáveis de Configuração
```javascript
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
    "cloudy": "nublado"
}
```

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
- Análise do código atual ✅
- Implementação básica de comunicação
- Testes simples

### Semana 2: Fase 2
- Lógica de decisão
- Mensagens contextuais
- Testes intermédios

### Semana 3: Fase 3
- Integração com previsões
- Mensagens de planeamento
- Testes avançados

### Semana 4: Fase 4
- Personalização
- Otimizações
- Testes finais

---

## Métricas de Sucesso

1. **Funcionalidade**: Sistema fornece informações úteis
2. **Performance**: Tempo de resposta < 1 segundo
3. **Precisão**: Mensagens relevantes > 90%
4. **Usabilidade**: Configuração simples e intuitiva

---

## Notas de Debug e Limitações

### ✅ Funcionalidades Viáveis:
- Comunicação entre módulos via notificações
- Acesso a dados meteorológicos completos
- Sistema de configuração personalizável
- Mensagens baseadas em múltiplas variáveis

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

## Implementação Recomendada

### Passo 1: Testar Comunicação
```javascript
// Em compliments.js
notificationReceived(notification, payload, sender) {
    if (notification === "WEATHER_UPDATED") {
        this.weatherData = payload.currentWeather;
        this.forecastData = payload.forecastArray;
        Log.info("Weather data received:", this.weatherData);
    }
}
```

### Passo 2: Implementar Lógica Básica
```javascript
getWeatherBasedMessage() {
    if (!this.weatherData) return null;
    
    const temp = this.weatherData.temperature;
    const hour = moment().hour();
    
    if (hour >= 6 && hour < 12) {
        if (temp < 15) return "Bom dia! Está frio, leva casaco!";
        if (this.weatherData.precipitationProbability > 70) return "Bom dia! Vai chover, leva guarda-chuva!";
    }
    
    return null;
}
```

---

*Plano atualizado em: 29/08/2025*
*Versão: 2.0*
*Estado: Análise completa - Pronto para implementação*
*Limitações identificadas e soluções propostas*
