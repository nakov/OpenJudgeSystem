module.exports = {
    'extends': [
        'stylelint-config-standard',
        'stylelint-config-sass-guidelines',
    ],
    'customSyntax': 'postcss-scss',
    'rules': {
        'selector-class-pattern': null,
        'scss/percent-placeholder-pattern': null,
        'max-nesting-depth': [
            3,
        ]
    },
}