
const {
    isNil,
} = require('./checkers');

const {
    getDepedenciesQuery,
} = require('./queriesBuilder');

const buildDependencyGraph = async (sql, tableNames) => {
    const depsQuery = getDepedenciesQuery(tableNames);
    const { recordset: edges } = await sql.query(depsQuery);

    const graph = tableNames.reduce((g, tn) => {
        g[tn] = [];
        return g;
    }, {});

    edges.forEach(({ parent, child }) => {
        // Dependency is irrelevant with current data
        if (tableNames.indexOf(child) < 0) {
            return;
        }

        // This breaks circular dependency in tables
        if (parent === child) {
            return
        }

        graph[parent].push(child);
    });
    return graph;
}

const buildCounts = (graph) => {
    const counts = {};

    Object
        .keys(graph)
        .forEach(vertex => {
            if (isNil(counts[vertex])) {
                counts[vertex] = 0;
            }

            graph[vertex].forEach((next) => {
                if (isNil(counts[next])) {
                    counts[next] = 0;
                }

                counts[next] += 1;
            })
        });

    return counts;
}

const topologicalSort = (graph, counts) => {
    const sortedVertices = [];
    
    // Find initial `top` vertices
    const nodes = Object
        .keys(counts)
        .filter(vertex => counts[vertex] === 0);


    while (nodes.length > 0) {
        // Get next `top` vertex
        const vertex = nodes.pop();

        // Add to result
        sortedVertices.push(vertex);

        // Remove edge and update dependencies
        graph[vertex].forEach((next) => {
            counts[next] -= 1;

            // Try to add new `top` vertex
            if(counts[next] === 0) {
                nodes.push(next);
            }
        });
    }

    return sortedVertices;
}

const getTablesOrder = async (sql, tableNames) => {
    const graph = await buildDependencyGraph(sql, tableNames);
    const counts = buildCounts(graph);
    return topologicalSort(graph, counts);
}

module.exports = {
    getTablesOrder,
}