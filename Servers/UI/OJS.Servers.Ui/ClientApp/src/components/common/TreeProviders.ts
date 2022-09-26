interface ITreeItemType {
    id: string,
    name: string,
    parentId?: string,
    children?: ITreeItemType[],
}

interface ITreeProps {
    items: ITreeItemType[];
    onTreeLabelClick: (node: ITreeItemType) => void;
    defaultSelected?: string;
    defaultExpanded?: string[];
}

export type {
    ITreeItemType,
    ITreeProps,
};
