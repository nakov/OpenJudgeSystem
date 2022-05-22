import React from "react";
import {TreeView, TreeItem} from "@material-ui/lab";
import {MdChevronRight, MdExpandMore} from "react-icons/md";
import {isArray} from "lodash";

import styles from './Tree.module.scss';

interface ITreeItemType {
    id: string,
    name: string,
    children?: ITreeItemType[],
}

interface ITreeProps {
    items: ITreeItemType[],
    handleTreeItemClick: (node: ITreeItemType) => void,   
}

const Tree = ({
    items,
    handleTreeItemClick,
} : ITreeProps) => {
    const renderTree = (node: ITreeItemType) => (
        <TreeItem
            key={node.id}
            nodeId={node.id.toString()}
            label={node.name}
            onLabelClick={() => handleTreeItemClick(node)}
        >
            {isArray(node.children)
                ? node.children.map((child) => renderTree(child))
                : null}
        </TreeItem>
    );
    
    return <TreeView
        aria-label="rich object"
        defaultCollapseIcon={<MdExpandMore />}
        defaultExpandIcon={<MdChevronRight />}
        className={styles.root}
    >
        {items.map((c) => renderTree(c))}
    </TreeView>
}

export default Tree;

export type {
    ITreeItemType,
}