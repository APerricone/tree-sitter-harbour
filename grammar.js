module.exports = grammar({
  name: 'Harbour',
  extras: $ => [
    /[ \t]/,
    $.comment,
    $._semicolonEndline,
  ],
  rules: {
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $._endline,
      $.function_definition,
      $.procedure_definition
      // TODO: other kinds of definitions
    ),

    function_definition: $ => seq(
      /func(t(i(o(n)?)?)?)?/i,
      $.identifier,
      $.parameter_list,
      $._endline,
      repeat($.local_list),
      repeat($._statementFunc)
    ),

    procedure_definition: $ => seq(
      /proc(e(d(u(r(e)?)?)?)?)?/i,
      $.identifier,
      $.parameter_list,
      $._endline,
      repeat($.local_list),
      repeat($._statementProc)
    ),

    parameter_list: $ => seq(
      '(',
      commaSep($.identifier),
      ')'
    ),

    local_list: $ => seq(
        /loca(l)?/i,
        commaSep1($.identifier),
        $._endline
    ),
    
    _statementProc: $ => seq(choice(
      $.assignment_statement,
      $.function_call,
      $.return_none_statement
      // TODO: other kinds of statements
    ),$._endline),

    _statementFunc: $ => seq(choice(
      $.assignment_statement,
      $.function_call,
      $.return_statement
      // TODO: other kinds of statements
    ),$._endline),

    function_call: $ => seq(
      $.identifier,
      "(",
      commaSep($._expression),
      ")"
    ),

    assignment_statement: $ => seq(
      $.identifier,
      ':=',
      $._expression
    ),
    return_none_statement: $ => 'return',

    return_statement: $ => seq(
      'return',
      $._expression),

    _expression: $ => choice(
      $.identifier,
      $.unary_expression,
      $.binary_expression,
      $.number,
      $.function_call
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

    number: $ => /\d+(\.\d+)?/,

    _endline: $ => /[\r\n]{1,2}|;/,

    comment: $ => token(choice(
      seq('//', /[^\r\n]*/),  
      seq('&&', /[^\r\n]*/),
      // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/'
      )
    )),
    
    _semicolonEndline: $ => token(seq(
      ";",
      /[\r\n]{1,2}/
    ))
  }
});

function commaSep(rule) {
    return optional(commaSep1(rule));
}
  
function commaSep1(rule) {
    return seq(rule, repeat(seq(',', rule)));
}