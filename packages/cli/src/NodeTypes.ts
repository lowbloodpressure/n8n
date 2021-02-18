import {
	INodeType,
	INodeTypeData,
	INodeTypes,
	INodeVersionedType,
	NodeHelpers,
} from 'n8n-workflow';


class NodeTypesClass implements INodeTypes {

	nodeTypes: INodeTypeData = {};


	async init(nodeTypes: INodeTypeData): Promise<void> {
		// Some nodeTypes need to get special parameters applied like the
		// polling nodes the polling times
		for (const nodeTypeData of Object.values(nodeTypes)) {
			const nodeType = NodeHelpers.getVersionedTypeNode(nodeTypeData.type);
			const applyParameters = NodeHelpers.getSpecialNodeParameters(nodeType);

			if (applyParameters.length) {
				nodeType.description.properties.unshift.apply(nodeType.description.properties, applyParameters);
			}
		}
		this.nodeTypes = nodeTypes;
	}

	getAll(): Array<INodeType | INodeVersionedType> {
		return Object.values(this.nodeTypes).map((data) => data.type);
	}

	getByName(nodeType: string): INodeType | INodeVersionedType | undefined {
		if (this.nodeTypes[nodeType] === undefined) {
			throw new Error(`The node-type "${nodeType}" is not known!`);
		}
		return this.nodeTypes[nodeType].type;
	}

	getByNameAndVersion(nodeType: string, version?: number): INodeType {
		return NodeHelpers.getVersionedTypeNode(this.nodeTypes[nodeType].type, version);
	}
}


let nodeTypesInstance: NodeTypesClass | undefined;

export function NodeTypes(): NodeTypesClass {
	if (nodeTypesInstance === undefined) {
		nodeTypesInstance = new NodeTypesClass();
	}

	return nodeTypesInstance;
}
