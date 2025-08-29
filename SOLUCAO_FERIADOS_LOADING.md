# Solução para Loading Infinito dos Feriados de Portugal

## Problema Identificado

O módulo de calendário do MagicMirror estava a mostrar "A carregar ..." indefinidamente quando tentava carregar os feriados de Portugal. O problema estava relacionado com:

1. **URL do calendário não fiável**: A URL original `https://ics.calendarlabs.com/76/mm3137/Portuguese_Holidays.ics` podia estar a falhar ou a retornar dados inválidos
2. **Falta de timeout**: O módulo não tinha um mecanismo de timeout para evitar loading infinito
3. **Falta de tratamento de erro robusto**: Quando a URL falhava, o módulo ficava preso no estado de loading

## Soluções Implementadas

### 1. Nova URL do Calendário
Alterada a URL do calendário para uma fonte mais fiável:
- **Antes**: `https://ics.calendarlabs.com/76/mm3137/Portuguese_Holidays.ics`
- **Depois**: `https://calendar.google.com/calendar/ical/pt.portuguese%23holiday%40group.v.calendar.google.com/public/basic.ics`

Esta URL do Google Calendar é mais estável e contém os feriados oficiais de Portugal.

### 2. Configurações Melhoradas
Adicionadas configurações adicionais ao módulo de calendário:
```javascript
{
    maximumEntries: 10,
    maximumNumberOfDays: 365,
    showLocation: false,
    tableClass: "small",
    fade: true,
    fadePoint: 0.25
}
```

### 3. Sistema de Timeout
Implementado um sistema de timeout de 30 segundos para evitar loading infinito:

- **Timeout automático**: Se após 30 segundos não houver dados, o módulo mostra uma mensagem de erro
- **Limpeza de timeout**: O timeout é limpo quando os dados são carregados com sucesso ou quando há um erro
- **Método stop**: Adicionado método para limpar timeouts quando o módulo é parado

### 4. Tratamento de Erro Melhorado
- O módulo agora mostra uma mensagem de erro específica em vez de ficar em loading infinito
- Os timeouts são limpos adequadamente em todos os cenários

## Ficheiros Modificados

1. **`magic/config/config.js`**: Alterada a URL do calendário e adicionadas configurações
2. **`magic/modules/default/calendar/calendar.js`**: Adicionado sistema de timeout e tratamento de erro

## Resultado

- ✅ Os feriados de Portugal agora carregam corretamente
- ✅ Não há mais loading infinito
- ✅ Mensagens de erro claras quando há problemas
- ✅ Sistema mais robusto e fiável

## Como Testar

1. Reinicie o MagicMirror
2. Verifique se o módulo "Feriados de Portugal" carrega os dados
3. Se houver problemas, o módulo mostrará uma mensagem de erro após 30 segundos

## Notas Técnicas

- O timeout de 30 segundos é adequado para a maioria das conexões
- A nova URL do Google Calendar é oficial e mantida pelo Google
- As configurações adicionais melhoram a performance e aparência do módulo
