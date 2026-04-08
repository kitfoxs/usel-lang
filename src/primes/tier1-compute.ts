/**
 * USEL Tier 1 — Computational Extensions
 *
 * The 65 NSM primes (Tier 0) provide semantic grounding but CANNOT achieve
 * Turing completeness alone. These ~120 derived primitives close the gap,
 * each explicated in terms of Tier 0 NSM meanings.
 *
 * Categories: math · data · control · type · function · io · compare
 * Validated by Model Council (GPT + Claude) — June 2025
 */

import type { USELSymbol, ComputeCategory, ConnectionSlot } from './types';
import { CATEGORY_COLORS } from './types';

// ---------------------------------------------------------------------------
// Helper — stamps shared fields so every entry stays DRY
// ---------------------------------------------------------------------------
function compute(
  id: string,
  name: string,
  category: ComputeCategory,
  level: 2 | 3,
  glyph: string,
  accepts: ConnectionSlot[],
  provides: ConnectionSlot[],
  pronunciation: Record<string, string>,
  nsmDefinition: string,
  description: string,
): USELSymbol {
  return {
    id: `COMPUTE_${id}`,
    name,
    tier: 1,
    category,
    level,
    glyph,
    color: CATEGORY_COLORS[category],
    accepts,
    provides,
    pronunciation,
    nsmDefinition,
    description,
  };
}

// ===========================================================================
//  MATH  (~20 primitives)
// ===========================================================================
const MATH: USELSymbol[] = [
  compute('ADD', 'Add', 'math', 2, '➕',
    ['value'], ['operator'],
    { en: 'add', es: 'sumar', zh: '加', ar: 'جمع' },
    'DO SOMETHING: make MORE of NUMBER',
    'Combine two values to produce their sum'),

  compute('SUBTRACT', 'Subtract', 'math', 2, '➖',
    ['value'], ['operator'],
    { en: 'subtract', es: 'restar', zh: '减', ar: 'طرح' },
    'DO SOMETHING: make LESS of NUMBER',
    'Remove one value from another to produce the difference'),

  compute('MULTIPLY', 'Multiply', 'math', 2, '✖️',
    ['value'], ['operator'],
    { en: 'multiply', es: 'multiplicar', zh: '乘', ar: 'ضرب' },
    'DO SOMETHING: make NUMBER MANY TIMES MORE',
    'Scale a value by repeating it a given number of times'),

  compute('DIVIDE', 'Divide', 'math', 2, '➗',
    ['value'], ['operator'],
    { en: 'divide', es: 'dividir', zh: '除', ar: 'قسمة' },
    'DO SOMETHING: make PARTS of NUMBER',
    'Split a value into equal portions'),

  compute('POWER', 'Power', 'math', 3, '🔺',
    ['value'], ['operator'],
    { en: 'power', es: 'potencia', zh: '幂', ar: 'قوة' },
    'DO SOMETHING: make NUMBER MULTIPLY by ITSELF MANY TIMES',
    'Raise a value to the exponent of another'),

  compute('MODULO', 'Modulo', 'math', 3, '🔢',
    ['value'], ['operator'],
    { en: 'modulo', es: 'módulo', zh: '取模', ar: 'باقي' },
    'DO SOMETHING: know WHAT PART IS LEFT AFTER DIVIDE',
    'Compute the remainder after integer division'),

  compute('ABSOLUTE', 'Absolute', 'math', 2, '|N|',
    ['value'], ['operator'],
    { en: 'absolute', es: 'absoluto', zh: '绝对值', ar: 'مطلق' },
    'DO SOMETHING: IF NUMBER is LESS THAN NOTHING, make it NOT LESS THAN NOTHING',
    'Return the non-negative magnitude of a value'),

  compute('ROUND', 'Round', 'math', 2, '🔵',
    ['value'], ['operator'],
    { en: 'round', es: 'redondear', zh: '四舍五入', ar: 'تقريب' },
    'DO SOMETHING: make NUMBER NEAR WHOLE',
    'Adjust a decimal to the nearest integer'),

  compute('FLOOR', 'Floor', 'math', 3, '⬇️',
    ['value'], ['operator'],
    { en: 'floor', es: 'piso', zh: '下取整', ar: 'أرضية' },
    'DO SOMETHING: make NUMBER the WHOLE PART NOT MORE',
    'Round a value down to the nearest integer'),

  compute('CEILING', 'Ceiling', 'math', 3, '⬆️',
    ['value'], ['operator'],
    { en: 'ceiling', es: 'techo', zh: '上取整', ar: 'سقف' },
    'DO SOMETHING: make NUMBER the WHOLE PART NOT LESS',
    'Round a value up to the nearest integer'),

  compute('MINIMUM', 'Minimum', 'math', 2, '⤓',
    ['value'], ['operator'],
    { en: 'minimum', es: 'mínimo', zh: '最小值', ar: 'أدنى' },
    'DO SOMETHING: know WHICH NUMBER is LESS THAN ALL OTHER',
    'Return the smallest of the given values'),

  compute('MAXIMUM', 'Maximum', 'math', 2, '⤒',
    ['value'], ['operator'],
    { en: 'maximum', es: 'máximo', zh: '最大值', ar: 'أقصى' },
    'DO SOMETHING: know WHICH NUMBER is MORE THAN ALL OTHER',
    'Return the largest of the given values'),

  compute('RANDOM', 'Random', 'math', 3, '🎲',
    ['value'], ['operator'],
    { en: 'random', es: 'aleatorio', zh: '随机', ar: 'عشوائي' },
    'DO SOMETHING: make a NUMBER, SOMEONE CANNOT KNOW WHICH BEFORE',
    'Generate a non-deterministic value within a range'),

  compute('SQUARE_ROOT', 'Square Root', 'math', 3, '√',
    ['value'], ['operator'],
    { en: 'square root', es: 'raíz cuadrada', zh: '平方根', ar: 'جذر تربيعي' },
    'DO SOMETHING: know WHICH NUMBER MULTIPLIED by ITSELF IS THIS NUMBER',
    'Compute the principal square root of a value'),

  compute('NEGATE', 'Negate', 'math', 2, '±',
    ['value'], ['operator'],
    { en: 'negate', es: 'negar', zh: '取反', ar: 'نفي' },
    'DO SOMETHING: IF NUMBER is MORE THAN NOTHING, make it LESS; IF LESS, make it MORE',
    'Flip the sign of a numeric value'),

  compute('INCREMENT', 'Increment', 'math', 2, '⊕',
    ['value'], ['operator'],
    { en: 'increment', es: 'incrementar', zh: '递增', ar: 'زيادة' },
    'DO SOMETHING: make NUMBER ONE MORE',
    'Increase a value by one'),

  compute('DECREMENT', 'Decrement', 'math', 2, '⊖',
    ['value'], ['operator'],
    { en: 'decrement', es: 'decrementar', zh: '递减', ar: 'إنقاص' },
    'DO SOMETHING: make NUMBER ONE LESS',
    'Decrease a value by one'),

  compute('SUM', 'Sum', 'math', 2, 'Σ',
    ['value'], ['operator'],
    { en: 'sum', es: 'suma', zh: '总和', ar: 'مجموع' },
    'DO SOMETHING: ADD ALL NUMBERS in a KIND OF THING',
    'Compute the total of all values in a collection'),

  compute('AVERAGE', 'Average', 'math', 3, 'x̄',
    ['value'], ['operator'],
    { en: 'average', es: 'promedio', zh: '平均', ar: 'متوسط' },
    'DO SOMETHING: ADD ALL NUMBERS, DIVIDE by HOW MANY',
    'Compute the arithmetic mean of a collection'),

  compute('REMAINDER', 'Remainder', 'math', 3, '%',
    ['value'], ['operator'],
    { en: 'remainder', es: 'resto', zh: '余数', ar: 'متبقي' },
    'DO SOMETHING: know WHAT IS LEFT AFTER DIVIDE, can be LESS THAN NOTHING',
    'Compute the signed remainder after truncating division'),
];

// ===========================================================================
//  DATA STRUCTURES  (~20 primitives)
// ===========================================================================
const DATA: USELSymbol[] = [
  compute('LIST', 'List', 'data', 2, '📋',
    ['value'], ['value'],
    { en: 'list', es: 'lista', zh: '列表', ar: 'قائمة' },
    'a KIND OF THING: MANY THINGS, ONE AFTER ANOTHER',
    'An ordered sequence of values'),

  compute('MAP', 'Map', 'data', 2, '🗺️',
    ['value'], ['value'],
    { en: 'map', es: 'mapa', zh: '映射', ar: 'خريطة' },
    'a KIND OF THING: MANY PAIRS, EACH PAIR is a WORD and a THING',
    'A collection of key-value associations'),

  compute('SET', 'Set', 'data', 2, '🔘',
    ['value'], ['value'],
    { en: 'set', es: 'conjunto', zh: '集合', ar: 'مجموعة' },
    'a KIND OF THING: MANY THINGS, NOT THE SAME, no ORDER',
    'An unordered collection of unique values'),

  compute('PAIR', 'Pair', 'data', 2, '🔗',
    ['value'], ['value'],
    { en: 'pair', es: 'par', zh: '对', ar: 'زوج' },
    'a KIND OF THING: TWO THINGS TOGETHER',
    'A tuple of exactly two associated values'),

  compute('QUEUE', 'Queue', 'data', 3, '🚶',
    ['value'], ['value'],
    { en: 'queue', es: 'cola', zh: '队列', ar: 'طابور' },
    'a KIND OF THING: MANY THINGS, FIRST ONE IN is FIRST ONE OUT',
    'A first-in-first-out sequential container'),

  compute('STACK', 'Stack', 'data', 3, '📚',
    ['value'], ['value'],
    { en: 'stack', es: 'pila', zh: '栈', ar: 'رصة' },
    'a KIND OF THING: MANY THINGS, LAST ONE IN is FIRST ONE OUT',
    'A last-in-first-out sequential container'),

  compute('TREE', 'Tree', 'data', 3, '🌳',
    ['value'], ['value'],
    { en: 'tree', es: 'árbol', zh: '树', ar: 'شجرة' },
    'a KIND OF THING: THINGS INSIDE OTHER THINGS, LIKE PARTS OF A BIG THING',
    'A hierarchical structure of nested nodes'),

  compute('GET', 'Get', 'data', 2, '📥',
    ['value'], ['value'],
    { en: 'get', es: 'obtener', zh: '获取', ar: 'احصل' },
    'DO SOMETHING: know WHAT THING is in a PLACE in a KIND OF THING',
    'Retrieve a value from a container at a given position or key'),

  compute('PUT', 'Put', 'data', 2, '📤',
    ['value'], ['value'],
    { en: 'put', es: 'poner', zh: '放置', ar: 'ضع' },
    'DO SOMETHING: make a THING be in a PLACE in a KIND OF THING',
    'Insert or update a value in a container'),

  compute('REMOVE', 'Remove', 'data', 2, '🗑️',
    ['value'], ['value'],
    { en: 'remove', es: 'eliminar', zh: '移除', ar: 'إزالة' },
    'DO SOMETHING: make a THING NOT be in a KIND OF THING ANYMORE',
    'Delete a value from a container'),

  compute('LENGTH', 'Length', 'data', 2, '📏',
    ['value'], ['value'],
    { en: 'length', es: 'longitud', zh: '长度', ar: 'طول' },
    'DO SOMETHING: know HOW MANY THINGS are in a KIND OF THING',
    'Return the count of elements in a container'),

  compute('CONTAINS', 'Contains', 'data', 2, '🔍',
    ['value'], ['value'],
    { en: 'contains', es: 'contiene', zh: '包含', ar: 'يحتوي' },
    'DO SOMETHING: know IF a THING is INSIDE a KIND OF THING',
    'Test whether a container includes a given value'),

  compute('EMPTY', 'Empty', 'data', 2, '⬜',
    ['value'], ['value'],
    { en: 'empty', es: 'vacío', zh: '空', ar: 'فارغ' },
    'a KIND OF THING: NOTHING is INSIDE',
    'A container with zero elements, or the act of clearing one'),

  compute('FIRST', 'First', 'data', 2, '⏮️',
    ['value'], ['value'],
    { en: 'first', es: 'primero', zh: '第一', ar: 'أول' },
    'DO SOMETHING: know WHICH THING is BEFORE ALL OTHER in a KIND OF THING',
    'Retrieve the initial element of an ordered container'),

  compute('LAST', 'Last', 'data', 2, '⏭️',
    ['value'], ['value'],
    { en: 'last', es: 'último', zh: '最后', ar: 'آخر' },
    'DO SOMETHING: know WHICH THING is AFTER ALL OTHER in a KIND OF THING',
    'Retrieve the final element of an ordered container'),

  compute('SORT', 'Sort', 'data', 3, '🔀',
    ['value'], ['value'],
    { en: 'sort', es: 'ordenar', zh: '排序', ar: 'ترتيب' },
    'DO SOMETHING: make THINGS in a KIND OF THING be ONE AFTER ANOTHER by a RULE',
    'Arrange elements of a container according to a comparator'),

  compute('FILTER', 'Filter', 'data', 2, '🔎',
    ['value'], ['value'],
    { en: 'filter', es: 'filtrar', zh: '过滤', ar: 'تصفية' },
    'DO SOMETHING: keep ONLY THINGS in a KIND OF THING IF SOMETHING is TRUE ABOUT THEM',
    'Select elements from a container that satisfy a predicate'),

  compute('TRANSFORM', 'Transform', 'data', 2, '🔄',
    ['value'], ['value'],
    { en: 'transform', es: 'transformar', zh: '转换', ar: 'تحويل' },
    'DO SOMETHING: make EACH THING in a KIND OF THING BECOME SOMETHING ELSE',
    'Apply a function to every element, producing a new container'),

  compute('MERGE', 'Merge', 'data', 3, '🔗',
    ['value'], ['value'],
    { en: 'merge', es: 'fusionar', zh: '合并', ar: 'دمج' },
    'DO SOMETHING: make TWO KINDS OF THING BECOME ONE KIND OF THING',
    'Combine two containers into a single container'),

  compute('FLATTEN', 'Flatten', 'data', 3, '📃',
    ['value'], ['value'],
    { en: 'flatten', es: 'aplanar', zh: '展平', ar: 'تسطيح' },
    'DO SOMETHING: IF a KIND OF THING HAS KINDS OF THING INSIDE, make ALL THINGS be in ONE KIND OF THING',
    'Reduce nested containers into a single-level container'),
];

// ===========================================================================
//  CONTROL FLOW  (~20 primitives)
// ===========================================================================
const CONTROL: USELSymbol[] = [
  compute('LOOP', 'Loop', 'control', 2, '🔁',
    ['condition'], ['predicate'],
    { en: 'loop', es: 'bucle', zh: '循环', ar: 'حلقة' },
    'DO SOMETHING MANY TIMES: AGAIN and AGAIN',
    'Repeat a block of operations indefinitely or until stopped'),

  compute('WHILE', 'While', 'control', 2, '🔂',
    ['condition'], ['predicate'],
    { en: 'while', es: 'mientras', zh: '当', ar: 'بينما' },
    'DO SOMETHING MANY TIMES: IF SOMETHING is TRUE, DO AGAIN; IF NOT TRUE, STOP',
    'Repeat a block while a condition remains true'),

  compute('FOR_EACH', 'For Each', 'control', 2, '🔃',
    ['condition'], ['predicate'],
    { en: 'for each', es: 'para cada', zh: '对每个', ar: 'لكل' },
    'DO SOMETHING: FOR EACH THING in a KIND OF THING, DO SOMETHING WITH THIS THING',
    'Iterate over every element in a container'),

  compute('REPEAT', 'Repeat', 'control', 2, '🔄',
    ['condition'], ['predicate'],
    { en: 'repeat', es: 'repetir', zh: '重复', ar: 'تكرار' },
    'DO SOMETHING: DO THE SAME THING a NUMBER of TIMES',
    'Execute a block a specified number of times'),

  compute('BREAK', 'Break', 'control', 2, '🛑',
    ['condition'], ['predicate'],
    { en: 'break', es: 'romper', zh: '中断', ar: 'كسر' },
    'DO SOMETHING: STOP DOING SOMETHING AGAIN, MOVE AFTER',
    'Exit the current loop immediately'),

  compute('CONTINUE', 'Continue', 'control', 2, '⏩',
    ['condition'], ['predicate'],
    { en: 'continue', es: 'continuar', zh: '继续', ar: 'استمر' },
    'DO SOMETHING: STOP THIS TIME, GO BACK to DO AGAIN from the START',
    'Skip the rest of the current iteration and proceed to the next'),

  compute('RETURN', 'Return', 'control', 2, '↩️',
    ['condition'], ['predicate'],
    { en: 'return', es: 'retornar', zh: '返回', ar: 'إرجاع' },
    'DO SOMETHING: STOP, GIVE BACK a THING to WHO SAID DO THIS',
    'Exit the current function and optionally provide a result'),

  compute('TRY', 'Try', 'control', 2, '🛡️',
    ['condition'], ['predicate'],
    { en: 'try', es: 'intentar', zh: '尝试', ar: 'حاول' },
    'DO SOMETHING: WANT TO DO, MAYBE SOMETHING BAD HAPPENS',
    'Attempt an operation that might fail'),

  compute('CATCH', 'Catch', 'control', 2, '🥅',
    ['condition'], ['predicate'],
    { en: 'catch', es: 'capturar', zh: '捕获', ar: 'التقاط' },
    'DO SOMETHING: IF SOMETHING BAD HAPPENED in TRY, DO THIS INSTEAD',
    'Handle an error produced during a try block'),

  compute('THROW', 'Throw', 'control', 2, '💥',
    ['condition'], ['predicate'],
    { en: 'throw', es: 'lanzar', zh: '抛出', ar: 'رمي' },
    'DO SOMETHING: SAY SOMETHING BAD HAPPENED, STOP',
    'Signal an error condition to be caught upstream'),

  compute('WAIT', 'Wait', 'control', 2, '⏳',
    ['condition'], ['predicate'],
    { en: 'wait', es: 'esperar', zh: '等待', ar: 'انتظر' },
    'NOT DO SOMETHING FOR SOME TIME',
    'Pause execution for a specified duration or until an event'),

  compute('PARALLEL', 'Parallel', 'control', 3, '⏸️',
    ['condition'], ['predicate'],
    { en: 'parallel', es: 'paralelo', zh: '并行', ar: 'متوازي' },
    'DO MANY THINGS AT THE SAME TIME',
    'Execute multiple operations concurrently'),

  compute('SEQUENCE', 'Sequence', 'control', 2, '▶️',
    ['condition'], ['predicate'],
    { en: 'sequence', es: 'secuencia', zh: '序列', ar: 'تسلسل' },
    'DO THINGS ONE AFTER ANOTHER',
    'Execute operations in strict left-to-right order'),

  compute('CHOOSE', 'Choose', 'control', 2, '🔀',
    ['condition'], ['predicate'],
    { en: 'choose', es: 'elegir', zh: '选择', ar: 'اختر' },
    'DO SOMETHING: LOOK AT SOMETHING, DO ONE THING OR ANOTHER THING BECAUSE OF IT',
    'Branch execution based on a condition (if-else)'),

  compute('MATCH', 'Match', 'control', 3, '🎯',
    ['condition'], ['predicate'],
    { en: 'match', es: 'coincidir', zh: '匹配', ar: 'مطابقة' },
    'DO SOMETHING: LOOK AT a THING, FIND WHICH KIND IT IS, DO THAT KIND\'S THING',
    'Select a branch based on structural pattern matching'),

  compute('WHEN', 'When', 'control', 2, '🕐',
    ['condition'], ['predicate'],
    { en: 'when', es: 'cuando', zh: '当…时', ar: 'عندما' },
    'IF SOMETHING is TRUE AT THIS TIME, DO SOMETHING',
    'Execute a block only when a specified condition is met'),

  compute('OTHERWISE', 'Otherwise', 'control', 2, '↪️',
    ['condition'], ['predicate'],
    { en: 'otherwise', es: 'de lo contrario', zh: '否则', ar: 'وإلا' },
    'IF NOTHING BEFORE WAS TRUE, DO THIS',
    'Default branch when no prior condition matched'),

  compute('EXIT', 'Exit', 'control', 2, '🚪',
    ['condition'], ['predicate'],
    { en: 'exit', es: 'salir', zh: '退出', ar: 'خروج' },
    'STOP EVERYTHING, DO NOTHING MORE',
    'Terminate the entire program or current scope'),

  compute('SKIP', 'Skip', 'control', 2, '⏭️',
    ['condition'], ['predicate'],
    { en: 'skip', es: 'saltar', zh: '跳过', ar: 'تخطي' },
    'DO NOTHING THIS TIME, GO TO THE NEXT THING',
    'Bypass the current operation without effect'),

  compute('YIELD', 'Yield', 'control', 3, '🌱',
    ['condition'], ['predicate'],
    { en: 'yield', es: 'ceder', zh: '让出', ar: 'تنازل' },
    'DO SOMETHING: GIVE BACK a THING NOW, BUT DO NOT STOP, CAN DO MORE AFTER',
    'Produce a value and suspend execution until resumed'),
];

// ===========================================================================
//  TYPES  (~15 primitives)
// ===========================================================================
const TYPES: USELSymbol[] = [
  compute('NUMBER', 'Number', 'type', 2, '#️⃣',
    ['value'], ['value'],
    { en: 'number', es: 'número', zh: '数字', ar: 'رقم' },
    'a KIND OF THING: SOMETHING SOMEONE CAN COUNT or MEASURE',
    'The general numeric type encompassing integers and decimals'),

  compute('TEXT', 'Text', 'type', 2, '📝',
    ['value'], ['value'],
    { en: 'text', es: 'texto', zh: '文本', ar: 'نص' },
    'a KIND OF THING: MANY WORDS, ONE AFTER ANOTHER',
    'An immutable sequence of characters'),

  compute('BOOLEAN', 'Boolean', 'type', 2, '⚡',
    ['value'], ['value'],
    { en: 'boolean', es: 'booleano', zh: '布尔', ar: 'منطقي' },
    'a KIND OF THING: TRUE or NOT TRUE, NOTHING ELSE',
    'A logical value that is either true or false'),

  compute('NULL', 'Null', 'type', 2, '∅',
    ['value'], ['value'],
    { en: 'null', es: 'nulo', zh: '空值', ar: 'فارغ' },
    'NOTHING, NO THING',
    'The explicit absence of any value'),

  compute('LIST_TYPE', 'List Type', 'type', 2, '📋',
    ['value'], ['value'],
    { en: 'list type', es: 'tipo lista', zh: '列表类型', ar: 'نوع قائمة' },
    'a KIND OF KIND: it says WHAT KIND OF THINGS can be INSIDE a LIST',
    'A parameterised type constraining the elements of a list'),

  compute('MAP_TYPE', 'Map Type', 'type', 2, '🗺️',
    ['value'], ['value'],
    { en: 'map type', es: 'tipo mapa', zh: '映射类型', ar: 'نوع خريطة' },
    'a KIND OF KIND: it says WHAT KIND OF WORDS and THINGS can be in a MAP',
    'A parameterised type constraining the keys and values of a map'),

  compute('CONVERT', 'Convert', 'type', 2, '🔄',
    ['value'], ['value'],
    { en: 'convert', es: 'convertir', zh: '转换', ar: 'تحويل' },
    'DO SOMETHING: make a THING BECOME ANOTHER KIND OF THING',
    'Cast or coerce a value from one type to another'),

  compute('IS_TYPE', 'Is Type', 'type', 2, '❓',
    ['value'], ['value'],
    { en: 'is type', es: 'es tipo', zh: '是类型', ar: 'هل نوع' },
    'DO SOMETHING: know IF a THING IS a KIND',
    'Test whether a value belongs to a given type'),

  compute('ANY', 'Any', 'type', 2, '🌐',
    ['value'], ['value'],
    { en: 'any', es: 'cualquiera', zh: '任意', ar: 'أي' },
    'a KIND OF THING: ALL KINDS, it can be ANYTHING',
    'The universal type that accepts all values'),

  compute('NOTHING', 'Nothing', 'type', 2, '🚫',
    ['value'], ['value'],
    { en: 'nothing', es: 'nada', zh: '无', ar: 'لا شيء' },
    'a KIND OF THING: NO KIND, NOTHING can be THIS',
    'The bottom type inhabited by no values'),

  compute('INTEGER', 'Integer', 'type', 2, '🔢',
    ['value'], ['value'],
    { en: 'integer', es: 'entero', zh: '整数', ar: 'عدد صحيح' },
    'a KIND OF NUMBER: WHOLE, NO PARTS AFTER',
    'A numeric type with no fractional component'),

  compute('DECIMAL', 'Decimal', 'type', 2, '🔣',
    ['value'], ['value'],
    { en: 'decimal', es: 'decimal', zh: '小数', ar: 'عشري' },
    'a KIND OF NUMBER: CAN HAVE PARTS AFTER a POINT',
    'A numeric type that supports fractional values'),

  compute('CHARACTER', 'Character', 'type', 3, '🔤',
    ['value'], ['value'],
    { en: 'character', es: 'carácter', zh: '字符', ar: 'حرف' },
    'a KIND OF THING: ONE PART OF WORDS',
    'A single Unicode code point'),

  compute('BYTE', 'Byte', 'type', 3, '💾',
    ['value'], ['value'],
    { en: 'byte', es: 'byte', zh: '字节', ar: 'بايت' },
    'a KIND OF THING: a SMALL NUMBER, from NOTHING to 255',
    'An 8-bit unsigned integer for raw data'),

  compute('TIMESTAMP', 'Timestamp', 'type', 3, '🕰️',
    ['value'], ['value'],
    { en: 'timestamp', es: 'marca de tiempo', zh: '时间戳', ar: 'طابع زمني' },
    'a KIND OF THING: a TIME WHEN SOMETHING HAPPENED',
    'A point in time represented as an absolute instant'),
];

// ===========================================================================
//  FUNCTIONS  (~15 primitives)
// ===========================================================================
const FUNCTIONS: USELSymbol[] = [
  compute('DEFINE', 'Define', 'function', 2, '📐',
    [], ['predicate'],
    { en: 'define', es: 'definir', zh: '定义', ar: 'تعريف' },
    'SAY WHAT a WORD MEANS: THIS WORD MEANS DO THESE THINGS',
    'Bind a name to a reusable block of operations'),

  compute('CALL', 'Call', 'function', 2, '📞',
    [], ['predicate'],
    { en: 'call', es: 'llamar', zh: '调用', ar: 'استدعاء' },
    'DO SOMETHING: SAY a WORD THAT MEANS DO THINGS, THOSE THINGS HAPPEN',
    'Invoke a previously defined function'),

  compute('GIVE_BACK', 'Give Back', 'function', 2, '🎁',
    [], ['predicate'],
    { en: 'give back', es: 'devolver', zh: '返还', ar: 'إعادة' },
    'DO SOMETHING: WHEN THINGS ARE DONE, GIVE a THING BACK to WHO SAID DO THIS',
    'Specify the return value of a function'),

  compute('PARAMETER', 'Parameter', 'function', 2, '📎',
    [], ['predicate'],
    { en: 'parameter', es: 'parámetro', zh: '参数', ar: 'معامل' },
    'a THING SOMEONE GIVES WHEN THEY SAY DO THIS',
    'Declare an input slot for a function'),

  compute('RESULT', 'Result', 'function', 2, '🏆',
    [], ['predicate'],
    { en: 'result', es: 'resultado', zh: '结果', ar: 'نتيجة' },
    'a THING THAT COMES BACK AFTER DOING SOMETHING',
    'The output type annotation of a function'),

  compute('COMPOSE', 'Compose', 'function', 3, '🔗',
    [], ['predicate'],
    { en: 'compose', es: 'componer', zh: '组合', ar: 'تركيب' },
    'DO SOMETHING: MAKE ONE THING FROM TWO THINGS THAT DO, SECOND DOES FIRST, THEN FIRST DOES',
    'Chain two functions so output of one feeds input of another'),

  compute('APPLY', 'Apply', 'function', 3, '🎯',
    [], ['predicate'],
    { en: 'apply', es: 'aplicar', zh: '应用', ar: 'تطبيق' },
    'DO SOMETHING: USE a THING THAT DOES on SOME THINGS',
    'Invoke a function with an explicit argument list'),

  compute('BIND', 'Bind', 'function', 3, '🪢',
    [], ['predicate'],
    { en: 'bind', es: 'vincular', zh: '绑定', ar: 'ربط' },
    'DO SOMETHING: GIVE SOME THINGS to a THING THAT DOES NOW, DO LATER WITH LESS THINGS',
    'Partially apply arguments to a function, returning a new function'),

  compute('CURRY', 'Curry', 'function', 3, '🍛',
    [], ['predicate'],
    { en: 'curry', es: 'currificar', zh: '柯里化', ar: 'كاري' },
    'DO SOMETHING: MAKE a THING THAT DOES TAKE ONE THING AT a TIME',
    'Transform a multi-argument function into a chain of single-argument functions'),

  compute('RECURSE', 'Recurse', 'function', 3, '🪞',
    [], ['predicate'],
    { en: 'recurse', es: 'recurrir', zh: '递归', ar: 'تكرار ذاتي' },
    'DO SOMETHING: a THING THAT DOES SAYS DO ITSELF AGAIN INSIDE',
    'A function that invokes itself to solve sub-problems'),

  compute('MEMOIZE', 'Memoize', 'function', 3, '🧠',
    [], ['predicate'],
    { en: 'memoize', es: 'memorizar', zh: '记忆化', ar: 'حفظ' },
    'DO SOMETHING: REMEMBER WHAT CAME BACK BEFORE, IF SAME THINGS GIVEN, GIVE SAME BACK FAST',
    'Cache function results to avoid redundant computation'),

  compute('CLOSURE', 'Closure', 'function', 3, '📦',
    [], ['predicate'],
    { en: 'closure', es: 'clausura', zh: '闭包', ar: 'إغلاق' },
    'a THING THAT DOES: IT KNOWS THINGS FROM WHERE IT WAS MADE, EVEN WHEN FAR AWAY',
    'A function that captures variables from its enclosing scope'),

  compute('ASYNC', 'Async', 'function', 3, '⚡',
    [], ['predicate'],
    { en: 'async', es: 'asíncrono', zh: '异步', ar: 'غير متزامن' },
    'DO SOMETHING: START DOING, DO NOT WAIT, OTHER THINGS CAN HAPPEN',
    'Mark a function as asynchronous, returning a promise'),

  compute('AWAIT', 'Await', 'function', 3, '⏰',
    [], ['predicate'],
    { en: 'await', es: 'esperar', zh: '等待', ar: 'انتظار' },
    'DO SOMETHING: WAIT for a THING THAT WAS STARTED BEFORE to BE DONE',
    'Suspend execution until an asynchronous result is available'),

  compute('CALLBACK', 'Callback', 'function', 3, '📲',
    [], ['predicate'],
    { en: 'callback', es: 'retrollamada', zh: '回调', ar: 'استرجاع' },
    'a THING THAT DOES: SOMEONE GIVES IT, IT WILL BE DONE LATER WHEN SOMETHING HAPPENS',
    'A function passed as an argument to be invoked later'),
];

// ===========================================================================
//  IO  (~15 primitives)
// ===========================================================================
const IO: USELSymbol[] = [
  compute('READ_INPUT', 'Read Input', 'io', 2, '⌨️',
    ['value'], ['predicate'],
    { en: 'read input', es: 'leer entrada', zh: '读取输入', ar: 'قراءة إدخال' },
    'DO SOMETHING: KNOW WHAT SOMEONE SAID or WROTE',
    'Accept data from a user or external source'),

  compute('WRITE_OUTPUT', 'Write Output', 'io', 2, '🖊️',
    ['value'], ['predicate'],
    { en: 'write output', es: 'escribir salida', zh: '写出', ar: 'كتابة إخراج' },
    'DO SOMETHING: SAY or SHOW a THING to SOMEONE',
    'Emit data to a user-facing destination'),

  compute('SHOW_DISPLAY', 'Show Display', 'io', 2, '🖥️',
    ['value'], ['predicate'],
    { en: 'show display', es: 'mostrar pantalla', zh: '显示', ar: 'عرض شاشة' },
    'DO SOMETHING: make SOMEONE SEE a THING on a PLACE WHERE THINGS CAN BE SEEN',
    'Render data visually on a display surface'),

  compute('ASK_USER', 'Ask User', 'io', 2, '💬',
    ['value'], ['predicate'],
    { en: 'ask user', es: 'preguntar usuario', zh: '询问用户', ar: 'اسأل المستخدم' },
    'DO SOMETHING: SAY SOMETHING, WANT TO KNOW WHAT SOMEONE THINKS',
    'Prompt a user for interactive input'),

  compute('PRINT', 'Print', 'io', 2, '🖨️',
    ['value'], ['predicate'],
    { en: 'print', es: 'imprimir', zh: '打印', ar: 'طباعة' },
    'DO SOMETHING: SHOW WORDS for SOMEONE to SEE',
    'Output text to the standard output stream'),

  compute('LOG', 'Log', 'io', 2, '📓',
    ['value'], ['predicate'],
    { en: 'log', es: 'registrar', zh: '日志', ar: 'سجل' },
    'DO SOMETHING: WRITE WHAT HAPPENED, SOMEONE CAN LOOK LATER',
    'Record diagnostic information for later inspection'),

  compute('OPEN_FILE', 'Open File', 'io', 3, '📂',
    ['value'], ['predicate'],
    { en: 'open file', es: 'abrir archivo', zh: '打开文件', ar: 'فتح ملف' },
    'DO SOMETHING: make a THING on a MACHINE READY so SOMEONE CAN READ or WRITE',
    'Acquire a handle to a file resource'),

  compute('CLOSE_FILE', 'Close File', 'io', 3, '📁',
    ['value'], ['predicate'],
    { en: 'close file', es: 'cerrar archivo', zh: '关闭文件', ar: 'إغلاق ملف' },
    'DO SOMETHING: SAY to a MACHINE a THING is NOT NEEDED NOW',
    'Release a previously acquired file handle'),

  compute('READ_FILE', 'Read File', 'io', 3, '📖',
    ['value'], ['predicate'],
    { en: 'read file', es: 'leer archivo', zh: '读文件', ar: 'قراءة ملف' },
    'DO SOMETHING: KNOW WHAT IS INSIDE a THING on a MACHINE',
    'Load the contents of a file into memory'),

  compute('WRITE_FILE', 'Write File', 'io', 3, '✍️',
    ['value'], ['predicate'],
    { en: 'write file', es: 'escribir archivo', zh: '写文件', ar: 'كتابة ملف' },
    'DO SOMETHING: PUT WORDS or THINGS INSIDE a THING on a MACHINE',
    'Persist data to a file resource'),

  compute('SEND_MESSAGE', 'Send Message', 'io', 3, '📨',
    ['value'], ['predicate'],
    { en: 'send message', es: 'enviar mensaje', zh: '发送消息', ar: 'إرسال رسالة' },
    'DO SOMETHING: make WORDS GO FROM HERE to SOMEWHERE ELSE',
    'Transmit data to another process or network endpoint'),

  compute('RECEIVE_MESSAGE', 'Receive Message', 'io', 3, '📩',
    ['value'], ['predicate'],
    { en: 'receive message', es: 'recibir mensaje', zh: '接收消息', ar: 'استقبال رسالة' },
    'DO SOMETHING: KNOW WHAT WORDS CAME FROM SOMEWHERE ELSE',
    'Accept data arriving from another process or network endpoint'),

  compute('CONNECT', 'Connect', 'io', 3, '🔌',
    ['value'], ['predicate'],
    { en: 'connect', es: 'conectar', zh: '连接', ar: 'اتصال' },
    'DO SOMETHING: make a WAY FROM HERE to SOMEWHERE ELSE',
    'Establish a communication channel to a remote endpoint'),

  compute('DISCONNECT', 'Disconnect', 'io', 3, '🔓',
    ['value'], ['predicate'],
    { en: 'disconnect', es: 'desconectar', zh: '断开', ar: 'قطع اتصال' },
    'DO SOMETHING: STOP the WAY FROM HERE to SOMEWHERE ELSE',
    'Close an established communication channel'),

  compute('LISTEN', 'Listen', 'io', 3, '👂',
    ['value'], ['predicate'],
    { en: 'listen', es: 'escuchar', zh: '监听', ar: 'استماع' },
    'DO SOMETHING: WAIT for WORDS to COME FROM SOMEWHERE ELSE',
    'Await incoming connections or messages on a channel'),
];

// ===========================================================================
//  COMPARE  (~15 primitives)
// ===========================================================================
const COMPARE: USELSymbol[] = [
  compute('EQUAL', 'Equal', 'compare', 2, '⚖️',
    ['value'], ['condition'],
    { en: 'equal', es: 'igual', zh: '等于', ar: 'يساوي' },
    'KNOW: THIS THING is THE SAME AS THAT THING',
    'Test structural equality between two values'),

  compute('NOT_EQUAL', 'Not Equal', 'compare', 2, '≠',
    ['value'], ['condition'],
    { en: 'not equal', es: 'no igual', zh: '不等于', ar: 'لا يساوي' },
    'KNOW: THIS THING is NOT THE SAME AS THAT THING',
    'Test that two values are structurally different'),

  compute('GREATER', 'Greater', 'compare', 2, '>',
    ['value'], ['condition'],
    { en: 'greater', es: 'mayor', zh: '大于', ar: 'أكبر' },
    'KNOW: THIS THING is MORE THAN THAT THING',
    'Test that the left value exceeds the right'),

  compute('LESS', 'Less', 'compare', 2, '<',
    ['value'], ['condition'],
    { en: 'less', es: 'menor', zh: '小于', ar: 'أصغر' },
    'KNOW: THIS THING is LESS THAN THAT THING',
    'Test that the left value is below the right'),

  compute('GREATER_EQUAL', 'Greater or Equal', 'compare', 2, '≥',
    ['value'], ['condition'],
    { en: 'greater or equal', es: 'mayor o igual', zh: '大于等于', ar: 'أكبر أو يساوي' },
    'KNOW: THIS THING is MORE THAN or THE SAME AS THAT THING',
    'Test that the left value is at least the right'),

  compute('LESS_EQUAL', 'Less or Equal', 'compare', 2, '≤',
    ['value'], ['condition'],
    { en: 'less or equal', es: 'menor o igual', zh: '小于等于', ar: 'أصغر أو يساوي' },
    'KNOW: THIS THING is LESS THAN or THE SAME AS THAT THING',
    'Test that the left value is at most the right'),

  compute('AND', 'And', 'compare', 2, '∧',
    ['value'], ['condition'],
    { en: 'and', es: 'y', zh: '与', ar: 'و' },
    'KNOW: THIS THING is TRUE AND THAT THING is TRUE',
    'Logical conjunction — true only when both operands are true'),

  compute('OR', 'Or', 'compare', 2, '∨',
    ['value'], ['condition'],
    { en: 'or', es: 'o', zh: '或', ar: 'أو' },
    'KNOW: THIS THING is TRUE OR THAT THING is TRUE (OR BOTH)',
    'Logical disjunction — true when at least one operand is true'),

  compute('XOR', 'Exclusive Or', 'compare', 3, '⊕',
    ['value'], ['condition'],
    { en: 'exclusive or', es: 'o exclusivo', zh: '异或', ar: 'أو حصري' },
    'KNOW: ONE of THESE TWO THINGS is TRUE, BUT NOT BOTH',
    'Logical exclusive disjunction — true when exactly one operand is true'),

  compute('NAND', 'Not And', 'compare', 3, '⊼',
    ['value'], ['condition'],
    { en: 'not and', es: 'no y', zh: '与非', ar: 'ليس و' },
    'KNOW: it is NOT TRUE THAT BOTH THINGS ARE TRUE',
    'Logical negated conjunction — false only when both operands are true'),

  compute('BETWEEN', 'Between', 'compare', 2, '↔️',
    ['value'], ['condition'],
    { en: 'between', es: 'entre', zh: '介于', ar: 'بين' },
    'KNOW: THIS THING is MORE THAN ONE THING AND LESS THAN ANOTHER',
    'Test that a value falls within an inclusive range'),

  compute('SAME_AS', 'Same As', 'compare', 2, '🟰',
    ['value'], ['condition'],
    { en: 'same as', es: 'igual que', zh: '等同', ar: 'نفس' },
    'KNOW: THIS THING IS TRULY THE SAME ONE THING, NOT JUST LIKE IT',
    'Test referential identity (same object in memory)'),

  compute('DIFFERENT', 'Different', 'compare', 2, '🔀',
    ['value'], ['condition'],
    { en: 'different', es: 'diferente', zh: '不同', ar: 'مختلف' },
    'KNOW: THIS THING IS NOT THE SAME ONE THING',
    'Test referential non-identity'),

  compute('IS_EMPTY', 'Is Empty', 'compare', 2, '🫙',
    ['value'], ['condition'],
    { en: 'is empty', es: 'está vacío', zh: '是否为空', ar: 'فارغ؟' },
    'KNOW: NOTHING IS INSIDE THIS KIND OF THING',
    'Test whether a container has zero elements'),

  compute('EXISTS', 'Exists', 'compare', 2, '✅',
    ['value'], ['condition'],
    { en: 'exists', es: 'existe', zh: '存在', ar: 'موجود' },
    'KNOW: THIS THING IS A THING, NOT NOTHING',
    'Test that a value is non-null and defined'),
];

// ===========================================================================
//  PUBLIC EXPORTS
// ===========================================================================

/** All 120 Tier 1 computational primitives */
export const TIER1_COMPUTE: USELSymbol[] = [
  ...MATH,
  ...DATA,
  ...CONTROL,
  ...TYPES,
  ...FUNCTIONS,
  ...IO,
  ...COMPARE,
];

/** Look-up table keyed by symbol id (e.g. "COMPUTE_ADD") */
export const COMPUTE_BY_ID: Record<string, USELSymbol> = Object.fromEntries(
  TIER1_COMPUTE.map((s) => [s.id, s]),
);
