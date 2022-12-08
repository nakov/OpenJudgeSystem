interface IAllowedStrategyTypes {
    id: number;
    name: string;
}

interface ITreeItemType {
    id: string;
    name: string;
    parentId?: string;
    children?: ITreeItemType[];
    allowedStrategyTypes: IAllowedStrategyTypes[];
}

export default ITreeItemType;
