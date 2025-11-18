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

    generate(purpose, complexity) {
        this.rng = new SeededRandom(purpose + complexity);
        this.complexity = complexity;

        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Set drawing style
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.lineWidth = 1.5;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        // Generate based on complexity
        if (complexity <= 3) {
            this.generateSimple();
        } else if (complexity <= 6) {
            this.generateModerate();
        } else {
            this.generateComplex();
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
    generator.generate(purpose, complexity);
}

complexitySlider.addEventListener('input', (e) => {
    complexityValue.textContent = e.target.value;
});

generateBtn.addEventListener('click', generate);

randomBtn.addEventListener('click', () => {
    const randomPurpose = randomPurposes[Math.floor(Math.random() * randomPurposes.length)];
    purposeInput.value = randomPurpose;
    generate();
});

exportBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    const purpose = purposeInput.value || 'Magic';
    link.download = `magic-circle-${purpose.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
});

// Generate initial circle
generate();
