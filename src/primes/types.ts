export type PrimeCategory =
  | 'substantive' | 'relational' | 'determiner' | 'quantifier'
  | 'evaluator' | 'descriptor' | 'mental' | 'speech' | 'action'
  | 'existence' | 'life' | 'time' | 'space' | 'logical'
  | 'intensifier' | 'similarity';

export type ComputeCategory =
  | 'math' | 'data' | 'control' | 'type' | 'function' | 'io' | 'compare';

export type MoleculeCategory =
  | 'universal' | 'computing' | 'science' | 'social' | 'custom';

export type AccessLevel = 1 | 2 | 3;

export type ConnectionSlot =
  | 'subject' | 'predicate' | 'object'
  | 'modifier' | 'condition' | 'value' | 'operator';

export interface USELSymbol {
  id: string;
  name: string;
  tier: 0 | 1 | 2;
  category: PrimeCategory | ComputeCategory | MoleculeCategory;
  level: AccessLevel;
  glyph: string;
  color: string;
  svgPath?: string;
  accepts: ConnectionSlot[];
  provides: ConnectionSlot[];
  pronunciation: Record<string, string>;
  nsmDefinition?: string;
  description: string;
}

export interface USELNode {
  id: string;
  symbol: USELSymbol;
  children: USELNode[];
  position: { x: number; y: number };
}

export interface USELStatement {
  type: 'statement';
  nodes: USELNode[];
  condition?: USELStatement;
}

export interface USELAST {
  type: 'program';
  statements: USELStatement[];
  metadata: {
    version: string;
    level: AccessLevel;
    created: string;
  };
}

export interface GrammarRule {
  from: ConnectionSlot;
  to: ConnectionSlot[];
  description: string;
}

export interface CompilationResult {
  target: 'javascript' | 'python' | 'natural' | 'usel-text' | 'wasm';
  code: string;
  success: boolean;
  errors?: string[];
}

export const CATEGORY_COLORS: Record<string, string> = {
  substantive: '#E74C3C',
  relational:  '#E67E22',
  determiner:  '#F1C40F',
  quantifier:  '#2ECC71',
  evaluator:   '#1ABC9C',
  descriptor:  '#3498DB',
  mental:      '#9B59B6',
  speech:      '#E91E63',
  action:      '#FF5722',
  existence:   '#795548',
  life:        '#607D8B',
  time:        '#00BCD4',
  space:       '#4CAF50',
  logical:     '#2196F3',
  intensifier: '#FF9800',
  similarity:  '#9C27B0',
  math:        '#F44336',
  data:        '#00ACC1',
  control:     '#7C4DFF',
  type:        '#FF6F00',
  function:    '#D500F9',
  io:          '#00E676',
  compare:     '#448AFF',
  universal:   '#8D6E63',
  computing:   '#546E7A',
  science:     '#26A69A',
  social:      '#EF5350',
  custom:      '#78909C',
};
