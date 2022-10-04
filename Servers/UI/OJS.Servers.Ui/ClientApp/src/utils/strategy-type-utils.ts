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

const typeToIcon: IDictionary<FC<IIconProps>> = {
    [StrategyType.Cpp]: CppIcon,
    [StrategyType.DotNet]: DotNetIcon,
    [StrategyType.Go]: GoIcon,
    [StrategyType.Java]: JavaIcon,
    [StrategyType.JavaScript]: JavaScriptIcon,
    [StrategyType.Php]: PhpIcon,
    [StrategyType.Python]: PythonIcon,
    [StrategyType.Ruby]: RubyIcon,
    [StrategyType.HtmlCss]: HtmlCssIcon,
    [StrategyType.MySql]: MySqlIcon,
    [StrategyType.SqlServer]: SqlServerIcon,
    [StrategyType.PlainText]: PlainTextIcon,
    [StrategyType.FileUpload]: FileUploadIcon,
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

const strategyTypeToIcon = (type: StrategyType): FC<IIconProps> | null =>
    isNil(typeToIcon[type])
        ? null
        : typeToIcon[type];

export {
    strategyTypeToIcon,
    fullStrategyNameToStrategyType,
};
