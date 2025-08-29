# Módulo: Compliments com Integração Meteorológica

O módulo `compliments` é um dos módulos padrão do MagicMirror², agora melhorado com funcionalidades inteligentes baseadas no tempo meteorológico.

## Funcionalidades

- **Mensagens Contextuais**: Fornece mensagens úteis baseadas nas condições meteorológicas atuais
- **Avisos de Tempo**: Alerta para chuva, vento, frio e calor
- **Sugestões de Vestuário**: Recomendações práticas baseadas no tempo
- **Previsões Inteligentes**: Mensagens baseadas em dados de previsão meteorológica
- **Personalização**: Configurações adaptáveis às preferências pessoais
- **Sistema de Tradução**: Suporte completo para português e inglês

## Configuração

### Configuração Básica
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

### Configuração Avançada
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
        windThreshold: 30,
        enableWeatherMessages: true,
        enableForecastMessages: true,
        enableClothingSuggestions: true,
        forecastThresholds: {
            tempChange: 5,
            rainProbability: 50
        },
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
}
```

## Parâmetros de Configuração

### Funcionalidades Principais
- `weatherAware`: Ativa/desativa a funcionalidade meteorológica (padrão: true)
- `enableWeatherMessages`: Ativa mensagens baseadas no tempo atual (padrão: true)
- `enableForecastMessages`: Ativa mensagens baseadas em previsões (padrão: true)
- `enableClothingSuggestions`: Ativa sugestões de vestuário (padrão: true)

### Thresholds de Temperatura
- `temperatureThresholds.cold`: Temperatura abaixo da qual é considerado frio (padrão: 15°C)
- `temperatureThresholds.hot`: Temperatura acima da qual é considerado quente (padrão: 25°C)
- `customThresholds.personalCold`: Threshold personalizado para frio (padrão: 18°C)
- `customThresholds.personalHot`: Threshold personalizado para calor (padrão: 22°C)

### Thresholds de Condições
- `rainThreshold`: Probabilidade de chuva acima da qual mostrar aviso (padrão: 70%)
- `windThreshold`: Velocidade do vento acima da qual mostrar aviso (padrão: 30 km/h)

### Preferências Pessoais
- `personalPreferences.coldSensitive`: Se é sensível ao frio (padrão: false)
- `personalPreferences.rainSensitive`: Se é sensível à chuva (padrão: true)
- `personalPreferences.windSensitive`: Se é sensível ao vento (padrão: false)

### Thresholds de Previsão
- `forecastThresholds.tempChange`: Mudança significativa de temperatura (padrão: 5°C)
- `forecastThresholds.rainProbability`: Probabilidade de chuva para previsões (padrão: 50%)

## Dependências

- Módulo weather (padrão do MagicMirror²)
- Provider meteorológico configurado (OpenWeatherMap, WeatherAPI, etc.)

## Mensagens Disponíveis

### Manhã (6h-12h)
- Frio: "Bom dia! Está frio hoje, leva casaco quente!"
- Chuva: "Bom dia! Vai chover, não te esqueças do guarda-chuva!"
- Vento: "Bom dia! Está ventoso, leva casaco!"
- Sol: "Bom dia! Sol forte, não te esqueças do protetor solar!"

### Tarde (12h-18h)
- Frio: "Está frio, leva casaco!"
- Chuva: "Vai chover, leva guarda-chuva!"
- Calor: "Está quente, bebe muita água!"

### Noite (18h-6h)
- Frio: "Boa noite! Está frio, leva casaco!"
- Chuva: "Boa noite! Vai chover, leva guarda-chuva!"

### Previsões
- Subida de temperatura: "A temperatura vai subir até X°C hoje!"
- Descida de temperatura: "A temperatura vai descer até X°C hoje!"

## Troubleshooting

### O módulo não mostra mensagens meteorológicas
1. Verificar se o módulo weather está configurado e funcionando
2. Confirmar que `weatherAware` está definido como `true`
3. Verificar os logs para erros de comunicação entre módulos

### Mensagens não aparecem no idioma correto
1. Verificar se os ficheiros de tradução existem em `translations/`
2. Confirmar que o idioma está configurado corretamente no MagicMirror²

### Thresholds não funcionam como esperado
1. Verificar se os valores estão dentro de intervalos razoáveis
2. Confirmar que as preferências pessoais estão configuradas corretamente
3. Testar com diferentes condições meteorológicas

## Exemplos de Configuração

### Configuração para Pessoa Sensível ao Frio
```javascript
{
    module: "compliments",
    config: {
        weatherAware: true,
        personalPreferences: {
            coldSensitive: true,
            rainSensitive: true,
            windSensitive: false
        },
        customThresholds: {
            personalCold: 20,
            personalHot: 25
        }
    }
}
```

### Configuração para Pessoa Sensível à Chuva
```javascript
{
    module: "compliments",
    config: {
        weatherAware: true,
        rainThreshold: 30,
        personalPreferences: {
            coldSensitive: false,
            rainSensitive: true,
            windSensitive: true
        }
    }
}
```

## Desenvolvimento

Este módulo segue as melhores práticas do MagicMirror²:
- Sistema de notificações para comunicação entre módulos
- Sistema de tradução nativo
- Configurações personalizáveis
- Logging adequado para debug
- Compatibilidade com todos os providers meteorológicos

Para mais informações sobre configuração, consulte a [documentação do MagicMirror²](https://docs.magicmirror.builders/modules/compliments.html).
