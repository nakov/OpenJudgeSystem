import { FC } from 'react';
import { IIconProps } from '../components/guidelines/icons/Icon';
import MySqlIcon from '../components/guidelines/icons/strategies/MySqlIcon';
import JavaIcon from '../components/guidelines/icons/strategies/JavaIcon';
import PythonIcon from '../components/guidelines/icons/strategies/PythonIcon';
import JavaScriptIcon from '../components/guidelines/icons/strategies/JavaScriptIcon';
import DotNetIcon from '../components/guidelines/icons/strategies/DotNetIcon';
import CppIcon from '../components/guidelines/icons/strategies/CppIcon';
import { StrategyType } from '../common/strategy-types';

const fullStrategyNameToStrategyType = (strategyName: string): StrategyType => {
    const strategyNameToLower = strategyName.toLowerCase();

    if (strategyNameToLower.includes('mysql')) {
        return StrategyType.MySql;
    }

    if (strategyNameToLower.includes('.net') || strategyNameToLower.includes('c#')) {
        return StrategyType.DotNet;
    }

    if (strategyNameToLower.includes('python')) {
        return StrategyType.Python;
    }

    if (strategyNameToLower.includes('javascript') || strategyNameToLower.includes('js')) {
        return StrategyType.JavaScript;
    }

    if (strategyNameToLower.includes('java')) {
        return StrategyType.Java;
    }

    if(strategyNameToLower.includes('c++')) {
        return StrategyType.Cpp;
    }

    return StrategyType.Unknown;
};

const strategyTypeToIcon = (type: StrategyType): FC<IIconProps> | null => {
    switch (type) {
    case StrategyType.MySql:
        return MySqlIcon;
    case StrategyType.Java:
        return JavaIcon;
    case StrategyType.Python:
        return PythonIcon;
    case StrategyType.JavaScript:
        return JavaScriptIcon;
    case StrategyType.DotNet:
        return DotNetIcon;
    case StrategyType.Cpp:
        return CppIcon;
    default:
        return null;
    }
};


export {
    strategyTypeToIcon,
    fullStrategyNameToStrategyType,
};
