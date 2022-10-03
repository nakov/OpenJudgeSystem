import { FC } from 'react';
import { isNil } from 'lodash';
import { IIconProps } from '../components/guidelines/icons/Icon';
import MySqlIcon from '../components/guidelines/icons/strategies/MySqlIcon';
import JavaIcon from '../components/guidelines/icons/strategies/JavaIcon';
import PythonIcon from '../components/guidelines/icons/strategies/PythonIcon';
import JavaScriptIcon from '../components/guidelines/icons/strategies/JavaScriptIcon';
import DotNetIcon from '../components/guidelines/icons/strategies/DotNetIcon';
import CppIcon from '../components/guidelines/icons/strategies/CppIcon';
import { StrategyType } from '../common/strategy-types';
import { IDictionary } from '../common/common-types';
import GoIcon from '../components/guidelines/icons/strategies/GoIcon';
import PhpIcon from '../components/guidelines/icons/strategies/PhpIcon';
import RubyIcon from '../components/guidelines/icons/strategies/RubyIcon';
import HtmlCssIcon from '../components/guidelines/icons/strategies/HtmlCssIcon';
import SqlServerIcon from '../components/guidelines/icons/strategies/SqlServerIcon';
import PlainTextIcon from '../components/guidelines/icons/strategies/PlainTextIcon';
import FileUploadIcon from '../components/guidelines/icons/strategies/FileUploadIcon';

const shortNameToType: IDictionary<StrategyType> = {
    mysql: StrategyType.MySql,
    'sql server': StrategyType.SqlServer,
    '.net': StrategyType.DotNet,
    dotnet: StrategyType.DotNet,
    'c#': StrategyType.DotNet,
    python: StrategyType.Python,
    java: StrategyType.Java,
    javascript: StrategyType.JavaScript,
    js: StrategyType.JavaScript,
    'c++': StrategyType.Cpp,
    go: StrategyType.Go,
    php: StrategyType.Php,
    ruby: StrategyType.Ruby,
    'html and css': StrategyType.HtmlCss,
    'plain text': StrategyType.PlainText,
    'file upload': StrategyType.FileUpload,
};

const fullStrategyNameToStrategyType = (strategyName: string): StrategyType => {
    const strategyNameToLower = strategyName.toLowerCase();

    // Sorting here resolves that `java` is `included` in `javascript`:
    // `['java', 'javascript'].pop()` returns `javascript` 
    const strategyKey = Object.keys(shortNameToType)
        .sort()
        .filter(name => strategyNameToLower.includes(name))
        .pop();

    return isNil(strategyKey)
        ? StrategyType.Unknown
        : shortNameToType[strategyKey];
};


const typeToIcon: IDictionary<FC<IIconProps>> = {
    [StrategyType.Cpp.toString()]: CppIcon,
    [StrategyType.DotNet.toString()]: DotNetIcon,
    [StrategyType.Go.toString()]: GoIcon,
    [StrategyType.Java.toString()]: JavaIcon,
    [StrategyType.JavaScript.toString()]: JavaScriptIcon,
    [StrategyType.Php.toString()]: PhpIcon,
    [StrategyType.Python.toString()]: PythonIcon,
    [StrategyType.Ruby.toString()]: RubyIcon,
    [StrategyType.HtmlCss.toString()]: HtmlCssIcon,
    [StrategyType.MySql.toString()]: MySqlIcon,
    [StrategyType.SqlServer.toString()]: SqlServerIcon,
    [StrategyType.PlainText.toString()]: PlainTextIcon,
    [StrategyType.FileUpload.toString()]: FileUploadIcon,
};


const strategyTypeToIcon = (type: StrategyType): FC<IIconProps> | null =>
    isNil(typeToIcon[type])
        ? null
        : typeToIcon[type];

export {
    strategyTypeToIcon,
    fullStrategyNameToStrategyType,
};
