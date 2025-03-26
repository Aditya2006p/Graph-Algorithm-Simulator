
const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
const logDiv = document.getElementById("log");
let nodes = [], edges = [], selectedNode = null;

canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let clickedNode = nodes.find(node => Math.hypot(node.x - x, node.y - y) < 20);
    if (clickedNode) {
        if (selectedNode && selectedNode !== clickedNode) {
            let weight = Math.floor(Math.random() * 10) + 1;
            edges.push({ from: selectedNode, to: clickedNode, weight });
            selectedNode = null;
        } else {
            selectedNode = clickedNode;
        }
    } else {
        nodes.push({ x, y, id: nodes.length });
    }
    drawGraph();
});

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    edges.forEach(edge => {
        ctx.beginPath();
        ctx.moveTo(edge.from.x, edge.from.y);
        ctx.lineTo(edge.to.x, edge.to.y);
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillText(edge.weight, (edge.from.x + edge.to.x) / 2, (edge.from.y + edge.to.y) / 2);
    });
    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = "lightblue";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillText(node.id, node.x - 5, node.y + 5);
    });
}

function logMessage(message) {
    logDiv.innerHTML += message + "<br>";
}

function startBFS() {
    let queue = [nodes[0]];
    let visited = new Set();
    logDiv.innerHTML = "<strong>BFS Execution:</strong><br>";
    function step() {
        if (queue.length === 0) return;
        let node = queue.shift();
        if (visited.has(node)) return step();
        visited.add(node);
        logMessage(`Visiting Node ${node.id}`);
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fill();
        edges.filter(e => e.from === node).forEach(edge => {
            if (!visited.has(edge.to)) queue.push(edge.to);
        });
        setTimeout(step, 500);
    }
    step();
}

function startDFS() {
    let stack = [nodes[0]];
    let visited = new Set();
    logDiv.innerHTML = "<strong>DFS Execution:</strong><br>";
    function step() {
        if (stack.length === 0) return;
        let node = stack.pop();
        if (visited.has(node)) return step();
        visited.add(node);
        logMessage(`Visiting Node ${node.id}`);
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fill();
        edges.filter(e => e.from === node).forEach(edge => {
            if (!visited.has(edge.to)) stack.push(edge.to);
        });
        setTimeout(step, 500);
    }
    step();
}

function startDijkstra() {
    let distances = {};
    let visited = new Set();
    let queue = [{ node: nodes[0], cost: 0 }];
    nodes.forEach(node => distances[node.id] = Infinity);
    distances[nodes[0].id] = 0;
    logDiv.innerHTML = "<strong>Dijkstra Execution:</strong><br>";
    function step() {
        if (queue.length === 0) return;
        queue.sort((a, b) => a.cost - b.cost);
        let { node, cost } = queue.shift();
        if (visited.has(node)) return step();
        visited.add(node);
        logMessage(`Visiting Node ${node.id} with cost ${cost}`);
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fill();
        edges.filter(e => e.from === node).forEach(edge => {
            let newCost = cost + edge.weight;
            if (newCost < distances[edge.to.id]) {
                distances[edge.to.id] = newCost;
                queue.push({ node: edge.to, cost: newCost });
                logMessage(`Updating distance of Node ${edge.to.id} to ${newCost}`);
            }
        });
        setTimeout(step, 500);
    }
    step();
}