/* eslint-disable import/prefer-default-export */

enum StrategyType {
    // Code strategies
    Cpp = 'cpp',
    DotNet = 'dotnet',
    Go = 'go',
    Java = 'java',
    JavaScript = 'js',
    Php = 'php',
    Python = 'py',
    Ruby = 'ruby',

    // HTML & CSS strategies
    HtmlCss = 'html-css',

    // Database strategies
    MySql = 'mysql',
    SqlServer = 'sql-server',

    // Other strategies
    PlainText = 'plain-text',
    FileUpload = 'file-upload',

    // Unknown strategies
    Unknown = 'unknown',
}

export { StrategyType };
