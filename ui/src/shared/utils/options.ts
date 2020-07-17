import {Package, File, Expression, ObjectExpression} from 'src/types/ast'

export function setProperty(
  r: ObjectExpression,
  label: string,
  expr: Expression
): void {
  deleteProperty(r, label)
  r.properties.push({
    type: 'Property' as const,
    key: {type: 'Identifier' as const, name: label},
    value: expr,
  })
}

export function deleteProperty(r: ObjectExpression, label: string): void {
  r.properties = r.properties.filter(prop => {
    if (
      prop.key.type === 'Identifier' &&
      'name' in prop.key &&
      prop.key.name === label
    ) {
      return false
    }
    if (
      prop.key.type === 'StringLiteral' &&
      'value' in prop.key &&
      prop.key.value === label
    ) {
      return false
    }
    return true
  })
}

export function optionFromFile(f: File, name: string): Expression {
  for (const stmt of f.body) {
    if (
      stmt.type === 'OptionStatement' &&
      'assignment' in stmt &&
      'id' in stmt.assignment &&
      stmt.assignment.id.name === name
    ) {
      return stmt.assignment.init
    }
  }
}

export function optionFromPackage(p: Package, name: string): Expression {
  for (const file of p.files) {
    const expr = optionFromFile(file, name)
    if (expr) {
      return expr
    }
  }
}

export function setOption(f: File, name: string, expr: Expression): void {
  deleteOption(f, name)
  f.body.unshift({
    type: 'OptionStatement' as const,
    assignment: {
      type: 'VariableAssignment' as const,
      id: {type: 'Identifier' as const, name: name},
      init: expr,
    },
  })
}

export function deleteOption(f: File, name: string): void {
  f.body = f.body.filter(stmt => {
    if (
      stmt.type === 'OptionStatement' &&
      'assignment' in stmt &&
      'id' in stmt.assignment
    ) {
      return stmt.assignment.id.name !== name
    }
    return true
  })
}
