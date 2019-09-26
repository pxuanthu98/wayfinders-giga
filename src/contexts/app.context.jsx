import React, { Component } from 'react';
import Graph from 'node-dijkstra';
import { serializeGraphsToData, addVertexToGraphs, removeVertexFromGraphs } from '../helpers';
import { deserializeDataToGraphs } from '../shared';
export const AppContext = React.createContext();
export default class AppProvider extends Component {
    state = {
        graphs: {},
        route: null,
        vertex1: "",
        vertex2: "",
        feature: "",
        data: [],
        isDrawedEdges: false,
        shortestPath: [],
        startIndex: 0
    };
    setStateAsync = state => {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    };
    handleGraphsFileUpload = e => {
        const reader = new FileReader();
        reader.onload = async e => {
            const graphsStr = await e.target.result;
            const graphsJson = JSON.parse(graphsStr);
            await this.handleGraphsChange(graphsJson);
        };
        reader.readAsText(e.target.files[0]);
    };
    handleGraphsChange = async graphs => {
        const data = await serializeGraphsToData(graphs);
        return await this.setStateAsync({ graphs: graphs, route: new Graph({ ...graphs }), data: data });
    };
    handleDataChange = async data => {
        const graphs = await deserializeDataToGraphs(data);
        return await this.handleGraphsChange(graphs);
    }
    removeRelationship = async (nodeId, neighborId) => {
        return await removeVertexFromGraphs(nodeId, neighborId, this.state.graphs, this.handleGraphsChange);
    };
    addVertexToGraphs = async (vertex1, vertex2) => {
        return await addVertexToGraphs(vertex1, vertex2, this.state.graphs, this.handleGraphsChange);
    };


    setVertex = (vertex) => {
        console.log("setVertex", vertex);

        return this.setState({ ...vertex });
    }
    setFeature = feature => {
        return this.setState({ feature: feature });
    };
    setDrawedEdge = isDrawedEdges => {
        return this.setState({ isDrawedEdges: isDrawedEdges });
    };
    setShortestPath = (path) => {
        return this.setState({ shortestPath: path });
    };
    setStartIndex = (index) => {
        return this.setState({ startIndex: index });
    }
    render() {
        return (
            <AppContext.Provider value={{
                ...this.state,
                handleGraphsFileUpload: this.handleGraphsFileUpload,
                handleGraphsChange: this.handleGraphsChange,
                setFeature: this.setFeature,
                setDrawedEdge: this.setDrawedEdge,
                setShortestPath: this.setShortestPath,
                setVertex: this.setVertex,
                removeRelationship: this.removeRelationship,
                handleDataChange: this.handleDataChange,
                addVertexToGraphs: this.addVertexToGraphs,
                setStartIndex: this.setStartIndex,
            }}>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}
