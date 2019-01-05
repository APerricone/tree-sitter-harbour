module.exports = grammar({
  name: 'Harbour',
  rules: {
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.function_definition
      // TODO: other kinds of definitions
    ),

    function_definition: $ => seq(
      /func(t(i(o(n)?)?)?)?/i,
      $.identifier,
      $.parameter_list,
      repeat($.local_list),
      repeat($._statement)
    ),

    parameter_list: $ => seq(
      '(',
      commaSep($.identifier),
      ')'
    ),

    local_list: $ => seq(
        /loca(l)?/i,
        commaSep1($.identifier)
    ),
    
    _statement: $ => choice(
      $.assignment_statement,
      $.return_statement
      // TODO: other kinds of statements
    ),
    assignment_statement: $ => seq(
      $.identifier,
      ':=',
      $._expression

    ),

    return_statement: $ => seq(
      'return',
      $._expression
    ),

    _expression: $ => choice(
      $.identifier,
      $.unary_expression,
      $.binary_expression,
      $.number
      // TODO: other kinds of expressions
    ),
    unary_expression: $ => prec(3, choice(
        seq('-', $._expression),
        seq('!', $._expression),
        // ...
      )),
    
      binary_expression: $ => choice(
        prec.left(2, seq($._expression, '*', $._expression)),
        prec.left(2, seq($._expression, '/', $._expression)),
        prec.left(1, seq($._expression, '-', $._expression)),
        prec.left(1, seq($._expression, '+', $._expression)),
        // ...
      ),

    identifier: $ => /[A-Za-z_][A-Za-z0-9_]*/,

    number: $ => /\d+/
  }
});

function commaSep(rule) {
    return optional(commaSep1(rule));
}
  
function commaSep1(rule) {
    return seq(rule, repeat(seq(',', rule)));
}