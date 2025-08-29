# Melhorias no Calendário de Feriados de Portugal

## Melhorias Implementadas

### 1. Formato de Data Melhorado
- **Antes**: `Out 5°` (mês primeiro, depois dia)
- **Depois**: `5 Out` (dia primeiro, depois mês)
- **Benefício**: Mais natural em português e mais fácil de ler

### 2. Configurações de Exibição Otimizadas
```javascript
{
    // Formato de data: dia primeiro, depois mês
    dateFormat: "D MMM",
    // Formato para eventos de dia inteiro
    fullDayEventDateFormat: "D MMM",
    // Formato para datas de fim
    dateEndFormat: "HH:mm",
    // Mostrar apenas o próximo feriado com destaque
    urgency: 30,
    // Formato de tempo relativo para próximos eventos
    timeFormat: "relative",
    // Mostrar tempo hoje para eventos próximos
    showTimeToday: true,
    // Obter eventos relativos próximos
    getRelative: 30
}
```

### 3. Estilos CSS Personalizados
- **Feriados de hoje**: Destaque em verde com fundo
- **Feriados de amanhã**: Destaque em amarelo
- **Feriados passados**: Opacidade reduzida
- **Melhor legibilidade**: Fonte monospace para datas
- **Animações suaves**: Transições de 0.3s

### 4. Hierarquia Visual
- **Hoje**: Verde brilhante (#4caf50)
- **Amanhã**: Amarelo (#ffeb3b)
- **Próximos dias**: Azul claro (#e3f2fd)
- **Passados**: Cinza com opacidade reduzida

### 5. Melhorias de UX
- **Hover effects**: Destaque ao passar o rato
- **Espaçamento melhorado**: Entre eventos
- **Símbolos coloridos**: Laranja para o ícone do calendário
- **Fundo semi-transparente**: Melhor contraste

## Resultado Visual

### Antes:
```
Out 5°    Feriado Nacional
Out 26°   Feriado Municipal
Nov 1°    Todos os Santos
```

### Depois:
```
5 Out     Feriado Nacional
26 Out    Feriado Municipal
1 Nov     Todos os Santos
```

## Ficheiros Modificados

1. **`magic/config/config.js`**: Configurações de formato de data
2. **`magic/css/custom-calendar.css`**: Estilos personalizados
3. **`magic/MELHORIAS_CALENDARIO.md`**: Esta documentação

## Benefícios

- ✅ **Mais legível**: Formato de data natural em português
- ✅ **Hierarquia visual**: Destaque para feriados importantes
- ✅ **Melhor UX**: Animações e efeitos visuais
- ✅ **Acessibilidade**: Melhor contraste e legibilidade
- ✅ **Responsivo**: Adapta-se a diferentes tamanhos de ecrã

## Como Aplicar

1. Reinicie o MagicMirror
2. As melhorias serão aplicadas automaticamente
3. Os feriados agora aparecem com o formato "dia mês"
4. Destaques visuais para feriados próximos
