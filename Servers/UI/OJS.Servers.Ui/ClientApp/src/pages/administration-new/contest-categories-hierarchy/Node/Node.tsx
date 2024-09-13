import React from 'react';
import { NodeRendererProps } from 'react-arborist';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { IContestCategoryHierarchy } from '../../../../common/types';

// eslint-disable-next-line css-modules/no-unused-class
import styles from '../AdministrationContestCategoriesHierarchy.module.scss';

type NodeProps = NodeRendererProps<IContestCategoryHierarchy> & {
    isActive: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Node = ({ node, style, dragHandle, tree, isActive }: NodeProps) => (
    <div
      className={styles.node}
      style={style}
      ref={dragHandle}
      onClick={() => {
          // A leaf node is a node ( category ) that does NOT have children
          if (!node.isLeaf) {
              node.toggle();
          }
      }}
    >
        <span className={styles.cardContainer}>
            <ArrowForwardIosIcon
              className={(node.children?.length ?? 0) <= 0 || node.isLeaf
                  ? styles.hidden
                  : `${styles.icon} ${
                      node.isOpen
                          ? styles.iconOpen
                          : styles.iconClosed
                  }`}
              fontSize="inherit"
            />
            <span className={`${styles.nodeName} ${isActive && styles.lightRed}`}>
                {node.data?.name}
            </span>
        </span>
    </div>
);

export default Node;
