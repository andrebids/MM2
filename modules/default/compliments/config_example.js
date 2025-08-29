// Exemplo de configuração para o módulo Compliments com integração meteorológica
// Adicionar ao ficheiro config.js do MagicMirror²

{
    module: "compliments",
    position: "lower_third",
    config: {
        // Configurações básicas do módulo
        compliments: {
            anytime: ["Olá! Que tal estás?"],
            morning: ["Bom dia! Que tenhas um dia fantástico!", "Bom dia! Aproveita o teu dia!", "Como dormiste?"],
            afternoon: ["Olá! Como vai o teu dia?", "Estás com bom aspeto!", "Que tal o dia?"],
            evening: ["Boa noite! Como foi o teu dia?", "Boa noite! Descansa bem!", "Olá! Como estás?"],
            "....-01-01": ["Feliz ano novo!"]
        },
        updateInterval: 30000,
        fadeSpeed: 4000,
        
        // NOVAS CONFIGURAÇÕES METEOROLÓGICAS
        
        // Ativar funcionalidade meteorológica
        weatherAware: true,
        
        // Thresholds de temperatura (em graus Celsius)
        temperatureThresholds: {
            cold: 15,    // Abaixo de 15°C é considerado frio
            hot: 25      // Acima de 25°C é considerado quente
        },
        
        // Thresholds de condições meteorológicas
        rainThreshold: 70,    // Probabilidade de chuva acima de 70%
        windThreshold: 30,    // Velocidade do vento acima de 30 km/h
        
        // Mapeamento de tipos de tempo (opcional)
        weatherTypeMapping: {
            "clear-day": "sol",
            "rain": "chuva",
            "cloudy": "nublado",
            "partly-cloudy-day": "parcialmente nublado"
        },
        
        // Ativar/desativar funcionalidades específicas
        enableWeatherMessages: true,      // Mensagens baseadas no tempo atual
        enableForecastMessages: true,     // Mensagens baseadas em previsões
        enableClothingSuggestions: true,  // Sugestões de vestuário
        
        // Thresholds para previsões
        forecastThresholds: {
            tempChange: 5,        // Mudança significativa de temperatura
            rainProbability: 50   // Probabilidade de chuva para previsões
        },
        
        // Preferências pessoais
        personalPreferences: {
            coldSensitive: false,  // Sensível ao frio
            rainSensitive: true,   // Sensível à chuva
            windSensitive: false   // Sensível ao vento
        },
        
        // Thresholds personalizados
        customThresholds: {
            personalCold: 18,      // Threshold pessoal para frio
            personalHot: 22        // Threshold pessoal para calor
        }
    }
},

// Exemplo de configuração para pessoa sensível ao frio
{
    module: "compliments",
    position: "lower_third",
    config: {
        weatherAware: true,
        personalPreferences: {
            coldSensitive: true,   // Muito sensível ao frio
            rainSensitive: true,
            windSensitive: true
        },
        customThresholds: {
            personalCold: 20,      // Considera frio acima de 20°C
            personalHot: 25
        },
        temperatureThresholds: {
            cold: 18,
            hot: 28
        }
    }
},

// Exemplo de configuração para pessoa sensível à chuva
{
    module: "compliments",
    position: "lower_third",
    config: {
        weatherAware: true,
        rainThreshold: 30,         // Avisa mesmo com pouca probabilidade de chuva
        personalPreferences: {
            coldSensitive: false,
            rainSensitive: true,   // Muito sensível à chuva
            windSensitive: true
        },
        forecastThresholds: {
            tempChange: 3,         // Avisa mudanças menores de temperatura
            rainProbability: 30    // Avisa mesmo com pouca probabilidade
        }
    }
}
