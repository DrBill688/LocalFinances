# -*- coding: utf-8 -*-
"""
Created on Fri Oct 11 16:49:47 2024

@author: wrone
"""
import logging, networkx, os.path, io, base64
import matplotlib.pyplot as plt
plt.switch_backend('Agg')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
spammers = ['matplotlib.font_manager',
            'PIL.Image',
            'PIL.PngImagePlugin',
            'matplotlib.pyplot']
for spammer in spammers:
    spamlogger = logging.getLogger(spammer)
    spamlogger.setLevel(logging.WARNING)

GMLPATH='c:\\users\\wrone\\Downloads\\'

class QuerySpec:
    def __init__(self, G):
        self.G = G
        self.res = {}
        return 
    def __str__(self):
        return "Query Spec is ...?"
    def fetch(self):
        logger.debug('Fetching')
        return self.res
    def filterEqual(self, nodetype: str, nodevals):
        return self._filter(nodetype, 'eq', nodevals)
    def filterNotEqual(self, nodetype: str, nodevals):
        return self._filter(nodetype, 'neq', nodevals)
    def _filter(self, nodetype: str, evalAs, nodevals):
        nbunch = []
        if isinstance(nodevals, str):
            nbunch = [nodevals]
        elif isinstance(nodevals, list):
            nbunch = nodevals
        else:
            raise ValueError(f'filter: Incorrect type ({type(nodevals)})')
        return self
    def include(self, nodetypes): #mutable only latest when
        nbunch = []
        if isinstance(nodetypes, str):
            nbunch = [nodetypes]
        elif isinstance(nodetypes, list):
            nbunch = nodetypes
        else:
            raise ValueError(f'include: Incorrect type ({type(nodetypes)})')
        logger.debug(f'including {nbunch}')
        for nt in nbunch:
            for m in self.G.predecessors(nt):
                self.res[m] = {'Type': nt}
        self.res
        return self
    def include_history(self, nodetypes): #if immutable, treat as include
        nbunch = []
        if isinstance(nodetypes, str):
            nbunch = [nodetypes]
        elif isinstance(nodetypes, list):
            nbunch = nodetypes
        else:
            raise ValueError(f'include_history: Incorrect type ({type(nodetypes)})')
        return self
    def union(self):
        return self
    def intersection(self):
        return self
    def getAllFrom(self, n):
        res = {}
        if type(n) == str:
            res = {n: {}}
            logger.info(f'Pulling for {res}')
            curres = res[n]
            stack = [curres]
            logger.info(f'push=>{stack}')
            pParent = n
            pChild = pRelation = None
            for parent, child, relation in [(m[1], m[0], self.G.get_edge_data(m[0], m[1])['relation']) for m in networkx.edge_dfs(self.G, n, "reverse")]:
                logger.info(f'==comp=>{parent} : {child} : {relation} against {pParent} : {pChild} : {pRelation}')
                if parent != pParent:
                    if parent == pChild:
                        curres[pRelation] = {pChild:{}}
                        stack.append(curres)
                        logger.info(f'push=>{stack}')
                        curres = curres[pRelation][pChild]
                    else:
                        curres = stack.pop()
                        logger.info(f'pop=>{stack}')
                curres[relation] = child
                pParent = parent
                pChild = child
                pRelation = relation
                    
        else:
            #logger.info(f'nbunch: {list(n)}')
            for m in list(n):
                logger.info(f'\t{m}')
                res = {**res, **self.getAllFrom(m) }
        logger.info(f'RETURNING {res}')
        return res
class GraphDatabase:
    def __init__(self):
        logger.debug('Creating a DataGraph')
        self.G = networkx.DiGraph()
    def __str__(self):
        return f'{self.G}'
    def isEmpty(self):
        return self.G.number_of_nodes() == 0
    def query(self):
        logger.debug('Returning new QuerySpec')
        return QuerySpec(self.G)
    def save(self, fname):
        logger.debug(f'Saving to {fname}')
        networkx.write_gml(self.G, fname)
        return self
    def load(self, fname):
        if type(fname) == type(''):
            logger.debug(f'loading {fname}')
            if os.path.isfile(fname):
                self.G = networkx.read_gml(fname)
        elif type(fname) == type(b''):
            self.G = networkx.parse_gml(fname.decode('utf-8'))
        else:
            raise ValueError(f'Unknown GraphDatabase.load({type(fname)}) not {type(b'')}')
        return self
    def merge(self, OtherDG: networkx.DiGraph):
        if self.G is None:
            self.G = networkx.DiGraph()
        self.G = networkx.compose(self.G, OtherDG.G)
        return self
    def visualize(self):
        def whatIsThis(G: networkx.DiGraph, layerElement: str):
            whatIs = 'Unknown'
            if G.out_degree(layerElement) == 0:
                whatIs = 'Root'
            else:
                if False:
                    possibilities = [m for m in networkx.dfs_edges(G, layerElement, depth_limit=1) if G.get_edge_data(m[0], m[1])['relation'] == 'type_of']
                    if len(possibilities) > 0:
                        whatIs = possibilities[0][1]
                else:
                    for m in networkx.dfs_edges(G, layerElement, depth_limit=1):
                        if G.get_edge_data(m[0], m[1])['relation'] == 'type_of':
                            whatIs = m[1]
                            break
            return whatIs
        def showLink(G: networkx.DiGraph, typeStart: str, typeEnd: str):
            for edge in G.edges:
                if ((whatIsThis(G, edge[0]) == typeStart) and
                    (whatIsThis(G, edge[1]) == typeEnd)):
                    logger.info(f'Debug Edge: {edge}')
            return
        def showTree(G: networkx.DiGraph, node: str):
            children = [m for m in networkx.df_edges(G, node, depth_limit = 1) if m[1] != 'Unknown']
            logger.info(f'Debug links for {node}')
            for child in children:
                logger.info(f'{child} => {G.get_edge_data(child[0], child[1])}')
            return
        logger.debug(f'Visualizing {self.G}')
        DG = networkx.DiGraph()
        for edge in self.G.edges:
            edgeData = self.G.get_edge_data(edge[0], edge[1])
            logger.debug(f'Edge Data: {edgeData}')
            if (whatIsThis(self.G, edge[0]) == whatIsThis(self.G, edge[1])):
                raise RecursionError(f'Loop Detected {edge[0]}:{whatIsThis(self.G, edge[0])} => {edge[1]}:{whatIsThis(self.G, edge[1])}')
            DG.add_edge(whatIsThis(self.G, edge[0]), whatIsThis(self.G, edge[1]), relation=edgeData['relation'])
        try:
            DG.remove_node('Root')
        finally:
            plt.clf()
            pos = networkx.forceatlas2_layout(DG, dissuade_hubs=True, linlog=False)
            options = {"with_labels": True, "alpha": 0.5, "node_size": 50, "font_size": 12}
            fig, ax = plt.subplots()
            fig.set_size_inches(11, 8.5)
            networkx.draw_networkx(DG, pos = pos, **options)
            buffer = io.BytesIO()
            plt.savefig(buffer)
            buffer.seek(0)
            return base64.b64encode(buffer.getvalue()).decode()
    def addNode(self, thisNode:str , isA: str):
        self.G.add_edge(thisNode, isA, relation='type_of')
        return
    def addLinkage(self, thisNode:str , isA: str, relatedTo: str):
        if self.G.has_node(relatedTo) == False:
            raise ValueError(f'{relatedTo} has not been predefined')
        self.addNode(thisNode, isA)
        self.G.add_edge(thisNode, relatedTo, relation=isA)
        return
    def addImmutableAttribute(self, value: str, attr: str, nodename: str):
        if self.G.has_node(nodename) == False:
            raise ValueError(f'{nodename} has not been predefined')
        self.G.nodes[nodename][attr] = value
        return
    def addMutableAttribute(self, value: str, attr: str, nodename: str, mutation: dict):
        # mutation should be a dictionary containing {when, who} so attr.when.who = value
        if self.G.has_node(nodename) == False:
            raise ValueError(f'{nodename} has not been predefined')
        self.G.nodes[nodename][attr] = value
        return
