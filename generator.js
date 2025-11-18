// ===========================
// Seeded Random Number Generator
// ===========================
class SeededRandom {
    constructor(seed) {
        this.seed = this.hashString(seed);
    }

    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    range(min, max) {
        return min + this.next() * (max - min);
    }

    int(min, max) {
        return Math.floor(this.range(min, max + 1));
    }

    choice(array) {
        return array[this.int(0, array.length - 1)];
    }

    boolean(probability = 0.5) {
        return this.next() < probability;
    }
}

// ===========================
// Magic Circle Generator
// ===========================
class MagicCircleGenerator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.maxRadius = Math.min(this.width, this.height) / 2 - 40;
    }

    generate(purpose, complexity, mode = 'circle') {
        this.rng = new SeededRandom(purpose + complexity + mode);
        this.complexity = complexity;
        this.mode = mode;

        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Set drawing style
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.lineWidth = 1.5;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        if (mode === 'formula') {
            // Generate runic formula
            if (complexity <= 3) {
                this.generateFormulaSimple();
            } else if (complexity <= 6) {
                this.generateFormulaModerate();
            } else {
                this.generateFormulaComplex();
            }
        } else {
            // Generate magic circle
            if (complexity <= 3) {
                this.generateSimple();
            } else if (complexity <= 6) {
                this.generateModerate();
            } else {
                this.generateComplex();
            }
        }
    }

    generateSimple() {
        // Single outer circle
        this.drawCircle(this.centerX, this.centerY, this.maxRadius * 0.8);

        // Inner circle
        this.drawCircle(this.centerX, this.centerY, this.maxRadius * 0.6);

        // Central rune
        this.drawRune(this.centerX, this.centerY, this.maxRadius * 0.3, this.rng.int(0, 8));

        // Small decorative elements
        const numSymbols = this.rng.int(3, 6);
        const radius = this.maxRadius * 0.7;
        for (let i = 0; i < numSymbols; i++) {
            const angle = (i / numSymbols) * Math.PI * 2;
            const x = this.centerX + Math.cos(angle) * radius;
            const y = this.centerY + Math.sin(angle) * radius;
            this.drawSmallSymbol(x, y, this.maxRadius * 0.05, angle);
        }
    }

    generateModerate() {
        // Multiple concentric circles
        const numCircles = this.rng.int(3, 5);
        for (let i = 0; i < numCircles; i++) {
            const radius = this.maxRadius * (0.3 + (i / numCircles) * 0.5);
            this.drawCircle(this.centerX, this.centerY, radius);
        }

        // Geometric base shape
        const sides = this.rng.choice([5, 6, 7, 8]);
        this.drawPolygon(this.centerX, this.centerY, this.maxRadius * 0.65, sides, 0);

        // Inner star
        this.drawStar(this.centerX, this.centerY, this.maxRadius * 0.4, sides, 0.4);

        // Runes around the circle
        const numRunes = this.rng.int(6, 10);
        const runeRadius = this.maxRadius * 0.75;
        for (let i = 0; i < numRunes; i++) {
            const angle = (i / numRunes) * Math.PI * 2 + this.rng.range(-0.1, 0.1);
            const x = this.centerX + Math.cos(angle) * runeRadius;
            const y = this.centerY + Math.sin(angle) * runeRadius;
            this.drawRune(x, y, this.maxRadius * 0.08, this.rng.int(0, 8), angle);
        }

        // Connecting lines
        this.drawRadialLines(this.centerX, this.centerY, this.maxRadius * 0.3, this.maxRadius * 0.65, numRunes);

        // Central focal point
        this.drawRune(this.centerX, this.centerY, this.maxRadius * 0.15, this.rng.int(0, 8));
    }

    generateComplex() {
        // Multiple layered circles with variation
        const numCircleLayers = this.rng.int(5, 8);
        for (let i = 0; i < numCircleLayers; i++) {
            const radius = this.maxRadius * (0.2 + (i / numCircleLayers) * 0.65);
            this.drawCircle(this.centerX, this.centerY, radius);

            // Add decorative patterns between some circles
            if (i % 2 === 0 && i > 0) {
                this.drawCircularPattern(this.centerX, this.centerY, radius, this.rng.int(16, 32));
            }
        }

        // Multiple geometric shapes at different scales
        const shapes = [
            { sides: this.rng.choice([5, 6, 7, 8]), radius: 0.75, rotation: 0 },
            { sides: this.rng.choice([5, 6, 7, 8]), radius: 0.55, rotation: Math.PI / this.rng.range(6, 12) },
            { sides: this.rng.choice([3, 4, 5]), radius: 0.35, rotation: this.rng.range(0, Math.PI) }
        ];

        shapes.forEach(shape => {
            this.drawPolygon(this.centerX, this.centerY, this.maxRadius * shape.radius, shape.sides, shape.rotation);
            this.drawStar(this.centerX, this.centerY, this.maxRadius * shape.radius * 0.8, shape.sides * 2, 0.3);
        });

        // Complex web of connecting lines
        const numNodes = this.rng.int(12, 20);
        const nodes = [];
        for (let i = 0; i < numNodes; i++) {
            const angle = (i / numNodes) * Math.PI * 2;
            const radiusVariation = this.rng.range(0.6, 0.8);
            const x = this.centerX + Math.cos(angle) * this.maxRadius * radiusVariation;
            const y = this.centerY + Math.sin(angle) * this.maxRadius * radiusVariation;
            nodes.push({ x, y, angle });
        }

        // Draw intricate connecting lines
        this.ctx.globalAlpha = 0.3;
        nodes.forEach((node, i) => {
            // Connect to nearby nodes
            for (let j = i + 1; j < nodes.length; j++) {
                const dist = Math.abs(i - j);
                if (dist <= 3 || (numNodes - dist) <= 3) {
                    this.drawLine(node.x, node.y, nodes[j].x, nodes[j].y);
                }
            }
            // Connect to center occasionally
            if (this.rng.boolean(0.3)) {
                this.drawLine(node.x, node.y, this.centerX, this.centerY);
            }
        });
        this.ctx.globalAlpha = 1.0;

        // Place runes at nodes
        nodes.forEach((node, i) => {
            this.drawRune(node.x, node.y, this.maxRadius * this.rng.range(0.06, 0.1), this.rng.int(0, 8), node.angle);
        });

        // Additional scattered runes in inner layers
        const innerRuneCount = this.rng.int(8, 16);
        for (let i = 0; i < innerRuneCount; i++) {
            const angle = this.rng.range(0, Math.PI * 2);
            const radius = this.rng.range(0.2, 0.5) * this.maxRadius;
            const x = this.centerX + Math.cos(angle) * radius;
            const y = this.centerY + Math.sin(angle) * radius;
            this.drawRune(x, y, this.maxRadius * 0.05, this.rng.int(0, 8), angle);
        }

        // Intricate circular inscriptions
        for (let layer = 0; layer < 3; layer++) {
            const radius = this.maxRadius * (0.82 + layer * 0.04);
            this.drawCircularInscription(this.centerX, this.centerY, radius, this.rng.int(30, 50));
        }

        // Central complex rune
        this.drawComplexCentralRune(this.centerX, this.centerY, this.maxRadius * 0.2);

        // Orbital elements
        const numOrbitals = this.rng.int(3, 6);
        for (let i = 0; i < numOrbitals; i++) {
            const angle = (i / numOrbitals) * Math.PI * 2;
            const orbitRadius = this.maxRadius * 0.15;
            const x = this.centerX + Math.cos(angle) * orbitRadius;
            const y = this.centerY + Math.sin(angle) * orbitRadius;
            this.drawOrbitalElement(x, y, this.maxRadius * 0.08, angle);
        }
    }

    // ===========================
    // Drawing Primitives
    // ===========================

    drawCircle(x, y, radius) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawPolygon(x, y, radius, sides, rotation = 0) {
        this.ctx.beginPath();
        for (let i = 0; i <= sides; i++) {
            const angle = (i / sides) * Math.PI * 2 + rotation;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.stroke();
    }

    drawStar(x, y, radius, points, innerRadiusFactor = 0.5) {
        this.ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
            const r = i % 2 === 0 ? radius : radius * innerRadiusFactor;
            const px = x + Math.cos(angle) * r;
            const py = y + Math.sin(angle) * r;
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawRadialLines(x, y, innerRadius, outerRadius, count) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const x1 = x + Math.cos(angle) * innerRadius;
            const y1 = y + Math.sin(angle) * innerRadius;
            const x2 = x + Math.cos(angle) * outerRadius;
            const y2 = y + Math.sin(angle) * outerRadius;
            this.drawLine(x1, y1, x2, y2);
        }
    }

    drawCircularPattern(x, y, radius, count) {
        const oldAlpha = this.ctx.globalAlpha;
        this.ctx.globalAlpha = 0.5;

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;

            if (this.rng.boolean(0.7)) {
                this.drawSmallSymbol(px, py, radius * 0.03, angle);
            }
        }

        this.ctx.globalAlpha = oldAlpha;
    }

    drawCircularInscription(x, y, radius, count) {
        const oldAlpha = this.ctx.globalAlpha;
        this.ctx.globalAlpha = 0.6;

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;

            const size = radius * 0.025;
            const type = this.rng.int(0, 3);

            this.ctx.save();
            this.ctx.translate(px, py);
            this.ctx.rotate(angle + Math.PI / 2);

            switch(type) {
                case 0:
                    this.drawLine(-size, 0, size, 0);
                    break;
                case 1:
                    this.drawLine(0, -size, 0, size);
                    this.drawLine(-size, 0, size, 0);
                    break;
                case 2:
                    this.drawLine(-size, -size, size, size);
                    break;
            }

            this.ctx.restore();
        }

        this.ctx.globalAlpha = oldAlpha;
    }

    // ===========================
    // Rune Drawing
    // ===========================

    drawRune(x, y, size, type, rotation = 0) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);

        const s = size;
        this.ctx.beginPath();

        switch(type % 9) {
            case 0: // Ansuz-like
                this.ctx.moveTo(0, -s);
                this.ctx.lineTo(0, s);
                this.ctx.moveTo(0, -s/2);
                this.ctx.lineTo(s/2, -s/4);
                this.ctx.moveTo(0, s/4);
                this.ctx.lineTo(s/2, s/2);
                break;

            case 1: // Berkano-like
                this.ctx.moveTo(0, -s);
                this.ctx.lineTo(0, s);
                this.ctx.moveTo(0, -s/2);
                this.ctx.lineTo(s/3, -s/4);
                this.ctx.lineTo(0, 0);
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(s/3, s/4);
                this.ctx.lineTo(0, s/2);
                break;

            case 2: // Thurisaz-like
                this.ctx.moveTo(0, -s);
                this.ctx.lineTo(0, s);
                this.ctx.moveTo(0, -s/2);
                this.ctx.lineTo(s/2, 0);
                this.ctx.lineTo(0, s/2);
                break;

            case 3: // Gebo-like
                this.ctx.moveTo(-s/2, -s/2);
                this.ctx.lineTo(s/2, s/2);
                this.ctx.moveTo(s/2, -s/2);
                this.ctx.lineTo(-s/2, s/2);
                break;

            case 4: // Algiz-like
                this.ctx.moveTo(0, s);
                this.ctx.lineTo(0, -s/3);
                this.ctx.lineTo(-s/2, -s);
                this.ctx.moveTo(0, -s/3);
                this.ctx.lineTo(s/2, -s);
                break;

            case 5: // Kenaz-like
                this.ctx.moveTo(0, -s);
                this.ctx.lineTo(0, s);
                this.ctx.moveTo(0, -s/2);
                this.ctx.lineTo(s/2, 0);
                break;

            case 6: // Ingwaz-like
                this.ctx.moveTo(-s/2, -s/2);
                this.ctx.lineTo(0, -s);
                this.ctx.lineTo(s/2, -s/2);
                this.ctx.lineTo(s/2, s/2);
                this.ctx.lineTo(0, s);
                this.ctx.lineTo(-s/2, s/2);
                this.ctx.closePath();
                break;

            case 7: // Ehwaz-like
                this.ctx.moveTo(-s/3, -s);
                this.ctx.lineTo(-s/3, s);
                this.ctx.moveTo(s/3, -s);
                this.ctx.lineTo(s/3, s);
                this.ctx.moveTo(-s/3, 0);
                this.ctx.lineTo(s/3, -s/2);
                this.ctx.moveTo(-s/3, 0);
                this.ctx.lineTo(s/3, s/2);
                break;

            case 8: // Mannaz-like
                this.ctx.moveTo(-s/2, s);
                this.ctx.lineTo(-s/2, -s);
                this.ctx.lineTo(0, -s/2);
                this.ctx.lineTo(s/2, -s);
                this.ctx.lineTo(s/2, s);
                break;
        }

        this.ctx.stroke();
        this.ctx.restore();
    }

    drawSmallSymbol(x, y, size, rotation = 0) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);

        const type = this.rng.int(0, 4);
        const s = size;

        this.ctx.beginPath();
        switch(type) {
            case 0: // Dot
                this.ctx.arc(0, 0, s/2, 0, Math.PI * 2);
                this.ctx.fill();
                break;
            case 1: // Cross
                this.ctx.moveTo(-s, 0);
                this.ctx.lineTo(s, 0);
                this.ctx.moveTo(0, -s);
                this.ctx.lineTo(0, s);
                this.ctx.stroke();
                break;
            case 2: // Diamond
                this.ctx.moveTo(0, -s);
                this.ctx.lineTo(s, 0);
                this.ctx.lineTo(0, s);
                this.ctx.lineTo(-s, 0);
                this.ctx.closePath();
                this.ctx.stroke();
                break;
            case 3: // Triangle
                this.ctx.moveTo(0, -s);
                this.ctx.lineTo(s, s);
                this.ctx.lineTo(-s, s);
                this.ctx.closePath();
                this.ctx.stroke();
                break;
        }

        this.ctx.restore();
    }

    drawComplexCentralRune(x, y, size) {
        this.ctx.save();
        this.ctx.translate(x, y);

        const s = size;

        // Outer circle
        this.drawCircle(0, 0, s);

        // Inner geometric pattern
        const sides = this.rng.choice([3, 4, 5, 6]);
        this.drawPolygon(0, 0, s * 0.7, sides, 0);

        // Central rune
        this.drawRune(0, 0, s * 0.4, this.rng.int(0, 8), 0);

        // Connecting lines from center
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
            this.drawLine(0, 0, Math.cos(angle) * s * 0.7, Math.sin(angle) * s * 0.7);
        }

        this.ctx.restore();
    }

    drawOrbitalElement(x, y, size, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);

        // Small circle
        this.drawCircle(0, 0, size);

        // Inner mark
        this.drawRune(0, 0, size * 0.5, this.rng.int(0, 8), 0);

        this.ctx.restore();
    }

    // ===========================
    // Runic Formula Generation
    // ===========================

    generateFormulaSimple() {
        // Simple branching structure
        const startX = this.centerX;
        const startY = this.centerY;

        // Central rune
        this.drawRune(startX, startY, this.maxRadius * 0.15, this.rng.int(0, 8));

        // Simple branches
        const numBranches = this.rng.int(2, 4);
        for (let i = 0; i < numBranches; i++) {
            const angle = (i / numBranches) * Math.PI * 2 + this.rng.range(-0.3, 0.3);
            const length = this.rng.range(60, 120);
            const endX = startX + Math.cos(angle) * length;
            const endY = startY + Math.sin(angle) * length;

            this.ctx.lineWidth = this.rng.range(1.5, 3);
            this.drawLine(startX, startY, endX, endY);

            // End rune
            this.drawRune(endX, endY, this.maxRadius * 0.08, this.rng.int(0, 8), angle);

            // Small geometric connector
            if (this.rng.boolean(0.6)) {
                this.drawSmallSymbol(endX, endY, this.maxRadius * 0.04, angle);
            }
        }
    }

    generateFormulaModerate() {
        // Multi-level branching
        const nodes = [{ x: this.centerX, y: this.centerY, level: 0 }];
        const allNodes = [...nodes];

        // Create branching structure
        for (let level = 0; level < 3; level++) {
            const currentLevelNodes = nodes.filter(n => n.level === level);

            currentLevelNodes.forEach(node => {
                const numBranches = this.rng.int(2, 3);
                const baseAngle = this.rng.range(0, Math.PI * 2);

                for (let i = 0; i < numBranches; i++) {
                    const angle = baseAngle + (i / numBranches) * Math.PI * 2 + this.rng.range(-0.4, 0.4);
                    const length = this.rng.range(50, 100) * (1 - level * 0.2);
                    const endX = node.x + Math.cos(angle) * length;
                    const endY = node.y + Math.sin(angle) * length;

                    // Bounds checking
                    if (endX > 50 && endX < this.width - 50 && endY > 50 && endY < this.height - 50) {
                        const newNode = { x: endX, y: endY, level: level + 1, parent: node };
                        nodes.push(newNode);
                        allNodes.push(newNode);

                        // Draw branch with varying width
                        this.ctx.lineWidth = this.rng.range(1.5, 3.5) * (1.3 - level * 0.3);
                        this.drawLine(node.x, node.y, endX, endY);
                    }
                }
            });
        }

        // Add runes at nodes
        allNodes.forEach((node, i) => {
            const size = this.maxRadius * this.rng.range(0.06, 0.12) * (1.2 - node.level * 0.2);
            this.drawRune(node.x, node.y, size, this.rng.int(0, 8), this.rng.range(0, Math.PI * 2));

            // Add geometric connectors
            if (this.rng.boolean(0.4)) {
                const geomSize = size * 0.8;
                const sides = this.rng.choice([3, 4, 5, 6]);
                this.ctx.lineWidth = 1;
                this.drawPolygon(node.x, node.y, geomSize, sides, this.rng.range(0, Math.PI));
            }
        });

        // Add some connecting lines between nearby nodes
        this.ctx.globalAlpha = 0.4;
        this.ctx.lineWidth = 1;
        for (let i = 0; i < allNodes.length; i++) {
            for (let j = i + 1; j < allNodes.length; j++) {
                const dx = allNodes[i].x - allNodes[j].x;
                const dy = allNodes[i].y - allNodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 80 && this.rng.boolean(0.2)) {
                    this.drawLine(allNodes[i].x, allNodes[i].y, allNodes[j].x, allNodes[j].y);
                }
            }
        }
        this.ctx.globalAlpha = 1;
    }

    generateFormulaComplex() {
        // Highly complex branching network
        const nodes = [{ x: this.centerX, y: this.centerY, level: 0, angle: 0 }];
        const allNodes = [...nodes];
        const branches = [];

        // Create intricate branching structure with more levels
        for (let level = 0; level < 5; level++) {
            const currentLevelNodes = nodes.filter(n => n.level === level);

            currentLevelNodes.forEach(node => {
                const numBranches = level === 0 ? this.rng.int(3, 5) : this.rng.int(2, 4);
                const spreadAngle = level === 0 ? Math.PI * 2 : this.rng.range(Math.PI * 0.6, Math.PI * 1.2);
                const baseAngle = level === 0 ? 0 : node.angle + this.rng.range(-0.5, 0.5);

                for (let i = 0; i < numBranches; i++) {
                    const angle = baseAngle + (i / numBranches) * spreadAngle + this.rng.range(-0.3, 0.3);
                    const length = this.rng.range(40, 90) * (1.2 - level * 0.15);
                    const endX = node.x + Math.cos(angle) * length;
                    const endY = node.y + Math.sin(angle) * length;

                    // Bounds checking
                    if (endX > 40 && endX < this.width - 40 && endY > 40 && endY < this.height - 40) {
                        const newNode = { x: endX, y: endY, level: level + 1, parent: node, angle: angle };
                        nodes.push(newNode);
                        allNodes.push(newNode);

                        // Draw branch with varying width based on level
                        const width = this.rng.range(1, 4) * (1.5 - level * 0.2);
                        this.ctx.lineWidth = width;

                        // Sometimes draw segmented lines
                        if (this.rng.boolean(0.3) && level > 1) {
                            const segments = this.rng.int(2, 4);
                            for (let s = 0; s < segments; s++) {
                                const t1 = s / segments;
                                const t2 = (s + 1) / segments;
                                const x1 = node.x + (endX - node.x) * t1;
                                const y1 = node.y + (endY - node.y) * t1;
                                const x2 = node.x + (endX - node.x) * t2;
                                const y2 = node.y + (endY - node.y) * t2;

                                if (s % 2 === 0) {
                                    this.drawLine(x1, y1, x2, y2);
                                }
                            }
                        } else {
                            this.drawLine(node.x, node.y, endX, endY);
                        }

                        branches.push({ start: node, end: newNode, width: width });
                    }
                }
            });
        }

        // Add runes at nodes with size variation
        allNodes.forEach((node, i) => {
            const baseSize = this.maxRadius * this.rng.range(0.04, 0.1);
            const size = baseSize * (1.3 - node.level * 0.15);
            const runeType = this.rng.int(0, 8);

            this.ctx.lineWidth = 1.5;
            this.drawRune(node.x, node.y, size, runeType, node.angle);

            // Add geometric connectors with varying complexity
            if (this.rng.boolean(0.5)) {
                const geomSize = size * this.rng.range(0.8, 1.3);
                const sides = this.rng.choice([3, 4, 5, 6, 7, 8]);
                this.ctx.lineWidth = 1;

                if (this.rng.boolean(0.5)) {
                    this.drawPolygon(node.x, node.y, geomSize, sides, this.rng.range(0, Math.PI));
                } else {
                    this.drawStar(node.x, node.y, geomSize, sides, this.rng.range(0.3, 0.6));
                }
            }

            // Additional small decorative elements
            if (this.rng.boolean(0.3) && node.level > 1) {
                const numDecorations = this.rng.int(2, 4);
                for (let d = 0; d < numDecorations; d++) {
                    const decorAngle = (d / numDecorations) * Math.PI * 2;
                    const decorDist = size * 1.5;
                    const decorX = node.x + Math.cos(decorAngle) * decorDist;
                    const decorY = node.y + Math.sin(decorAngle) * decorDist;
                    this.drawSmallSymbol(decorX, decorY, size * 0.3, decorAngle);
                }
            }
        });

        // Create web of connections between nearby nodes
        this.ctx.globalAlpha = 0.3;
        this.ctx.lineWidth = 0.8;
        const connectionsMade = new Set();

        for (let i = 0; i < allNodes.length; i++) {
            for (let j = i + 1; j < allNodes.length; j++) {
                const dx = allNodes[i].x - allNodes[j].x;
                const dy = allNodes[i].y - allNodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const key = `${i}-${j}`;

                if (dist < 100 && this.rng.boolean(0.15) && !connectionsMade.has(key)) {
                    this.drawLine(allNodes[i].x, allNodes[i].y, allNodes[j].x, allNodes[j].y);
                    connectionsMade.add(key);
                }
            }
        }
        this.ctx.globalAlpha = 1;

        // Add flowing connector paths
        this.ctx.globalAlpha = 0.5;
        this.ctx.lineWidth = 1;
        const numFlows = this.rng.int(5, 10);
        for (let f = 0; f < numFlows; f++) {
            const startNode = this.rng.choice(allNodes.filter(n => n.level <= 2));
            const endNode = this.rng.choice(allNodes.filter(n => n.level >= 2));

            if (startNode !== endNode) {
                this.drawFlowingLine(startNode.x, startNode.y, endNode.x, endNode.y, this.rng.int(3, 6));
            }
        }
        this.ctx.globalAlpha = 1;

        // Add small scattered symbols throughout
        const numScattered = this.rng.int(15, 30);
        this.ctx.globalAlpha = 0.6;
        for (let s = 0; s < numScattered; s++) {
            const node = this.rng.choice(allNodes);
            const offsetDist = this.rng.range(20, 50);
            const offsetAngle = this.rng.range(0, Math.PI * 2);
            const x = node.x + Math.cos(offsetAngle) * offsetDist;
            const y = node.y + Math.sin(offsetAngle) * offsetDist;

            if (x > 40 && x < this.width - 40 && y > 40 && y < this.height - 40) {
                this.drawSmallSymbol(x, y, this.maxRadius * 0.02, offsetAngle);
            }
        }
        this.ctx.globalAlpha = 1;
    }

    drawFlowingLine(x1, y1, x2, y2, segments) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);

        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const x = x1 + (x2 - x1) * t + this.rng.range(-10, 10);
            const y = y1 + (y2 - y1) * t + this.rng.range(-10, 10);
            this.ctx.lineTo(x, y);
        }

        this.ctx.stroke();
    }
}

// ===========================
// UI Control
// ===========================

const canvas = document.getElementById('magic-circle');
const generator = new MagicCircleGenerator(canvas);

const purposeInput = document.getElementById('purpose');
const complexitySlider = document.getElementById('complexity');
const complexityValue = document.getElementById('complexity-value');
const generateBtn = document.getElementById('generate-btn');
const randomBtn = document.getElementById('random-btn');
const exportBtn = document.getElementById('export-btn');
const modeCircleBtn = document.getElementById('mode-circle');
const modeFormulaBtn = document.getElementById('mode-formula');

let currentMode = 'circle';

const randomPurposes = [
    'Fireball', 'Protection', 'Summoning', 'Teleportation', 'Healing',
    'Lightning Strike', 'Ice Storm', 'Dark Ritual', 'Divine Light', 'Necromancy',
    'Transmutation', 'Scrying', 'Banishment', 'Enchantment', 'Illusion',
    'Time Stop', 'Meteor Swarm', 'Resurrection', 'Planar Binding', 'Wish',
    'Elemental Fury', 'Soul Trap', 'Astral Projection', 'Mind Control', 'Chaos Magic'
];

function generate() {
    const purpose = purposeInput.value || 'Magic';
    const complexity = parseInt(complexitySlider.value);
    generator.generate(purpose, complexity, currentMode);
}

function setMode(mode) {
    currentMode = mode;

    if (mode === 'circle') {
        modeCircleBtn.classList.add('active');
        modeFormulaBtn.classList.remove('active');
        generateBtn.textContent = 'Generate Circle';
    } else {
        modeFormulaBtn.classList.add('active');
        modeCircleBtn.classList.remove('active');
        generateBtn.textContent = 'Generate Formula';
    }

    generate();
}

complexitySlider.addEventListener('input', (e) => {
    complexityValue.textContent = e.target.value;
});

generateBtn.addEventListener('click', generate);

modeCircleBtn.addEventListener('click', () => setMode('circle'));
modeFormulaBtn.addEventListener('click', () => setMode('formula'));

randomBtn.addEventListener('click', () => {
    const randomPurpose = randomPurposes[Math.floor(Math.random() * randomPurposes.length)];
    purposeInput.value = randomPurpose;
    generate();
});

exportBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    const purpose = purposeInput.value || 'Magic';
    const modeText = currentMode === 'circle' ? 'circle' : 'formula';
    link.download = `magic-${modeText}-${purpose.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
});

// Generate initial circle
generate();
