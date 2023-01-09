import ITreeItemType from './tree-types';

interface IAllowedStrategyTypes {
    id: number;
    name: string;
}

interface ICategoryStrategiesTypes extends ITreeItemType {
    allowedStrategyTypes?: IAllowedStrategyTypes[];
}

export default ICategoryStrategiesTypes;
