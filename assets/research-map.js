/* Dagre owns rank and node placement; HTML remains readable without it. */
(() => {
    const canvases = [...document.querySelectorAll('.map-canvas')];
    if (!window.dagre || !canvases.length) return;
    const svgNS = 'http://www.w3.org/2000/svg';

    function layout(canvas) {
        const nodes = [...canvas.querySelectorAll('.map-node')];
        const available = canvas.clientWidth;
        if (!available) return;
        const horizontal = available >= 880 || (canvas.dataset.graph === 'multimodal' && available >= 520);
        const nodeWidth = canvas.dataset.graph === 'multimodal' ? Math.min(215, available - 16) : horizontal
            ? Math.min(215, (available - 16 - 3 * 36) / 4)
            : Math.min(230, (available - 16 - 24) / 2);
        const graph = new dagre.graphlib.Graph().setGraph({
            rankdir: horizontal ? 'LR' : 'TB', align: horizontal ? undefined : 'UL',
            ranksep: 36, nodesep: 24, marginx: 8, marginy: 8
        }).setDefaultEdgeLabel(() => ({}));

        canvas.classList.add('is-laid-out');
        nodes.forEach(node => {
            node.style.width = `${nodeWidth}px`;
            graph.setNode(node.dataset.node, { width: node.offsetWidth, height: node.offsetHeight });
        });
        nodes.forEach(node => {
            if (node.dataset.from) graph.setEdge(node.dataset.from, node.dataset.node);
        });
        dagre.layout(graph);
        if (graph.graph().width > available + 1) throw new Error('Graph exceeds its container.');

        canvas.style.height = `${graph.graph().height}px`;
        // Center the computed graph without scaling text or changing edge geometry.
        const offset = Math.max(0, (available - graph.graph().width) / 2);
        nodes.forEach(node => {
            const position = graph.node(node.dataset.node);
            node.style.left = `${position.x - position.width / 2 + offset}px`;
            node.style.top = `${position.y - position.height / 2}px`;
        });

        const svg = canvas.querySelector('.map-lines');
        svg.setAttribute('viewBox', `0 0 ${available} ${graph.graph().height}`);
        svg.querySelectorAll('.map-edge').forEach(edge => edge.remove());
        graph.edges().forEach(edge => {
            const path = document.createElementNS(svgNS, 'path');
            path.setAttribute('class', 'map-edge');
            path.dataset.from = edge.v;
            path.dataset.to = edge.w;
            path.setAttribute('marker-end', `url(#arrow-${canvas.dataset.graph})`);
            const source = graph.node(edge.v), target = graph.node(edge.w);
            const boxes = graph.nodes().map(id => graph.node(id));
            // All lineage edges join adjacent ranks. Keep elbows in the computed
            // rank gap so diagonal segments cannot cut through sibling cards.
            if (horizontal) {
                const start = source.x + source.width / 2 + offset;
                const end = target.x - target.width / 2 + offset;
                const rankEnd = Math.max(...boxes.filter(n => n.x === source.x).map(n => n.x + n.width / 2));
                const rankStart = Math.min(...boxes.filter(n => n.x === target.x).map(n => n.x - n.width / 2));
                const middle = (rankEnd + rankStart) / 2 + offset;
                path.setAttribute('d', `M ${start} ${source.y} H ${middle} V ${target.y} H ${end}`);
            } else {
                const start = source.y + source.height / 2;
                const end = target.y - target.height / 2;
                const rankEnd = Math.max(...boxes.filter(n => n.y === source.y).map(n => n.y + n.height / 2));
                const rankStart = Math.min(...boxes.filter(n => n.y === target.y).map(n => n.y - n.height / 2));
                const middle = (rankEnd + rankStart) / 2;
                path.setAttribute('d', `M ${source.x + offset} ${start} V ${middle} H ${target.x + offset} V ${end}`);
            }
            svg.append(path);
        });
    }

    let frame;
    function scheduleLayout() {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => canvases.forEach(canvas => {
            try { layout(canvas); }
            catch (error) {
                // A dependency or measurement failure must never hide research content.
                canvas.classList.remove('is-laid-out');
                canvas.style.removeProperty('height');
                canvas.querySelectorAll('.map-node').forEach(node => node.removeAttribute('style'));
                console.warn('Research map is using its text fallback.', error);
            }
        }));
    }

    const widths = new WeakMap();
    const resizeObserver = new ResizeObserver(entries => {
        if (entries.some(({ target, contentRect }) => {
            if (widths.get(target) === contentRect.width) return false;
            widths.set(target, contentRect.width);
            return true;
        })) scheduleLayout();
    });
    canvases.forEach(canvas => resizeObserver.observe(canvas));
    new MutationObserver(scheduleLayout).observe(document.documentElement, {
        attributes: true, attributeFilter: ['lang']
    });
    document.fonts.ready.then(scheduleLayout);
    scheduleLayout();
})();
