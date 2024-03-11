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
            5,
        ],
        'selector-max-id': 1,
        // 'no-invalid-position-at-import-rule': null,
        // 'scss/at-extend-no-missing-placeholder': null,
    },
}