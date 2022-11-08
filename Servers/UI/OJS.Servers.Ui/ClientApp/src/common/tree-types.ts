interface ITreeItemType {
    id: string;
    name: string;
    parentId?: string;
    children?: ITreeItemType[];
}

export default ITreeItemType;
